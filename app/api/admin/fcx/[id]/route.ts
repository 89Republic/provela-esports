import { NextResponse } from 'next/server';
import { deleteFcxById, findFcxById, updateFcxEvent } from '@/lib/fcx';
import { getCurrentAdmin } from '@/lib/admin-auth';
import type { Tournament } from '@/lib/types';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await context.params;
  const event = await findFcxById(id);
  if (!event) {
    return NextResponse.json({ error: 'FCX event not found.' }, { status: 404 });
  }

  return NextResponse.json({ event });
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
    const body = (await request.json()) as Partial<Tournament>;
    const event = await updateFcxEvent(id, body);

    if (!event) {
      return NextResponse.json({ error: 'FCX event not found.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, event });
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
  const deleted = await deleteFcxById(id);

  if (!deleted) {
    return NextResponse.json({ error: 'FCX event not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, event: deleted });
}
