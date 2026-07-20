import { NextResponse } from 'next/server';
import { createSponsor, listSponsors } from '@/lib/sponsors';
import { getCurrentAdmin } from '@/lib/admin-auth';
import type { Sponsor } from '@/lib/types';

export async function GET() {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const sponsors = await listSponsors();
  return NextResponse.json({ sponsors });
}

export async function POST(request: Request) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = (await request.json()) as Partial<Sponsor>;
    const sponsor = await createSponsor(body);
    return NextResponse.json({ ok: true, sponsor }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request.';
    const status = message.includes('already exists') ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
