import type { ObjectId, WithoutId } from 'mongodb';
import { NEWS_ARTICLES } from '@/lib/constants';
import { getDb } from '@/lib/mongodb';
import type { NewsArticle } from '@/lib/types';

export const NEWS_COLLECTION = 'newsArticles';

const NEWS_CATEGORIES = ['Announcements', 'Results', 'Tournaments', 'Community'] as const;

export interface NewsDocument extends NewsArticle {
  createdAt: Date;
  updatedAt: Date;
}

export type NewsInsert = WithoutId<NewsDocument>;

function normalizeCategory(value: unknown): NewsArticle['category'] {
  if (typeof value === 'string' && NEWS_CATEGORIES.includes(value as NewsArticle['category'])) {
    return value as NewsArticle['category'];
  }
  return 'Announcements';
}

function parsePublished(value: unknown, fallback = true): boolean {
  if (typeof value === 'boolean') return value;
  if (value === 0 || value === '0' || value === 'false' || value === 'off') return false;
  if (value === 1 || value === '1' || value === 'true' || value === 'on') return true;
  return fallback;
}

function normalizeNewsArticle(candidate: Partial<NewsArticle>): NewsArticle {
  return {
    id: candidate.id?.trim() ?? '',
    title: candidate.title?.trim() ?? '',
    excerpt: candidate.excerpt?.trim() ?? '',
    image: candidate.image?.trim() ?? '',
    date: candidate.date?.trim() ?? new Date().toISOString().slice(0, 10),
    author: candidate.author?.trim() ?? '',
    category: normalizeCategory(candidate.category),
    content: Array.isArray(candidate.content)
      ? candidate.content.map((paragraph) => String(paragraph).trim()).filter(Boolean)
      : [],
    published: parsePublished(candidate.published),
  };
}

export function toNewsArticle(doc: NewsDocument & { _id?: unknown }): NewsArticle {
  const {
    _id: _mongoId,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...article
  } = doc;
  return normalizeNewsArticle(article);
}

export async function getNewsCollection() {
  const db = await getDb();
  return db.collection<NewsDocument>(NEWS_COLLECTION);
}

async function dedupeNewsBySlug() {
  const collection = await getNewsCollection();
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

async function ensureNewsIndex() {
  const collection = await getNewsCollection();
  await dedupeNewsBySlug();
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

export async function ensureNewsSeeded() {
  const collection = await getNewsCollection();
  await ensureNewsIndex();

  const count = await collection.countDocuments();
  if (count > 0) return;

  const now = new Date();
  try {
    await collection.insertMany(
      NEWS_ARTICLES.map((article) => ({
        ...normalizeNewsArticle(article),
        createdAt: now,
        updatedAt: now,
      })),
    );
  } catch (error) {
    if (!isDuplicateKeyError(error)) throw error;
  }
}

export async function listNewsArticles(): Promise<NewsArticle[]> {
  await ensureNewsSeeded();
  const collection = await getNewsCollection();
  const docs = await collection.find().sort({ date: -1 }).toArray();
  return docs.map(toNewsArticle);
}

export async function listPublishedNewsArticles(): Promise<NewsArticle[]> {
  const articles = await listNewsArticles();
  return articles.filter((article) => article.published);
}

export async function findNewsById(id: string): Promise<NewsArticle | null> {
  await ensureNewsSeeded();
  const collection = await getNewsCollection();
  const doc = await collection.findOne({ id });
  return doc ? toNewsArticle(doc) : null;
}

export async function createNewsArticle(input: Partial<NewsArticle>): Promise<NewsArticle> {
  const article = normalizeNewsArticle(input);
  if (!article.title || !article.excerpt || !article.image || !article.author) {
    throw new Error('Title, excerpt, image, and author are required.');
  }

  if (!article.id) {
    article.id = `news-${Date.now()}`;
  }

  const collection = await getNewsCollection();
  const existing = await collection.findOne({ id: article.id });
  if (existing) {
    throw new Error('A news article with this ID already exists.');
  }

  const now = new Date();
  const doc: NewsInsert = {
    ...article,
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(doc);
  return article;
}

export async function updateNewsArticle(
  id: string,
  input: Partial<NewsArticle>,
): Promise<NewsArticle | null> {
  const collection = await getNewsCollection();
  const existing = await collection.findOne({ id });
  if (!existing) return null;

  const merged = normalizeNewsArticle({ ...toNewsArticle(existing), ...input, id });
  if (!merged.title || !merged.excerpt || !merged.image || !merged.author) {
    throw new Error('Title, excerpt, image, and author are required.');
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

export async function setNewsPublished(id: string, published: boolean): Promise<NewsArticle | null> {
  const existing = await findNewsById(id);
  if (!existing) return null;
  return updateNewsArticle(id, { ...existing, published });
}

export async function deleteNewsById(id: string): Promise<NewsArticle | null> {
  const collection = await getNewsCollection();
  const existing = await collection.findOne({ id });
  if (!existing) return null;

  await collection.deleteMany({ id });
  return toNewsArticle(existing);
}
