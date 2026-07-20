import { NextResponse } from 'next/server';
import { listDivisions } from '@/lib/divisions';

export async function GET() {
  try {
    const divisions = await listDivisions();
    return NextResponse.json({ divisions });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load divisions.' },
      { status: 500 },
    );
  }
}
