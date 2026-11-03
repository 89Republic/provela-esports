import type { WithoutId } from 'mongodb';
import { MANAGEMENT } from '@/lib/constants';
import { getDb } from '@/lib/mongodb';
import type { ManagementMember, SocialLink } from '@/lib/types';

export const MANAGEMENT_COLLECTION = 'management';

const SOCIAL_PLATFORMS = ['x', 'instagram', 'youtube', 'twitch', 'tiktok', 'discord', 'facebook'] as const;

export interface ManagementDocument extends ManagementMember {
  createdAt: Date;
  updatedAt: Date;
}

export type ManagementInsert = WithoutId<ManagementDocument>;

function normalizeSocialLink(candidate: Partial<SocialLink>): SocialLink | null {
  const platform = candidate.platform;
  const url = candidate.url?.trim() ?? '';
  if (!url || typeof platform !== 'string' || !SOCIAL_PLATFORMS.includes(platform as SocialLink['platform'])) {
    return null;
  }
  return { platform: platform as SocialLink['platform'], url };
}

function normalizeMember(candidate: Partial<ManagementMember>): ManagementMember {
  const order = Number(candidate.order);
  return {
    id: candidate.id?.trim() ?? '',
    name: candidate.name?.trim() ?? '',
    role: candidate.role?.trim() ?? '',
    photo: candidate.photo?.trim() ?? '',
    bio: candidate.bio?.trim() ?? '',
    socialLinks: Array.isArray(candidate.socialLinks)
      ? candidate.socialLinks.map(normalizeSocialLink).filter((link): link is SocialLink => link !== null)
      : [],
    order: Number.isFinite(order) ? order : 0,
  };
}

export function toManagementMember(doc: ManagementDocument & { _id?: unknown }): ManagementMember {
  const {
    _id: _mongoId,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...member
  } = doc;
  return member;
}

export async function getManagementCollection() {
  const db = await getDb();
  return db.collection<ManagementDocument>(MANAGEMENT_COLLECTION);
}

async function isDuplicateKeyError(error: unknown) {
  return (
    typeof error === 'object'
    && error !== null
    && 'code' in error
    && (error as { code?: number }).code === 11000
  );
}

/**
 * Seeds the placeholder team only when the collection has never existed, so an
 * admin who deletes every placeholder doesn't see them come back.
 */
export async function ensureManagementSeeded() {
  const db = await getDb();
  const exists = await db.listCollections({ name: MANAGEMENT_COLLECTION }, { nameOnly: true }).hasNext();
  const collection = await getManagementCollection();
  await collection.createIndex({ id: 1 }, { unique: true });
  if (exists) return;

  const now = new Date();
  try {
    await collection.insertMany(
      MANAGEMENT.map((member) => ({
        ...normalizeMember(member),
        createdAt: now,
        updatedAt: now,
      })),
    );
  } catch (error) {
    if (!isDuplicateKeyError(error)) throw error;
  }
}

export async function listManagement(): Promise<ManagementMember[]> {
  await ensureManagementSeeded();
  const collection = await getManagementCollection();
  const docs = await collection.find().sort({ order: 1, createdAt: 1 }).toArray();
  return docs.map(toManagementMember);
}

export async function findManagementMemberById(id: string): Promise<ManagementMember | null> {
  await ensureManagementSeeded();
  const collection = await getManagementCollection();
  const doc = await collection.findOne({ id });
  return doc ? toManagementMember(doc) : null;
}

export async function createManagementMember(input: Partial<ManagementMember>): Promise<ManagementMember> {
  const member = normalizeMember(input);
  if (!member.name || !member.role) {
    throw new Error('Name and role are required.');
  }

  if (!member.id) {
    member.id = `mgmt-${Date.now()}`;
  }

  const collection = await getManagementCollection();
  const existing = await collection.findOne({ id: member.id });
  if (existing) {
    throw new Error('A management member with this ID already exists.');
  }

  const now = new Date();
  const doc: ManagementInsert = {
    ...member,
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(doc);
  return member;
}

export async function updateManagementMember(
  id: string,
  input: Partial<ManagementMember>,
): Promise<ManagementMember | null> {
  const collection = await getManagementCollection();
  const existing = await collection.findOne({ id });
  if (!existing) return null;

  const merged = normalizeMember({ ...toManagementMember(existing), ...input, id });
  if (!merged.name || !merged.role) {
    throw new Error('Name and role are required.');
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

export async function deleteManagementMemberById(id: string): Promise<ManagementMember | null> {
  const collection = await getManagementCollection();
  const existing = await collection.findOne({ id });
  if (!existing) return null;

  await collection.deleteMany({ id });
  return toManagementMember(existing);
}
