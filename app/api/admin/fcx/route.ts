import { NextResponse } from 'next/server';
import { createFcxEvent, listFcx } from '@/lib/fcx';
import { getCurrentAdmin } from '@/lib/admin-auth';
import type { Tournament } from '@/lib/types';

export async function GET() {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const fcx = await listFcx();
  return NextResponse.json({ fcx });
}

export async function POST(request: Request) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = (await request.json()) as Partial<Tournament>;
    const event = await createFcxEvent(body);
    return NextResponse.json({ ok: true, event }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request.';
    const status = message.includes('already exists') ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
