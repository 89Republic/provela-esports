'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { AdminLayout } from '../admin-layout';
import { PageTitle, Card, CardHeader, CardBody, Toast, Field, FieldRow, EmptyState, InfoBanner, DeleteConfirmDialog } from '../admin-ui';
import { ImageUploadField } from '../image-upload-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { NewsArticle } from '@/lib/types';

const CATEGORIES: NewsArticle['category'][] = ['Announcements', 'Results', 'Tournaments', 'Community'];

function newArticle(): NewsArticle {
  return {
    id: `news-${Date.now()}`,
    title: '',
    excerpt: '',
    image: '',
    date: new Date().toISOString().slice(0, 10),
    author: '',
    category: 'Announcements',
    content: [''],
  };
}

function ArticleForm({ article, onSave, onCancel, isSaving }: {
  article: NewsArticle;
  onSave: (a: NewsArticle) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<NewsArticle>(article);
  const set = <K extends keyof NewsArticle>(key: K, value: NewsArticle[K]) => setForm(f => ({ ...f, [key]: value }));

  const canSave = Boolean(form.title && form.excerpt && form.image && form.author);

  return (
    <div className="space-y-6">
      <Field label="Title" required><Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Article headline" /></Field>
      <Field label="Excerpt" required><Textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} className="min-h-16" placeholder="Short summary shown on cards" /></Field>
      <FieldRow>
        <Field label="Author" required><Input value={form.author} onChange={e => set('author', e.target.value)} placeholder="Provela Editorial" /></Field>
        <Field label="Date"><Input type="date" value={form.date} onChange={e => set('date', e.target.value)} /></Field>
      </FieldRow>
      <FieldRow>
        <Field label="Category">
          <Select value={form.category} onValueChange={v => set('category', v as NewsArticle['category'])}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Cover Image" required>
          <ImageUploadField
            value={form.image}
            onChange={(image) => set('image', image)}
            alt={form.title || 'Article cover'}
            folder="news"
            placeholder="/uploads/news/cover.jpg"
          />
        </Field>
      </FieldRow>
      <Field label="Article Body (one paragraph per line)">
        <Textarea
          className="min-h-48 font-mono text-xs"
          value={form.content.join('\n\n')}
          onChange={e => set('content', e.target.value.split('\n\n').filter(Boolean))}
          placeholder="First paragraph…&#10;&#10;Second paragraph…"
        />
      </Field>
      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave(form)} disabled={!canSave || isSaving}>
          {isSaving ? 'Saving…' : 'Save Article'}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isSaving}><X className="size-4 mr-1" />Cancel</Button>
      </div>
    </div>
  );
}

const CATEGORY_STYLES: Record<NewsArticle['category'], string> = {
  Announcements: 'bg-blue-500/10 text-blue-400',
  Results: 'bg-blue-600/10 text-blue-300',
  Tournaments: 'bg-blue-500/10 text-blue-400',
  Community: 'bg-blue-400/10 text-blue-300',
};

export default function NewsAdminPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind: 'success' | 'error' | 'idle' }>({
    message: '',
    kind: 'idle',
  });

  const notify = useCallback((message: string, kind: 'success' | 'error') => {
    setToast({ message, kind });
    setTimeout(() => setToast({ message: '', kind: 'idle' }), 3500);
  }, []);

  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/news', { cache: 'no-store' });
      const data = (await response.json()) as { newsArticles?: NewsArticle[]; error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to load news.', 'error');
        return;
      }

      setArticles(data.newsArticles ?? []);
    } catch {
      notify('Failed to load news.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void loadArticles();
  }, [loadArticles]);

  const handleSave = async (article: NewsArticle) => {
    setIsSaving(true);
    try {
      const response = await fetch(
        isNew ? '/api/admin/news' : `/api/admin/news/${article.id}`,
        {
          method: isNew ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(article),
        },
      );

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to save article.', 'error');
        return;
      }

      notify(isNew ? 'Article published.' : 'Article updated.', 'success');
      setEditing(null);
      setIsNew(false);
      await loadArticles();
    } catch {
      notify('Failed to save article.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/news/${id}`, { method: 'DELETE' });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to delete article.', 'error');
        return;
      }

      notify('Article deleted.', 'success');
      await loadArticles();
    } catch {
      notify('Failed to delete article.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <PageTitle
        title="News"
        subtitle={`${articles.length} article${articles.length !== 1 ? 's' : ''} · top 4 on Dispatch scene`}
        action={!editing && (
          <Button onClick={() => { setEditing(newArticle()); setIsNew(true); }} disabled={isSaving}>
            <Plus className="size-4 mr-2" />New Article
          </Button>
        )}
      />

      <InfoBanner className="mb-6">
        Homepage Dispatch shows the 4 most recent articles. Categories map to display labels: Announcements → Stream Network, Results → Match Result, Tournaments → Tournament Report, Community → Community Signal.
      </InfoBanner>

      {editing ? (
        <Card>
          <CardHeader><h2 className="text-sm font-semibold text-foreground">{isNew ? 'New Article' : `Editing: ${editing.title}`}</h2></CardHeader>
          <CardBody>
            <ArticleForm
              article={editing}
              onSave={handleSave}
              onCancel={() => { setEditing(null); setIsNew(false); }}
              isSaving={isSaving}
            />
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="p-0">
            {isLoading ? (
              <p className="px-4 py-8 text-sm text-muted-foreground">Loading articles…</p>
            ) : articles.length === 0 ? (
              <EmptyState message="No articles yet." />
            ) : (
              articles.map((a, i) => (
                <div key={a.id} className={`flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3.5 ${i < articles.length - 1 ? 'border-b border-border' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground text-sm">{a.title}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${CATEGORY_STYLES[a.category]}`}>{a.category}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{a.author} · {a.date}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => { setEditing(a); setIsNew(false); }}><Pencil className="size-3 mr-1" />Edit</Button>
                    <DeleteConfirmDialog
                      title="Delete article?"
                      description={`"${a.title}" will be permanently removed from the site and homepage Dispatch.`}
                      onConfirm={() => handleDelete(a.id)}
                      disabled={isSaving}
                    >
                      <Button variant="outline" size="sm" disabled={isSaving} className="text-destructive hover:text-destructive border-destructive/40 hover:bg-destructive/5">
                        <Trash2 className="size-3" />
                      </Button>
                    </DeleteConfirmDialog>
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      )}

      <Toast message={toast.message} kind={toast.kind} />
    </AdminLayout>
  );
}
