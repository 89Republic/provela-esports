import { promises as fs } from 'fs';
import path from 'path';
import { unstable_noStore as noStore } from 'next/cache';
import { DEFAULT_COMMUNITY_PULSE as DEFAULT_COMMUNITY_PULSE_CONTENT } from '@/lib/constants';
import { getDb } from '@/lib/mongodb';
import type { CommunityPulseContent, CommunityStat } from '@/lib/types';

export const COMMUNITY_PULSE_COLLECTION = 'communityPulse';
export const COMMUNITY_PULSE_DOC_ID = 'default';

const CONTENT_FILE_PATH = path.join(process.cwd(), 'data', 'site-content.override.json');

const DEFAULT_COMMUNITY_PULSE: CommunityPulseContent = DEFAULT_COMMUNITY_PULSE_CONTENT;

export interface CommunityPulseDocument {
  id: string;
  content: CommunityPulseContent;
  createdAt: Date;
  updatedAt: Date;
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeStat(candidate: unknown, fallback?: CommunityStat): CommunityStat | null {
  if (!candidate || typeof candidate !== 'object') return fallback ?? null;
  const source = candidate as Partial<CommunityStat>;
  const label = asString(source.label) || fallback?.label;
  const rawValue = source.value;
  const value =
    typeof rawValue === 'number' && Number.isFinite(rawValue)
      ? rawValue
      : typeof rawValue === 'string' && rawValue.trim() !== '' && !Number.isNaN(Number(rawValue))
        ? Number(rawValue)
        : fallback?.value;
  if (!label || value === undefined) return null;

  const suffix = source.suffix !== undefined ? asString(source.suffix) : fallback?.suffix;
  return { label, value, ...(suffix ? { suffix } : {}) };
}

function normalizeFeed(feed: unknown): string[] {
  if (!Array.isArray(feed)) return [];
  return feed.map((item) => asString(item)).filter(Boolean);
}

function normalizeTitleLines(lines: unknown, fallback: string[]): string[] {
  if (!Array.isArray(lines)) return fallback;
  const normalized = lines.map((line) => asString(line)).filter(Boolean);
  return normalized.length >= 1 ? normalized : fallback;
}

export function normalizeCommunityPulse(candidate: unknown): CommunityPulseContent {
  const source = candidate && typeof candidate === 'object' ? (candidate as Partial<CommunityPulseContent>) : {};
  const fallback = DEFAULT_COMMUNITY_PULSE;

  const statsSource = Array.isArray(source.stats) ? source.stats : fallback.stats;
  const stats: CommunityStat[] = [];
  for (let i = 0; i < Math.max(statsSource.length, fallback.stats.length); i += 1) {
    const stat = normalizeStat(statsSource[i], fallback.stats[i]);
    if (stat) stats.push(stat);
  }

  const feed = normalizeFeed(source.feed);
  const titleLines = normalizeTitleLines(source.titleLines, fallback.titleLines);

  return {
    eyebrow: asString(source.eyebrow) || fallback.eyebrow,
    titleLines,
    stats: stats.length > 0 ? stats : fallback.stats,
    feed: feed.length > 0 ? feed : fallback.feed,
    ctaLabel: asString(source.ctaLabel) || fallback.ctaLabel,
    ctaHref: asString(source.ctaHref) || fallback.ctaHref,
  };
}

function contentFromDocument(doc: CommunityPulseDocument | null): CommunityPulseContent {
  if (!doc) return normalizeCommunityPulse(DEFAULT_COMMUNITY_PULSE);
  if (doc.content && typeof doc.content === 'object') {
    return normalizeCommunityPulse(doc.content);
  }
  return normalizeCommunityPulse(doc);
}

function validateCommunityPulse(input: Partial<CommunityPulseContent>): CommunityPulseContent {
  const normalized = normalizeCommunityPulse(input);

  if (normalized.stats.length < 1) {
    throw new Error('At least one stat is required.');
  }
  if (normalized.stats.some((s) => !s.label)) {
    throw new Error('Each stat needs a label.');
  }
  if (!normalized.ctaHref.startsWith('/')) {
    throw new Error('CTA link must be a site path starting with /.');
  }

  return normalized;
}

async function syncOverrideJsonCommunityPulse(content: CommunityPulseContent) {
  try {
    const raw = await fs.readFile(CONTENT_FILE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    parsed.communityPulse = content;
    await fs.writeFile(CONTENT_FILE_PATH, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');
  } catch {
    // Override file is optional.
  }
}

export async function getCommunityPulseCollection() {
  const db = await getDb();
  return db.collection<CommunityPulseDocument>(COMMUNITY_PULSE_COLLECTION);
}

export async function ensureCommunityPulseSeeded() {
  const collection = await getCommunityPulseCollection();
  await collection.createIndex({ id: 1 }, { unique: true });

  const existing = await collection.findOne({ id: COMMUNITY_PULSE_DOC_ID });
  if (existing) return;

  const now = new Date();
  await collection.insertOne({
    id: COMMUNITY_PULSE_DOC_ID,
    content: normalizeCommunityPulse(DEFAULT_COMMUNITY_PULSE),
    createdAt: now,
    updatedAt: now,
  });
}

export async function getCommunityPulse(): Promise<CommunityPulseContent> {
  noStore();
  await ensureCommunityPulseSeeded();
  const collection = await getCommunityPulseCollection();
  const doc = await collection.findOne({ id: COMMUNITY_PULSE_DOC_ID });
  return contentFromDocument(doc);
}

export async function saveCommunityPulse(input: Partial<CommunityPulseContent>): Promise<CommunityPulseContent> {
  const current = await getCommunityPulse();
  const content = validateCommunityPulse({ ...current, ...input });
  await ensureCommunityPulseSeeded();

  const collection = await getCommunityPulseCollection();
  const now = new Date();
  const existing = await collection.findOne({ id: COMMUNITY_PULSE_DOC_ID });

  await collection.replaceOne(
    { id: COMMUNITY_PULSE_DOC_ID },
    {
      id: COMMUNITY_PULSE_DOC_ID,
      content,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    },
    { upsert: true },
  );

  await syncOverrideJsonCommunityPulse(content);
  return content;
}

export async function resetCommunityPulseToDefaults(): Promise<CommunityPulseContent> {
  return saveCommunityPulse(DEFAULT_COMMUNITY_PULSE);
}

export function getDefaultCommunityPulse(): CommunityPulseContent {
  return normalizeCommunityPulse(DEFAULT_COMMUNITY_PULSE);
}