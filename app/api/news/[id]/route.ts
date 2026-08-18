import { NextResponse } from 'next/server';
import { findNewsById } from '@/lib/news';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const article = await findNewsById(id);

    if (!article || !article.published) {
      return NextResponse.json({ error: 'News article not found.' }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load news article.' },
      { status: 500 },
    );
  }
}
