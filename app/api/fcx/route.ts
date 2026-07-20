import { NextResponse } from 'next/server';
import { listFcx } from '@/lib/fcx';

export async function GET() {
  try {
    const fcx = await listFcx();
    return NextResponse.json({ fcx });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load FCX events.' },
      { status: 500 },
    );
  }
}
