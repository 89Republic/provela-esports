import { NextResponse } from 'next/server';
import { listPublishedNewsArticles } from '@/lib/news';

export async function GET() {
  try {
    const newsArticles = await listPublishedNewsArticles();
    return NextResponse.json({ newsArticles });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load news.' },
      { status: 500 },
    );
  }
}
