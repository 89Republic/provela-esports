import { NextResponse } from 'next/server';
import { createStreamer, listStreamers } from '@/lib/streamers';
import { getCurrentAdmin } from '@/lib/admin-auth';
import type { Streamer } from '@/lib/types';

export async function GET() {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const streamers = await listStreamers();
  return NextResponse.json({ streamers });
}

export async function POST(request: Request) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = (await request.json()) as Partial<Streamer>;
    const streamer = await createStreamer(body);
    return NextResponse.json({ ok: true, streamer }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request.';
    const status = message.includes('already exists') ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
