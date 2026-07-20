import { NextResponse } from 'next/server';
import { findFcxById } from '@/lib/fcx';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const event = await findFcxById(id);

    if (!event) {
      return NextResponse.json({ error: 'FCX event not found.' }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load FCX event.' },
      { status: 500 },
    );
  }
}
