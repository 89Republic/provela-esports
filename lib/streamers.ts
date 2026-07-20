import type { ObjectId, WithoutId } from 'mongodb';
import { STREAMERS } from '@/lib/constants';
import { getDb } from '@/lib/mongodb';
import type { SocialLink, Streamer } from '@/lib/types';

export const STREAMERS_COLLECTION = 'streamers';

const STREAMER_STATUSES = ['live', 'offline'] as const;
const STREAMER_PLATFORMS = ['twitch', 'youtube'] as const;
const SOCIAL_PLATFORMS = ['x', 'instagram', 'youtube', 'twitch', 'tiktok', 'discord', 'facebook'] as const;

export interface StreamerDocument extends Streamer {
  createdAt: Date;
  updatedAt: Date;
}

export type StreamerInsert = WithoutId<StreamerDocument>;

function normalizeStatus(value: unknown): Streamer['status'] {
  if (typeof value === 'string' && STREAMER_STATUSES.includes(value as Streamer['status'])) {
    return value as Streamer['status'];
  }
  return 'offline';
}

function normalizePlatform(value: unknown): Streamer['platform'] {
  if (typeof value === 'string' && STREAMER_PLATFORMS.includes(value as Streamer['platform'])) {
    return value as Streamer['platform'];
  }
  return 'youtube';
}

function normalizeSocialLink(candidate: Partial<SocialLink>): SocialLink | null {
  const platform = candidate.platform;
  const url = candidate.url?.trim() ?? '';
  if (!url || typeof platform !== 'string' || !SOCIAL_PLATFORMS.includes(platform as SocialLink['platform'])) {
    return null;
  }
  return { platform: platform as SocialLink['platform'], url };
}

function normalizeStreamer(candidate: Partial<Streamer>): Streamer {
  return {
    id: candidate.id?.trim() ?? '',
    name: candidate.name?.trim() ?? '',
    game: candidate.game?.trim() ?? '',
    avatar: candidate.avatar?.trim() ?? '',
    status: normalizeStatus(candidate.status),
    platform: normalizePlatform(candidate.platform),
    followers: typeof candidate.followers === 'number' ? candidate.followers : 0,
    bio: candidate.bio?.trim() ?? '',
    embedUrl: candidate.embedUrl?.trim() ?? '',
    liveUrl: candidate.liveUrl?.trim() ?? '',
    socialLinks: Array.isArray(candidate.socialLinks)
      ? candidate.socialLinks.map(normalizeSocialLink).filter((link): link is SocialLink => link !== null)
      : [],
    highlights: Array.isArray(candidate.highlights)
      ? candidate.highlights.map((line) => String(line).trim()).filter(Boolean)
      : [],
    schedule: Array.isArray(candidate.schedule)
      ? candidate.schedule.map((line) => String(line).trim()).filter(Boolean)
      : [],
  };
}

export function toStreamer(doc: StreamerDocument & { _id?: unknown }): Streamer {
  const {
    _id: _mongoId,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...streamer
  } = doc;
  return streamer;
}

export async function getStreamersCollection() {
  const db = await getDb();
  return db.collection<StreamerDocument>(STREAMERS_COLLECTION);
}

async function dedupeStreamersBySlug() {
  const collection = await getStreamersCollection();
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

async function ensureStreamersIndex() {
  const collection = await getStreamersCollection();
  await dedupeStreamersBySlug();
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

export async function ensureStreamersSeeded() {
  const collection = await getStreamersCollection();
  await ensureStreamersIndex();

  const count = await collection.countDocuments();
  if (count > 0) return;

  const now = new Date();
  try {
    await collection.insertMany(
      STREAMERS.map((streamer) => ({
        ...normalizeStreamer(streamer),
        createdAt: now,
        updatedAt: now,
      })),
    );
  } catch (error) {
    if (!isDuplicateKeyError(error)) throw error;
  }
}

export async function listStreamers(): Promise<Streamer[]> {
  await ensureStreamersSeeded();
  const collection = await getStreamersCollection();
  const docs = await collection.find().sort({ name: 1 }).toArray();
  return docs.map(toStreamer);
}

export async function findStreamerById(id: string): Promise<Streamer | null> {
  await ensureStreamersSeeded();
  const collection = await getStreamersCollection();
  const doc = await collection.findOne({ id });
  return doc ? toStreamer(doc) : null;
}

export async function createStreamer(input: Partial<Streamer>): Promise<Streamer> {
  const streamer = normalizeStreamer(input);
  if (!streamer.name || !streamer.liveUrl) {
    throw new Error('Name and live URL are required.');
  }

  if (!streamer.id) {
    streamer.id = `str-${Date.now()}`;
  }

  const collection = await getStreamersCollection();
  const existing = await collection.findOne({ id: streamer.id });
  if (existing) {
    throw new Error('A streamer with this ID already exists.');
  }

  const now = new Date();
  const doc: StreamerInsert = {
    ...streamer,
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(doc);
  return streamer;
}

export async function updateStreamer(
  id: string,
  input: Partial<Streamer>,
): Promise<Streamer | null> {
  const collection = await getStreamersCollection();
  const existing = await collection.findOne({ id });
  if (!existing) return null;

  const merged = normalizeStreamer({ ...toStreamer(existing), ...input, id });
  if (!merged.name || !merged.liveUrl) {
    throw new Error('Name and live URL are required.');
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

export async function deleteStreamerById(id: string): Promise<Streamer | null> {
  const collection = await getStreamersCollection();
  const existing = await collection.findOne({ id });
  if (!existing) return null;

  await collection.deleteMany({ id });
  return toStreamer(existing);
}
