import { NextResponse } from 'next/server';
import { listManagement } from '@/lib/management';

export async function GET() {
  try {
    const management = await listManagement();
    return NextResponse.json({ management });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load management.' },
      { status: 500 },
    );
  }
}
