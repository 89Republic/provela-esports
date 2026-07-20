import { NextResponse } from 'next/server';
import { countAdmins, deleteAdminById, toAdminPublic } from '@/lib/admin';
import { getCurrentAdmin } from '@/lib/admin-auth';

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await context.params;

  if (currentAdmin._id === id) {
    return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 });
  }

  const adminCount = await countAdmins();
  if (adminCount <= 1) {
    return NextResponse.json({ error: 'Cannot delete the last admin user.' }, { status: 400 });
  }

  const deleted = await deleteAdminById(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Admin user not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, user: toAdminPublic(deleted) });
}
