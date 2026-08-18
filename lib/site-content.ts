import { promises as fs } from 'fs';
import path from 'path';
import { unstable_noStore as noStore } from 'next/cache';
import { BRAND_SOCIALS, DIVISIONS, FEATURED_MATCH, NEWS_ARTICLES, SPONSORS, STREAMERS, TOURNAMENTS } from '@/lib/constants';
import { listBrandSocials } from '@/lib/brand-socials';
import { listDivisions } from '@/lib/divisions';
import { getFeaturedMatch, normalizeFeaturedMatch } from '@/lib/featured-match';
import { listFcx } from '@/lib/fcx';
import { listPublishedNewsArticles } from '@/lib/news';
import { listSponsors } from '@/lib/sponsors';
import { listStreamers } from '@/lib/streamers';
import type { Division, FeaturedMatch, NewsArticle, SocialLink, Sponsor, Streamer, Tournament } from '@/lib/types';

export interface SiteContent {
  brandSocials: SocialLink[];
  divisions: Division[];
  fcx: Tournament[];
  streamers: Streamer[];
  newsArticles: NewsArticle[];
  sponsors: Sponsor[];
  featuredMatch: FeaturedMatch;
}

const CONTENT_FILE_PATH = path.join(process.cwd(), 'data', 'site-content.override.json');

const DEFAULT_SITE_CONTENT: SiteContent = {
  brandSocials: BRAND_SOCIALS,
  divisions: DIVISIONS,
  fcx: TOURNAMENTS,
  streamers: STREAMERS,
  newsArticles: NEWS_ARTICLES,
  sponsors: SPONSORS,
  featuredMatch: FEATURED_MATCH,
};

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function resolveFcxFromCandidate(content: Partial<SiteContent & { tournaments?: Tournament[] }>): Tournament[] {
  const fallback = getDefaultSiteContent();
  if (Array.isArray(content.fcx)) return content.fcx;
  if (Array.isArray(content.tournaments)) return content.tournaments;
  return fallback.fcx;
}

function normalizeContent(candidate: unknown): SiteContent {
  if (!candidate || typeof candidate !== 'object') {
    return getDefaultSiteContent();
  }

  const content = candidate as Partial<SiteContent & { tournaments?: Tournament[] }>;
  const fallback = getDefaultSiteContent();

  return {
    brandSocials: Array.isArray(content.brandSocials) ? content.brandSocials : fallback.brandSocials,
    divisions: Array.isArray(content.divisions) ? content.divisions : fallback.divisions,
    fcx: resolveFcxFromCandidate(content),
    streamers: Array.isArray(content.streamers) ? content.streamers : fallback.streamers,
    newsArticles: Array.isArray(content.newsArticles) ? content.newsArticles : fallback.newsArticles,
    sponsors: Array.isArray(content.sponsors)
      ? content.sponsors.map((s) => ({
          id: s.id,
          name: s.name ?? '',
          logo: s.logo ?? '',
        }))
      : fallback.sponsors,
    featuredMatch: content.featuredMatch
      ? normalizeFeaturedMatch(content.featuredMatch)
      : fallback.featuredMatch,
  };
}

export function getDefaultSiteContent(): SiteContent {
  return deepClone(DEFAULT_SITE_CONTENT);
}

async function loadDivisions(): Promise<Division[]> {
  try {
    return await listDivisions();
  } catch {
    return getDefaultSiteContent().divisions;
  }
}

async function loadNewsArticles(): Promise<NewsArticle[]> {
  try {
    return await listPublishedNewsArticles();
  } catch {
    return getDefaultSiteContent().newsArticles.filter((article) => article.published);
  }
}

async function loadSponsors(): Promise<Sponsor[]> {
  try {
    return await listSponsors();
  } catch {
    return getDefaultSiteContent().sponsors;
  }
}

async function loadFcx(): Promise<Tournament[]> {
  try {
    return await listFcx();
  } catch {
    return getDefaultSiteContent().fcx;
  }
}

async function loadStreamers(): Promise<Streamer[]> {
  try {
    return await listStreamers();
  } catch {
    return getDefaultSiteContent().streamers;
  }
}

async function loadBrandSocials(): Promise<SocialLink[]> {
  try {
    return await listBrandSocials();
  } catch {
    return getDefaultSiteContent().brandSocials;
  }
}

async function loadFeaturedMatch(): Promise<FeaturedMatch> {
  try {
    return await getFeaturedMatch();
  } catch {
    return getDefaultSiteContent().featuredMatch;
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  noStore();

  const [divisions, newsArticles, sponsors, fcx, streamers, brandSocials, featuredMatch] = await Promise.all([
    loadDivisions(),
    loadNewsArticles(),
    loadSponsors(),
    loadFcx(),
    loadStreamers(),
    loadBrandSocials(),
    loadFeaturedMatch(),
  ]);

  try {
    const raw = await fs.readFile(CONTENT_FILE_PATH, 'utf8');
    return { ...normalizeContent(JSON.parse(raw)), divisions, newsArticles, sponsors, fcx, streamers, brandSocials, featuredMatch };
  } catch {
    return { ...getDefaultSiteContent(), divisions, newsArticles, sponsors, fcx, streamers, brandSocials, featuredMatch };
  }
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  const normalized = normalizeContent(content);
  const { brandSocials: _brandSocials, featuredMatch: _featuredMatch, ...withoutMongoManaged } = normalized;
  const output = `${JSON.stringify(withoutMongoManaged, null, 2)}\n`;

  await fs.mkdir(path.dirname(CONTENT_FILE_PATH), { recursive: true });
  await fs.writeFile(CONTENT_FILE_PATH, output, 'utf8');
}
