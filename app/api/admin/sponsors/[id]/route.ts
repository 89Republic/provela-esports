import { NextResponse } from 'next/server';
import { deleteSponsorById, findSponsorById, updateSponsor } from '@/lib/sponsors';
import { getCurrentAdmin } from '@/lib/admin-auth';
import type { Sponsor } from '@/lib/types';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await context.params;
  const sponsor = await findSponsorById(id);
  if (!sponsor) {
    return NextResponse.json({ error: 'Sponsor not found.' }, { status: 404 });
  }

  return NextResponse.json({ sponsor });
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
    const body = (await request.json()) as Partial<Sponsor>;
    const sponsor = await updateSponsor(id, body);

    if (!sponsor) {
      return NextResponse.json({ error: 'Sponsor not found.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, sponsor });
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
  const deleted = await deleteSponsorById(id);

  if (!deleted) {
    return NextResponse.json({ error: 'Sponsor not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, sponsor: deleted });
}
