import { promises as fs } from 'fs';
import path from 'path';
import { unstable_noStore as noStore } from 'next/cache';
import { FEATURED_MATCH } from '@/lib/constants';
import { getDb } from '@/lib/mongodb';
import type { FeaturedMatch } from '@/lib/types';

export const FEATURED_MATCH_COLLECTION = 'featuredMatch';
export const FEATURED_MATCH_DOC_ID = 'default';

const CONTENT_FILE_PATH = path.join(process.cwd(), 'data', 'site-content.override.json');

export interface FeaturedMatchDocument {
  id: string;
  match: FeaturedMatch;
  createdAt: Date;
  updatedAt: Date;
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function parseEnabled(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value;
  if (value === 0 || value === '0' || value === 'false' || value === 'off') return false;
  if (value === 1 || value === '1' || value === 'true' || value === 'on') return true;
  return fallback;
}

export function normalizeFeaturedMatch(candidate: unknown): FeaturedMatch {
  const source = candidate && typeof candidate === 'object' ? (candidate as Partial<FeaturedMatch>) : {};
  const fallback = FEATURED_MATCH;

  return {
    teamA: asString(source.teamA) || fallback.teamA,
    teamB: asString(source.teamB) || fallback.teamB,
    division: asString(source.division) || fallback.division,
    when: asString(source.when) || fallback.when,
    streamUrl: asString(source.streamUrl) || fallback.streamUrl,
    enabled: parseEnabled(source.enabled, fallback.enabled),
  };
}

function matchFromDocument(doc: FeaturedMatchDocument | null): FeaturedMatch {
  if (!doc) return normalizeFeaturedMatch(FEATURED_MATCH);
  if (doc.match && typeof doc.match === 'object') {
    return normalizeFeaturedMatch(doc.match);
  }
  return normalizeFeaturedMatch(doc);
}

function validateFeaturedMatch(input: Partial<FeaturedMatch>, fallbackEnabled = true): FeaturedMatch {
  const teamA = asString(input.teamA);
  const teamB = asString(input.teamB);
  const division = asString(input.division);
  const when = asString(input.when);
  const streamUrl = asString(input.streamUrl);

  if (!teamA || !teamB || !division || !when || !streamUrl) {
    throw new Error('Team A, Team B, division, when, and stream URL are required.');
  }

  return {
    teamA,
    teamB,
    division,
    when,
    streamUrl,
    enabled: parseEnabled(input.enabled, fallbackEnabled),
  };
}

async function syncOverrideJsonFeaturedMatch(match: FeaturedMatch) {
  try {
    const raw = await fs.readFile(CONTENT_FILE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    parsed.featuredMatch = match;
    await fs.writeFile(CONTENT_FILE_PATH, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');
  } catch {
    // Override file is optional.
  }
}

export async function getFeaturedMatchCollection() {
  const db = await getDb();
  return db.collection<FeaturedMatchDocument>(FEATURED_MATCH_COLLECTION);
}

export async function ensureFeaturedMatchSeeded() {
  const collection = await getFeaturedMatchCollection();
  await collection.createIndex({ id: 1 }, { unique: true });

  const existing = await collection.findOne({ id: FEATURED_MATCH_DOC_ID });
  if (existing) return;

  const now = new Date();
  await collection.insertOne({
    id: FEATURED_MATCH_DOC_ID,
    match: normalizeFeaturedMatch(FEATURED_MATCH),
    createdAt: now,
    updatedAt: now,
  });
}

export async function getFeaturedMatch(): Promise<FeaturedMatch> {
  noStore();
  await ensureFeaturedMatchSeeded();
  const collection = await getFeaturedMatchCollection();
  const doc = await collection.findOne({ id: FEATURED_MATCH_DOC_ID });
  return matchFromDocument(doc);
}

export async function saveFeaturedMatch(input: Partial<FeaturedMatch>): Promise<FeaturedMatch> {
  const current = await getFeaturedMatch();
  const match = validateFeaturedMatch({ ...current, ...input }, current.enabled);
  await ensureFeaturedMatchSeeded();

  const collection = await getFeaturedMatchCollection();
  const now = new Date();
  const existing = await collection.findOne({ id: FEATURED_MATCH_DOC_ID });

  await collection.replaceOne(
    { id: FEATURED_MATCH_DOC_ID },
    {
      id: FEATURED_MATCH_DOC_ID,
      match,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    },
    { upsert: true },
  );

  await syncOverrideJsonFeaturedMatch(match);
  return match;
}

export async function setFeaturedMatchEnabled(enabled: boolean): Promise<FeaturedMatch> {
  const current = await getFeaturedMatch();
  return saveFeaturedMatch({ ...current, enabled });
}

export async function resetFeaturedMatchToDefaults(): Promise<FeaturedMatch> {
  return saveFeaturedMatch(normalizeFeaturedMatch(FEATURED_MATCH));
}
