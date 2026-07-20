import { promises as fs } from 'fs';
import path from 'path';
import { unstable_noStore as noStore } from 'next/cache';
import { BRAND_SOCIALS } from '@/lib/constants';
import { getDb } from '@/lib/mongodb';
import type { SocialLink } from '@/lib/types';

export const BRAND_SOCIALS_COLLECTION = 'brandSocials';
export const BRAND_SOCIALS_DOC_ID = 'default';

const CONTENT_FILE_PATH = path.join(process.cwd(), 'data', 'site-content.override.json');

const SOCIAL_PLATFORMS = ['x', 'instagram', 'youtube', 'twitch', 'tiktok', 'discord', 'facebook'] as const;

export interface BrandSocialsDocument {
  id: string;
  links: SocialLink[];
  createdAt: Date;
  updatedAt: Date;
}

function normalizeSocialLink(candidate: Partial<SocialLink>): SocialLink | null {
  const platform = candidate.platform;
  const url = candidate.url?.trim() ?? '';
  if (!url || typeof platform !== 'string' || !SOCIAL_PLATFORMS.includes(platform as SocialLink['platform'])) {
    return null;
  }
  return { platform: platform as SocialLink['platform'], url };
}

function normalizeBrandSocials(links: unknown): SocialLink[] {
  if (!Array.isArray(links)) return [];
  return links
    .map((link) => normalizeSocialLink(link as Partial<SocialLink>))
    .filter((link): link is SocialLink => link !== null);
}

async function syncOverrideJsonBrandSocials(links: SocialLink[]) {
  try {
    const raw = await fs.readFile(CONTENT_FILE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    parsed.brandSocials = links;
    await fs.writeFile(CONTENT_FILE_PATH, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');
  } catch {
    // Override file is optional.
  }
}

export async function getBrandSocialsCollection() {
  const db = await getDb();
  return db.collection<BrandSocialsDocument>(BRAND_SOCIALS_COLLECTION);
}

export async function ensureBrandSocialsSeeded() {
  const collection = await getBrandSocialsCollection();
  await collection.createIndex({ id: 1 }, { unique: true });

  const existing = await collection.findOne({ id: BRAND_SOCIALS_DOC_ID });
  if (existing) return;

  const now = new Date();
  const links = normalizeBrandSocials(BRAND_SOCIALS);

  await collection.insertOne({
    id: BRAND_SOCIALS_DOC_ID,
    links,
    createdAt: now,
    updatedAt: now,
  });
}

export async function listBrandSocials(): Promise<SocialLink[]> {
  noStore();
  await ensureBrandSocialsSeeded();
  const collection = await getBrandSocialsCollection();
  const doc = await collection.findOne({ id: BRAND_SOCIALS_DOC_ID });
  return doc ? normalizeBrandSocials(doc.links) : normalizeBrandSocials(BRAND_SOCIALS);
}

export async function replaceBrandSocials(links: SocialLink[]): Promise<SocialLink[]> {
  const normalized = normalizeBrandSocials(links);
  await ensureBrandSocialsSeeded();

  const collection = await getBrandSocialsCollection();
  const now = new Date();
  const existing = await collection.findOne({ id: BRAND_SOCIALS_DOC_ID });

  await collection.replaceOne(
    { id: BRAND_SOCIALS_DOC_ID },
    {
      id: BRAND_SOCIALS_DOC_ID,
      links: normalized,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    },
    { upsert: true },
  );

  await syncOverrideJsonBrandSocials(normalized);
  return normalized;
}

export async function resetBrandSocialsToDefaults(): Promise<SocialLink[]> {
  return replaceBrandSocials(normalizeBrandSocials(BRAND_SOCIALS));
}

export async function deleteBrandSocialLink(platform: string, url: string): Promise<SocialLink[]> {
  const trimmedUrl = url.trim();
  if (!trimmedUrl || !SOCIAL_PLATFORMS.includes(platform as SocialLink['platform'])) {
    throw new Error('Platform and URL are required.');
  }

  const current = await listBrandSocials();
  const next = current.filter(
    (link) => !(link.platform === platform && link.url === trimmedUrl),
  );

  if (next.length === current.length) {
    throw new Error('Social link not found.');
  }

  return replaceBrandSocials(next);
}
