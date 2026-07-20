import type { ObjectId, WithoutId } from 'mongodb';
import { getDb } from '@/lib/mongodb';

export const ADMIN_COLLECTION = 'admin';

export interface AdminUser {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  role: 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminPublic {
  _id: string;
  email: string;
  name: string;
  role: 'admin';
  createdAt: string;
}

export type AdminUserInsert = WithoutId<AdminUser>;

export function toAdminPublic(user: AdminUser): AdminPublic {
  return {
    _id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function getAdminCollection() {
  const db = await getDb();
  return db.collection<AdminUser>(ADMIN_COLLECTION);
}

export async function findAdminByEmail(email: string) {
  const collection = await getAdminCollection();
  return collection.findOne({ email: email.trim().toLowerCase() });
}

export async function findAdminById(id: string) {
  const collection = await getAdminCollection();
  const { ObjectId } = await import('mongodb');
  if (!ObjectId.isValid(id)) return null;
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function listAdmins() {
  const collection = await getAdminCollection();
  return collection.find().sort({ createdAt: 1 }).toArray();
}

export async function countAdmins() {
  const collection = await getAdminCollection();
  return collection.countDocuments();
}

export async function deleteAdminById(id: string) {
  const collection = await getAdminCollection();
  const { ObjectId } = await import('mongodb');
  if (!ObjectId.isValid(id)) return null;
  const result = await collection.findOneAndDelete({ _id: new ObjectId(id) });
  return result;
}
