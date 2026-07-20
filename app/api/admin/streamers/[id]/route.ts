import { NextResponse } from 'next/server';
import { deleteStreamerById, findStreamerById, updateStreamer } from '@/lib/streamers';
import { getCurrentAdmin } from '@/lib/admin-auth';
import type { Streamer } from '@/lib/types';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await context.params;
  const streamer = await findStreamerById(id);
  if (!streamer) {
    return NextResponse.json({ error: 'Streamer not found.' }, { status: 404 });
  }

  return NextResponse.json({ streamer });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = (await request.json()) as Partial<Streamer>;
    const streamer = await updateStreamer(id, body);

    if (!streamer) {
      return NextResponse.json({ error: 'Streamer not found.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, streamer });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = await deleteStreamerById(id);

  if (!deleted) {
    return NextResponse.json({ error: 'Streamer not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, streamer: deleted });
}
