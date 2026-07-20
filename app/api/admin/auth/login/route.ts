import { NextResponse } from 'next/server';
import { authenticateAdmin, setAdminSessionCookie } from '@/lib/admin-auth';
import { toAdminPublic } from '@/lib/admin';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };

    const email = body.email?.trim();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const admin = await authenticateAdmin(email, password);
    if (!admin) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    await setAdminSessionCookie({
      sub: admin._id.toString(),
      email: admin.email,
      name: admin.name,
    });

    return NextResponse.json({ ok: true, user: toAdminPublic(admin) });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
