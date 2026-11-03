import { promises as fs } from 'fs';
import type { ObjectId, WithoutId } from 'mongodb';
import path from 'path';
import { SPONSORS } from '@/lib/constants';
import { getDb } from '@/lib/mongodb';
import type { Sponsor } from '@/lib/types';

export const SPONSORS_COLLECTION = 'sponsors';

const CONTENT_FILE_PATH = path.join(process.cwd(), 'data', 'site-content.override.json');

export interface SponsorDocument extends Sponsor {
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export type SponsorInsert = WithoutId<SponsorDocument>;

function normalizeSponsor(candidate: Partial<Sponsor>): Sponsor {
  return {
    id: candidate.id?.trim() ?? '',
    name: candidate.name?.trim() ?? '',
    logo: candidate.logo?.trim() ?? '',
    website: candidate.website?.trim() ?? '',
  };
}

export function toSponsor(doc: SponsorDocument & { _id?: unknown }): Sponsor {
  const {
    _id: _mongoId,
    sortOrder: _sortOrder,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...sponsor
  } = doc;
  return sponsor;
}

export async function getSponsorsCollection() {
  const db = await getDb();
  return db.collection<SponsorDocument>(SPONSORS_COLLECTION);
}

async function dedupeSponsorsById() {
  const collection = await getSponsorsCollection();
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

async function ensureSponsorsIndex() {
  const collection = await getSponsorsCollection();
  await dedupeSponsorsById();
  await collection.createIndex({ id: 1 }, { unique: true });
  await collection.createIndex({ sortOrder: 1 });
}

async function isDuplicateKeyError(error: unknown) {
  return (
    typeof error === 'object'
    && error !== null
    && 'code' in error
    && (error as { code?: number }).code === 11000
  );
}

async function getSeedSponsors(): Promise<Sponsor[]> {
  try {
    const raw = await fs.readFile(CONTENT_FILE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as { sponsors?: Partial<Sponsor>[] };
    if (Array.isArray(parsed.sponsors) && parsed.sponsors.length > 0) {
      return parsed.sponsors.map((sponsor, index) =>
        normalizeSponsor({
          ...sponsor,
          id: sponsor.id?.trim() || `sponsor-${index}`,
        }),
      );
    }
  } catch {
    // Fall back to bundled defaults.
  }

  return SPONSORS;
}

export async function ensureSponsorsSeeded() {
  const collection = await getSponsorsCollection();
  await ensureSponsorsIndex();

  const count = await collection.countDocuments();
  if (count > 0) return;

  const seedSponsors = await getSeedSponsors();
  const now = new Date();

  try {
    await collection.insertMany(
      seedSponsors.map((sponsor, index) => ({
        ...normalizeSponsor(sponsor),
        sortOrder: index,
        createdAt: now,
        updatedAt: now,
      })),
    );
  } catch (error) {
    if (!isDuplicateKeyError(error)) throw error;
  }
}

export async function listSponsors(): Promise<Sponsor[]> {
  await ensureSponsorsSeeded();
  const collection = await getSponsorsCollection();
  const docs = await collection.find().sort({ sortOrder: 1, createdAt: 1 }).toArray();
  return docs.map(toSponsor);
}

export async function findSponsorById(id: string): Promise<Sponsor | null> {
  await ensureSponsorsSeeded();
  const collection = await getSponsorsCollection();
  const doc = await collection.findOne({ id });
  return doc ? toSponsor(doc) : null;
}

async function nextSortOrder() {
  const collection = await getSponsorsCollection();
  const last = await collection.find().sort({ sortOrder: -1 }).limit(1).next();
  return (last?.sortOrder ?? -1) + 1;
}

export async function createSponsor(input: Partial<Sponsor>): Promise<Sponsor> {
  const sponsor = normalizeSponsor(input);
  if (!sponsor.name || !sponsor.logo) {
    throw new Error('Name and logo are required.');
  }

  if (!sponsor.id) {
    sponsor.id = `sponsor-${Date.now()}`;
  }

  const collection = await getSponsorsCollection();
  const existing = await collection.findOne({ id: sponsor.id });
  if (existing) {
    throw new Error('A sponsor with this ID already exists.');
  }

  const now = new Date();
  const doc: SponsorInsert = {
    ...sponsor,
    sortOrder: await nextSortOrder(),
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(doc);
  return sponsor;
}

export async function updateSponsor(id: string, input: Partial<Sponsor>): Promise<Sponsor | null> {
  const collection = await getSponsorsCollection();
  const existing = await collection.findOne({ id });
  if (!existing) return null;

  const merged = normalizeSponsor({ ...toSponsor(existing), ...input, id });
  if (!merged.name || !merged.logo) {
    throw new Error('Name and logo are required.');
  }

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

export async function deleteSponsorById(id: string): Promise<Sponsor | null> {
  const collection = await getSponsorsCollection();
  const existing = await collection.findOne({ id });
  if (!existing) return null;

  await collection.deleteMany({ id });
  return toSponsor(existing);
}
