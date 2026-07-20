import { NextResponse } from 'next/server';
import { listStreamers } from '@/lib/streamers';

export async function GET() {
  try {
    const streamers = await listStreamers();
    return NextResponse.json({ streamers });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load streamers.' },
      { status: 500 },
    );
  }
}
