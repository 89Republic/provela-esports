import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { findAdminByEmail, toAdminPublic, type AdminPublic } from '@/lib/admin';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getSessionCookieOptions,
  verifyAdminSessionToken,
  type AdminSessionPayload,
} from '@/lib/admin-session';

export {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getSessionCookieOptions,
  verifyAdminSessionToken,
  type AdminSessionPayload,
} from '@/lib/admin-session';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function setAdminSessionCookie(payload: AdminSessionPayload) {
  const token = await createAdminSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, getSessionCookieOptions());
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function getAdminSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}

export async function getAdminSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}

export async function getCurrentAdmin(): Promise<AdminPublic | null> {
  const session = await getAdminSessionFromCookies();
  if (!session) return null;

  const admin = await findAdminByEmail(session.email);
  if (!admin) return null;

  return toAdminPublic(admin);
}

export async function authenticateAdmin(email: string, password: string) {
  const admin = await findAdminByEmail(email);
  if (!admin) return null;

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) return null;

  return admin;
}
