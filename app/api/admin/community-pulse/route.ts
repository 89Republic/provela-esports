import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { getCommunityPulse, saveCommunityPulse } from '@/lib/community-pulse';
import { getCurrentAdmin } from '@/lib/admin-auth';
import type { CommunityPulseContent } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  noStore();
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const communityPulse = await getCommunityPulse();
  return NextResponse.json(
    { communityPulse },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

async function upsertCommunityPulse(request: Request) {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const body = (await request.json()) as Partial<CommunityPulseContent> & { communityPulse?: Partial<CommunityPulseContent> };
  const payload = body.communityPulse ?? body;
  const communityPulse = await saveCommunityPulse(payload);

  return NextResponse.json(
    { ok: true, communityPulse },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function POST(request: Request) {
  try {
    return await upsertCommunityPulse(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    return await upsertCommunityPulse(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}