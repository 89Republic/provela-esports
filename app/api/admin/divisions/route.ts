import { NextResponse } from 'next/server';
import { createDivision, listDivisions } from '@/lib/divisions';
import { getCurrentAdmin } from '@/lib/admin-auth';
import type { Division } from '@/lib/types';

export async function GET() {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const divisions = await listDivisions();
  return NextResponse.json({ divisions });
}

export async function POST(request: Request) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = (await request.json()) as Partial<Division>;
    const division = await createDivision(body);
    return NextResponse.json({ ok: true, division }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request.';
    const status = message.includes('already exists') ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
