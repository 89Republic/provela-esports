'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { AdminLayout } from '../admin-layout';
import { PageTitle, Card, CardHeader, CardBody, Toast, Field, FieldRow, EmptyState } from '../admin-ui';
import { useAdminContent } from '../use-admin-content';
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

function ArticleForm({ article, onSave, onCancel }: {
  article: NewsArticle;
  onSave: (a: NewsArticle) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<NewsArticle>(article);
  const set = <K extends keyof NewsArticle>(key: K, value: NewsArticle[K]) => setForm(f => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6">
      <Field label="Title" required><Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Article headline" /></Field>
      <Field label="Excerpt"><Textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} className="min-h-16" placeholder="Short summary shown on cards" /></Field>
      <FieldRow>
        <Field label="Author"><Input value={form.author} onChange={e => set('author', e.target.value)} placeholder="Provela Editorial" /></Field>
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
        <Field label="Cover Image URL"><Input value={form.image} onChange={e => set('image', e.target.value)} placeholder="/images/…" /></Field>
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
        <Button onClick={() => onSave(form)} disabled={!form.title}>Save Article</Button>
        <Button variant="outline" onClick={onCancel}><X className="size-4 mr-1" />Cancel</Button>
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
  const { content, isLoading, isSaving, toast, save } = useAdminContent();
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [isNew, setIsNew] = useState(false);

  if (isLoading || !content) {
    return <AdminLayout><PageTitle title="News" /><p className="text-sm text-muted-foreground">Loading…</p><Toast message={toast.message} kind={toast.kind} /></AdminLayout>;
  }

  const handleSave = async (a: NewsArticle) => {
    const next = isNew ? [a, ...content.newsArticles] : content.newsArticles.map(x => x.id === a.id ? a : x);
    await save({ ...content, newsArticles: next });
    setEditing(null); setIsNew(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    await save({ ...content, newsArticles: content.newsArticles.filter(a => a.id !== id) });
  };

  return (
    <AdminLayout>
      <PageTitle
        title="News"
        subtitle={`${content.newsArticles.length} article${content.newsArticles.length !== 1 ? 's' : ''}`}
        action={!editing && <Button onClick={() => { setEditing(newArticle()); setIsNew(true); }} disabled={isSaving}><Plus className="size-4 mr-2" />New Article</Button>}
      />

      {editing ? (
        <Card>
          <CardHeader><h2 className="text-sm font-semibold text-foreground">{isNew ? 'New Article' : `Editing: ${editing.title}`}</h2></CardHeader>
          <CardBody><ArticleForm article={editing} onSave={handleSave} onCancel={() => { setEditing(null); setIsNew(false); }} /></CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="p-0">
            {content.newsArticles.length === 0 && <EmptyState message="No articles yet." />}
            {content.newsArticles.map((a, i) => (
              <div key={a.id} className={`flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3.5 ${i < content.newsArticles.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-foreground text-sm">{a.title}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${CATEGORY_STYLES[a.category]}`}>{a.category}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{a.author} · {a.date}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => { setEditing(a); setIsNew(false); }}><Pencil className="size-3 mr-1" />Edit</Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(a.id)} disabled={isSaving} className="text-destructive hover:text-destructive border-destructive/40 hover:bg-destructive/5"><Trash2 className="size-3" /></Button>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      <Toast message={toast.message} kind={toast.kind} />
    </AdminLayout>
  );
}
