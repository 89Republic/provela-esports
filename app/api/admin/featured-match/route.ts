import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { getFeaturedMatch, saveFeaturedMatch, setFeaturedMatchEnabled } from '@/lib/featured-match';
import { getCurrentAdmin } from '@/lib/admin-auth';
import type { FeaturedMatch } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  noStore();
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const featuredMatch = await getFeaturedMatch();
  return NextResponse.json(
    { featuredMatch },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

async function upsertFeaturedMatch(request: Request) {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const body = (await request.json()) as Partial<FeaturedMatch> & { featuredMatch?: Partial<FeaturedMatch> };
  const payload = body.featuredMatch ?? body;
  const featuredMatch = await saveFeaturedMatch(payload);

  return NextResponse.json(
    { ok: true, featuredMatch },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function POST(request: Request) {
  try {
    return await upsertFeaturedMatch(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    return await upsertFeaturedMatch(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  noStore();
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = (await request.json()) as { enabled?: unknown };
    if (typeof body.enabled !== 'boolean') {
      return NextResponse.json({ error: 'enabled must be true or false.' }, { status: 400 });
    }

    const featuredMatch = await setFeaturedMatchEnabled(body.enabled);
    return NextResponse.json(
      { ok: true, featuredMatch },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
