import { promises as fs } from 'fs';
import path from 'path';
import { unstable_noStore as noStore } from 'next/cache';
import { BRAND_SOCIALS, CONTACT_TOPICS, DIVISIONS, NEWS_ARTICLES, STREAMERS, TOURNAMENTS } from '@/lib/constants';
import type { Division, NewsArticle, SocialLink, Streamer, Tournament } from '@/lib/types';

export interface SiteContent {
  brandSocials: SocialLink[];
  divisions: Division[];
  tournaments: Tournament[];
  streamers: Streamer[];
  newsArticles: NewsArticle[];
  contactTopics: string[];
}

const CONTENT_FILE_PATH = path.join(process.cwd(), 'data', 'site-content.override.json');

const DEFAULT_SITE_CONTENT: SiteContent = {
  brandSocials: BRAND_SOCIALS,
  divisions: DIVISIONS,
  tournaments: TOURNAMENTS,
  streamers: STREAMERS,
  newsArticles: NEWS_ARTICLES,
  contactTopics: [...CONTACT_TOPICS],
};

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function normalizeContent(candidate: unknown): SiteContent {
  if (!candidate || typeof candidate !== 'object') {
    return getDefaultSiteContent();
  }

  const content = candidate as Partial<SiteContent>;
  const fallback = getDefaultSiteContent();

  return {
    brandSocials: Array.isArray(content.brandSocials) ? content.brandSocials : fallback.brandSocials,
    divisions: Array.isArray(content.divisions) ? content.divisions : fallback.divisions,
    tournaments: Array.isArray(content.tournaments) ? content.tournaments : fallback.tournaments,
    streamers: Array.isArray(content.streamers) ? content.streamers : fallback.streamers,
    newsArticles: Array.isArray(content.newsArticles) ? content.newsArticles : fallback.newsArticles,
    contactTopics: Array.isArray(content.contactTopics) ? content.contactTopics : fallback.contactTopics,
  };
}

export function getDefaultSiteContent(): SiteContent {
  return deepClone(DEFAULT_SITE_CONTENT);
}

export async function getSiteContent(): Promise<SiteContent> {
  noStore();

  try {
    const raw = await fs.readFile(CONTENT_FILE_PATH, 'utf8');
    return normalizeContent(JSON.parse(raw));
  } catch {
    return getDefaultSiteContent();
  }
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  const normalized = normalizeContent(content);
  const output = `${JSON.stringify(normalized, null, 2)}\n`;

  await fs.mkdir(path.dirname(CONTENT_FILE_PATH), { recursive: true });
  await fs.writeFile(CONTENT_FILE_PATH, output, 'utf8');
}
