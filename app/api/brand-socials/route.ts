import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { listBrandSocials } from '@/lib/brand-socials';

export const dynamic = 'force-dynamic';

export async function GET() {
  noStore();
  try {
    const brandSocials = await listBrandSocials();
    return NextResponse.json(
      { brandSocials },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load brand social links.' },
      { status: 500 },
    );
  }
}
