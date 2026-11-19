import type { ObjectId, WithoutId } from 'mongodb';
import { TOURNAMENTS } from '@/lib/constants';
import { getDb } from '@/lib/mongodb';
import type {
  Tournament,
  TournamentParticipant,
  TournamentScheduleItem,
  TournamentStandingsEntry,
} from '@/lib/types';

export const FCX_COLLECTION = 'fcx';
const LEGACY_TOURNAMENTS_COLLECTION = 'tournaments';

const FCX_STATUSES = ['upcoming', 'active', 'past'] as const;

export interface FcxDocument extends Tournament {
  createdAt: Date;
  updatedAt: Date;
  /** When true, skip auto-expiring to `past` after endDate. Set if an admin saves a non-past status on an already-ended event. */
  statusManuallySet?: boolean;
}

export type FcxInsert = WithoutId<FcxDocument>;

function normalizeStatus(value: unknown): Tournament['status'] {
  if (typeof value === 'string' && FCX_STATUSES.includes(value as Tournament['status'])) {
    return value as Tournament['status'];
  }
  return 'upcoming';
}

export function isFcxEndDatePast(endDate: string, now = new Date()): boolean {
  if (!endDate.trim()) return false;
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return false;
  return end.getTime() < now.getTime();
}

function resolveManualStatusFlag(status: Tournament['status'], endDate: string): boolean {
  return isFcxEndDatePast(endDate) && status !== 'past';
}

function applyAutoPastStatus(event: Tournament, statusManuallySet: boolean): Tournament {
  if (statusManuallySet || !isFcxEndDatePast(event.endDate) || event.status === 'past') {
    return event;
  }
  return { ...event, status: 'past' };
}

function normalizeParticipant(candidate: Partial<TournamentParticipant>): TournamentParticipant {
  return {
    id: candidate.id?.trim() ?? '',
    name: candidate.name?.trim() ?? '',
    type: candidate.type === 'player' ? 'player' : 'team',
    record: candidate.record?.trim() || undefined,
  };
}

function normalizeStanding(candidate: Partial<TournamentStandingsEntry>): TournamentStandingsEntry {
  return {
    rank: typeof candidate.rank === 'number' ? candidate.rank : 0,
    name: candidate.name?.trim() ?? '',
    played: typeof candidate.played === 'number' ? candidate.played : 0,
    points: typeof candidate.points === 'number' ? candidate.points : 0,
  };
}

function normalizeScheduleItem(candidate: Partial<TournamentScheduleItem>): TournamentScheduleItem {
  return {
    id: candidate.id?.trim() ?? '',
    label: candidate.label?.trim() ?? '',
    stage: candidate.stage?.trim() ?? '',
    date: candidate.date?.trim() ?? '',
  };
}

function normalizeCapacity(value: unknown): number | undefined {
  const n = typeof value === 'string' ? Number(value) : value;
  return typeof n === 'number' && Number.isInteger(n) && n > 0 ? n : undefined;
}

function normalizeFcxEvent(candidate: Partial<Tournament>): Tournament {
  return {
    id: candidate.id?.trim() ?? '',
    name: candidate.name?.trim() ?? '',
    game: candidate.game?.trim() ?? '',
    division: 'FCX',
    status: normalizeStatus(candidate.status),
    overview: candidate.overview?.trim() ?? '',
    format: candidate.format?.trim() ?? '',
    startDate: candidate.startDate?.trim() ?? '',
    endDate: candidate.endDate?.trim() ?? '',
    prizePool: candidate.prizePool?.trim() ?? '',
    registrationOpen: Boolean(candidate.registrationOpen),
    capacity: normalizeCapacity(candidate.capacity),
    image: candidate.image?.trim() ?? '',
    participants: Array.isArray(candidate.participants)
      ? candidate.participants.map(normalizeParticipant)
      : [],
    standings: Array.isArray(candidate.standings)
      ? candidate.standings.map(normalizeStanding)
      : [],
    schedule: Array.isArray(candidate.schedule)
      ? candidate.schedule.map(normalizeScheduleItem)
      : [],
    results: Array.isArray(candidate.results)
      ? candidate.results.map((line) => String(line).trim()).filter(Boolean)
      : [],
  };
}

export function toFcxEvent(doc: FcxDocument & { _id?: unknown }): Tournament {
  const {
    _id: _mongoId,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    statusManuallySet: _statusManuallySet,
    ...event
  } = doc;
  return event;
}

export async function getFcxCollection() {
  const db = await getDb();
  return db.collection<FcxDocument>(FCX_COLLECTION);
}

