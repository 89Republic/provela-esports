import { NextResponse } from 'next/server';
import { listSponsors } from '@/lib/sponsors';

export async function GET() {
  try {
    const sponsors = await listSponsors();
    return NextResponse.json({ sponsors });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load sponsors.' },
      { status: 500 },
    );
  }
}
