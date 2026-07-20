import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { listBrandSocials, replaceBrandSocials, deleteBrandSocialLink } from '@/lib/brand-socials';
import { getCurrentAdmin } from '@/lib/admin-auth';
import type { SocialLink } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function saveBrandSocials(request: Request) {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const body = (await request.json()) as { brandSocials?: SocialLink[] };
  if (!Array.isArray(body.brandSocials)) {
    return NextResponse.json({ error: 'brandSocials array is required.' }, { status: 400 });
  }

  const brandSocials = await replaceBrandSocials(body.brandSocials);
  return NextResponse.json(
    { ok: true, brandSocials },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function GET() {
  noStore();
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const brandSocials = await listBrandSocials();
  return NextResponse.json(
    { brandSocials },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function POST(request: Request) {
  try {
    return await saveBrandSocials(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    return await saveBrandSocials(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform') ?? '';
    const url = searchParams.get('url') ?? '';

    const brandSocials = await deleteBrandSocialLink(platform, url);
    return NextResponse.json(
      { ok: true, brandSocials },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request.';
    const status = message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
