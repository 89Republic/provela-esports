import { NextResponse } from 'next/server';
import { createManagementMember, listManagement } from '@/lib/management';
import { getCurrentAdmin } from '@/lib/admin-auth';
import type { ManagementMember } from '@/lib/types';

export async function GET() {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const management = await listManagement();
  return NextResponse.json({ management });
}

export async function POST(request: Request) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = (await request.json()) as Partial<ManagementMember>;
    const member = await createManagementMember(body);
    return NextResponse.json({ ok: true, member }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request.';
    const status = message.includes('already exists') ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
