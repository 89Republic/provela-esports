import { NextResponse } from 'next/server';
import {
  deleteManagementMemberById,
  findManagementMemberById,
  updateManagementMember,
} from '@/lib/management';
import { getCurrentAdmin } from '@/lib/admin-auth';
import type { ManagementMember } from '@/lib/types';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await context.params;
  const member = await findManagementMemberById(id);
  if (!member) {
    return NextResponse.json({ error: 'Management member not found.' }, { status: 404 });
  }

  return NextResponse.json({ member });
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
    const body = (await request.json()) as Partial<ManagementMember>;
    const member = await updateManagementMember(id, body);

    if (!member) {
      return NextResponse.json({ error: 'Management member not found.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, member });
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
  const deleted = await deleteManagementMemberById(id);

  if (!deleted) {
    return NextResponse.json({ error: 'Management member not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, member: deleted });
}