async function dedupeFcxBySlug() {
  const collection = await getFcxCollection();
  const docs = await collection.find().sort({ updatedAt: -1, createdAt: -1 }).toArray();
  const seen = new Set<string>();
  const duplicateIds: ObjectId[] = [];

  for (const doc of docs) {
    if (seen.has(doc.id)) {
      duplicateIds.push(doc._id);
    } else {
      seen.add(doc.id);
    }
  }

  if (duplicateIds.length > 0) {
    await collection.deleteMany({ _id: { $in: duplicateIds } });
  }
}

async function ensureFcxIndex() {
  const collection = await getFcxCollection();
  await dedupeFcxBySlug();
  await collection.createIndex({ id: 1 }, { unique: true });
}

async function isDuplicateKeyError(error: unknown) {
  return (
    typeof error === 'object'
    && error !== null
    && 'code' in error
    && (error as { code?: number }).code === 11000
  );
}

async function migrateLegacyTournamentsCollection() {
  const db = await getDb();
  const collection = await getFcxCollection();
  const legacy = db.collection<FcxDocument>(LEGACY_TOURNAMENTS_COLLECTION);
  const legacyDocs = await legacy.find().toArray();
  if (legacyDocs.length === 0) return;

  const now = new Date();
  try {
    await collection.insertMany(
      legacyDocs.map((doc) => ({
        ...normalizeFcxEvent(toFcxEvent(doc)),
        createdAt: doc.createdAt ?? now,
        updatedAt: doc.updatedAt ?? now,
      })),
    );
  } catch (error) {
    if (!isDuplicateKeyError(error)) throw error;
  }
}

export async function ensureFcxSeeded() {
  const collection = await getFcxCollection();
  await ensureFcxIndex();

  const count = await collection.countDocuments();
  if (count > 0) return;

  await migrateLegacyTournamentsCollection();
  if ((await collection.countDocuments()) > 0) return;

  const now = new Date();
  try {
    await collection.insertMany(
      TOURNAMENTS.map((event) => ({
        ...normalizeFcxEvent(event),
        createdAt: now,
        updatedAt: now,
      })),
    );
  } catch (error) {
    if (!isDuplicateKeyError(error)) throw error;
  }
}

async function expireEndedFcxEvents() {
  const collection = await getFcxCollection();
  await collection.updateMany(
    {
      statusManuallySet: { $ne: true },
      status: { $ne: 'past' },
      endDate: { $gt: '', $lt: new Date().toISOString() },
    },
    {
      $set: {
        status: 'past',
        updatedAt: new Date(),
      },
    },
  );
}

export async function listFcx(): Promise<Tournament[]> {
  await ensureFcxSeeded();
  await expireEndedFcxEvents();
  const collection = await getFcxCollection();
  const docs = await collection.find().sort({ startDate: -1 }).toArray();
  return docs.map(toFcxEvent);
}

export async function findFcxById(id: string): Promise<Tournament | null> {
  await ensureFcxSeeded();
  await expireEndedFcxEvents();
  const collection = await getFcxCollection();
  const doc = await collection.findOne({ id });
  return doc ? toFcxEvent(doc) : null;
}

export async function createFcxEvent(input: Partial<Tournament>): Promise<Tournament> {
  const event = normalizeFcxEvent(input);
  if (!event.name || !event.game) {
    throw new Error('Name and game are required.');
  }

  if (!event.id) {
    event.id = `fcx-${Date.now()}`;
  }

  const collection = await getFcxCollection();
  const existing = await collection.findOne({ id: event.id });
  if (existing) {
    throw new Error('An FCX event with this ID already exists.');
  }

  const statusManuallySet = resolveManualStatusFlag(event.status, event.endDate);
  const resolved = applyAutoPastStatus(event, statusManuallySet);
  const now = new Date();
  const doc: FcxInsert = {
    ...resolved,
    statusManuallySet,
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(doc);
  return resolved;
}

export async function updateFcxEvent(
  id: string,
  input: Partial<Tournament>,
): Promise<Tournament | null> {
  const collection = await getFcxCollection();
  const existing = await collection.findOne({ id });
  if (!existing) return null;

  const merged = normalizeFcxEvent({ ...toFcxEvent(existing), ...input, id });
  if (!merged.name || !merged.game) {
    throw new Error('Name and game are required.');
  }

  const statusManuallySet = resolveManualStatusFlag(merged.status, merged.endDate);
  const resolved = applyAutoPastStatus(merged, statusManuallySet);

  await collection.updateOne(
    { id },
    {
      $set: {
        ...resolved,
        statusManuallySet,
        updatedAt: new Date(),
      },
    },
  );
  return resolved;
}

export async function deleteFcxById(id: string): Promise<Tournament | null> {
  const collection = await getFcxCollection();
  const existing = await collection.findOne({ id });
  if (!existing) return null;

  await collection.deleteMany({ id });
  return toFcxEvent(existing);
}
