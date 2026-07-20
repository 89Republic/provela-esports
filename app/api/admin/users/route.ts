import { NextResponse } from 'next/server';
import {
  countAdmins,
  findAdminByEmail,
  getAdminCollection,
  listAdmins,
  toAdminPublic,
  type AdminUserInsert,
} from '@/lib/admin';
import { getCurrentAdmin, hashPassword } from '@/lib/admin-auth';

export async function GET() {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const admins = await listAdmins();
  return NextResponse.json({ users: admins.map(toAdminPublic) });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      name?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const name = body.name?.trim() || email?.split('@')[0] || 'Admin';

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const adminCount = await countAdmins();
    if (adminCount > 0) {
      const currentAdmin = await getCurrentAdmin();
      if (!currentAdmin) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
      }
    }

    const existing = await findAdminByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'An admin with this email already exists.' }, { status: 409 });
    }

    const now = new Date();
    const passwordHash = await hashPassword(password);
    const collection = await getAdminCollection();

    const doc: AdminUserInsert = {
      email,
      passwordHash,
      name,
      role: 'admin',
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(doc);

    const created = await collection.findOne({ _id: result.insertedId });
    if (!created) {
      return NextResponse.json({ error: 'Failed to create admin user.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, user: toAdminPublic(created) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
