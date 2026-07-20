import { NextResponse } from 'next/server';
import { findStreamerById } from '@/lib/streamers';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const streamer = await findStreamerById(id);

    if (!streamer) {
      return NextResponse.json({ error: 'Streamer not found.' }, { status: 404 });
    }

    return NextResponse.json({ streamer });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load streamer.' },
      { status: 500 },
    );
  }
}
