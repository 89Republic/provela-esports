import { NextResponse } from 'next/server';
import { deleteNewsById, findNewsById, updateNewsArticle } from '@/lib/news';
import { getCurrentAdmin } from '@/lib/admin-auth';
import type { NewsArticle } from '@/lib/types';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await context.params;
  const article = await findNewsById(id);
  if (!article) {
    return NextResponse.json({ error: 'News article not found.' }, { status: 404 });
  }

  return NextResponse.json({ article });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = (await request.json()) as Partial<NewsArticle>;
    const article = await updateNewsArticle(id, body);

    if (!article) {
      return NextResponse.json({ error: 'News article not found.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, article });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = await deleteNewsById(id);

  if (!deleted) {
    return NextResponse.json({ error: 'News article not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, article: deleted });
}
