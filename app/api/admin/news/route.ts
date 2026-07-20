import { NextResponse } from 'next/server';
import { createNewsArticle, listNewsArticles } from '@/lib/news';
import { getCurrentAdmin } from '@/lib/admin-auth';
import type { NewsArticle } from '@/lib/types';

export async function GET() {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const newsArticles = await listNewsArticles();
  return NextResponse.json({ newsArticles });
}

export async function POST(request: Request) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = (await request.json()) as Partial<NewsArticle>;
    const article = await createNewsArticle(body);
    return NextResponse.json({ ok: true, article }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request.';
    const status = message.includes('already exists') ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
