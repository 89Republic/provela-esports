import { NextResponse } from 'next/server';
import { listNewsArticles } from '@/lib/news';

export async function GET() {
  try {
    const newsArticles = await listNewsArticles();
    return NextResponse.json({ newsArticles });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load news.' },
      { status: 500 },
    );
  }
}
