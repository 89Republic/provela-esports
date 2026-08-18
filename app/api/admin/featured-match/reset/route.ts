import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { resetFeaturedMatchToDefaults } from '@/lib/featured-match';
import { getCurrentAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  noStore();
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const featuredMatch = await resetFeaturedMatchToDefaults();
    return NextResponse.json({ ok: true, featuredMatch });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
