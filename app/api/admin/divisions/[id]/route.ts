import { NextResponse } from 'next/server';
import { deleteDivisionById, findDivisionById, updateDivision } from '@/lib/divisions';
import { getCurrentAdmin } from '@/lib/admin-auth';
import type { Division } from '@/lib/types';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await context.params;
  const division = await findDivisionById(id);
  if (!division) {
    return NextResponse.json({ error: 'Division not found.' }, { status: 404 });
  }

  return NextResponse.json({ division });
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
    const body = (await request.json()) as Partial<Division>;
    const division = await updateDivision(id, body);

    if (!division) {
      return NextResponse.json({ error: 'Division not found.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, division });
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
  const deleted = await deleteDivisionById(id);

  if (!deleted) {
    return NextResponse.json({ error: 'Division not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, division: deleted });
}
