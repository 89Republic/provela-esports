import type { ObjectId, WithoutId } from 'mongodb';
import { DIVISIONS } from '@/lib/constants';
import { getDb } from '@/lib/mongodb';
import type { Division } from '@/lib/types';

export const DIVISIONS_COLLECTION = 'divisions';

export interface DivisionDocument extends Division {
  createdAt: Date;
  updatedAt: Date;
}

export type DivisionInsert = WithoutId<DivisionDocument>;

function normalizeDivision(candidate: Partial<Division>): Division {
  return {
    id: candidate.id?.trim() ?? '',
    name: candidate.name?.trim() ?? '',
    game: candidate.game?.trim() ?? '',
    tagline: candidate.tagline?.trim() ?? '',
    description: candidate.description?.trim() ?? '',
    icon: candidate.icon?.trim() ?? '',
    teams: typeof candidate.teams === 'number' ? candidate.teams : 1,
    players: typeof candidate.players === 'number' ? candidate.players : 0,
    featured: Boolean(candidate.featured),
    roster: Array.isArray(candidate.roster) ? candidate.roster : [],
    achievements: Array.isArray(candidate.achievements) ? candidate.achievements : [],
    media: Array.isArray(candidate.media) ? candidate.media : [],
    schedule: Array.isArray(candidate.schedule) ? candidate.schedule : [],
  };
}

export function toDivision(doc: DivisionDocument & { _id?: unknown }): Division {
  const {
    _id: _mongoId,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...division
  } = doc;
  return division;
}

export async function getDivisionsCollection() {
  const db = await getDb();
  return db.collection<DivisionDocument>(DIVISIONS_COLLECTION);
}

async function dedupeDivisionsBySlug() {
  const collection = await getDivisionsCollection();
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

async function ensureDivisionsIndex() {
  const collection = await getDivisionsCollection();
  await dedupeDivisionsBySlug();
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

export async function ensureDivisionsSeeded() {
  const collection = await getDivisionsCollection();
  await ensureDivisionsIndex();

  const count = await collection.countDocuments();
  if (count > 0) return;

  const now = new Date();
  try {
    await collection.insertMany(
      DIVISIONS.map((division) => ({
        ...normalizeDivision(division),
        createdAt: now,
        updatedAt: now,
      })),
    );
  } catch (error) {
    // Another request may have seeded first during a cold start.
    if (!isDuplicateKeyError(error)) throw error;
  }
}

export async function listDivisions(): Promise<Division[]> {
  await ensureDivisionsSeeded();
  const collection = await getDivisionsCollection();
  const docs = await collection.find().sort({ name: 1 }).toArray();
  return docs.map(toDivision);
}

export async function findDivisionById(id: string): Promise<Division | null> {
  await ensureDivisionsSeeded();
  const collection = await getDivisionsCollection();
  const doc = await collection.findOne({ id });
  return doc ? toDivision(doc) : null;
}

export async function createDivision(input: Partial<Division>): Promise<Division> {
  const division = normalizeDivision(input);
  if (!division.name || !division.game || !division.icon) {
    throw new Error('Name, game, and icon are required.');
  }

  if (!division.id) {
    division.id = `div-${Date.now()}`;
  }

  const collection = await getDivisionsCollection();
  const existing = await collection.findOne({ id: division.id });
  if (existing) {
    throw new Error('A division with this ID already exists.');
  }

  const now = new Date();
  const doc: DivisionInsert = {
    ...division,
    players: division.roster.length || division.players,
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(doc);
  return division;
}

export async function updateDivision(id: string, input: Partial<Division>): Promise<Division | null> {
  const collection = await getDivisionsCollection();
  const existing = await collection.findOne({ id });
  if (!existing) return null;

  const merged = normalizeDivision({ ...toDivision(existing), ...input, id });
  if (!merged.name || !merged.game || !merged.icon) {
    throw new Error('Name, game, and icon are required.');
  }

  merged.players = merged.roster.length || merged.players;

  await collection.updateOne(
    { id },
    {
      $set: {
        ...merged,
        updatedAt: new Date(),
      },
    },
  );
  return merged;
}

export async function deleteDivisionById(id: string): Promise<Division | null> {
  const collection = await getDivisionsCollection();
  const existing = await collection.findOne({ id });
  if (!existing) return null;

  await collection.deleteMany({ id });
  return toDivision(existing);
}
