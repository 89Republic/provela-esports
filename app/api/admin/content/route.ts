import { NextResponse } from 'next/server';
import { getDefaultSiteContent, getSiteContent, saveSiteContent } from '@/lib/site-content';
import type { SiteContent } from '@/lib/site-content';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source');

  const data = source === 'default' ? getDefaultSiteContent() : await getSiteContent();
  return NextResponse.json({ data });
}

export async function PUT(request: Request) {
  try {
    const payload = (await request.json()) as { data?: unknown };

    if (!payload || typeof payload !== 'object' || !('data' in payload)) {
      return NextResponse.json({ error: 'Payload must include a data object.' }, { status: 400 });
    }

    await saveSiteContent(payload.data as SiteContent);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }
}
