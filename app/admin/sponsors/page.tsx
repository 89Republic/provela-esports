'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { AdminLayout } from '../admin-layout';
import { PageTitle, Card, CardHeader, CardBody, Toast, Field, FieldRow, EmptyState, ImagePreview, InfoBanner } from '../admin-ui';
import { useAdminContent } from '../use-admin-content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Sponsor } from '@/lib/types';

function newSponsor(): Sponsor {
  return {
    id: `sponsor-${Date.now()}`,
    name: '',
    slug: '',
    color: 'FFFFFF',
  };
}

function SponsorForm({ sponsor, onSave, onCancel }: {
  sponsor: Sponsor;
  onSave: (s: Sponsor) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Sponsor>(sponsor);
  const set = <K extends keyof Sponsor>(key: K, value: Sponsor[K]) => setForm((f) => ({ ...f, [key]: value }));

  const previewSrc =
    form.logo || (form.slug ? `https://cdn.simpleicons.org/${form.slug}/${form.color}` : '');

  return (
    <div className="space-y-6">
      <Field label="Name" required>
        <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Razer" />
      </Field>
      <FieldRow>
        <Field label="Simple Icons slug (optional)">
          <Input value={form.slug ?? ''} onChange={(e) => set('slug', e.target.value || undefined)} placeholder="razer" />
        </Field>
        <Field label="Icon color (hex, no #)">
          <Input value={form.color} onChange={(e) => set('color', e.target.value)} placeholder="44D62C" />
        </Field>
      </FieldRow>
      <Field label="Custom logo URL (optional)">
        <Input value={form.logo ?? ''} onChange={(e) => set('logo', e.target.value || undefined)} placeholder="/sponsors/hyperx.svg" />
        {previewSrc && <ImagePreview src={previewSrc} alt={form.name} contain />}
      </Field>
      <InfoBanner>
        Leave slug empty when using a custom logo file. Otherwise logos load from Simple Icons using the slug and color.
      </InfoBanner>
      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave(form)} disabled={!form.name}>Save Sponsor</Button>
        <Button variant="outline" onClick={onCancel}><X className="size-4 mr-1" />Cancel</Button>
      </div>
    </div>
  );
}

export default function SponsorsAdminPage() {
  const { content, isLoading, isSaving, toast, save } = useAdminContent();
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [isNew, setIsNew] = useState(false);

  if (isLoading || !content) {
    return (
      <AdminLayout>
        <PageTitle title="Sponsors" />
        <p className="text-sm text-muted-foreground">Loading…</p>
        <Toast message={toast.message} kind={toast.kind} />
      </AdminLayout>
    );
  }

  const handleSave = async (s: Sponsor) => {
    const next = isNew
      ? [...content.sponsors, s]
      : content.sponsors.map((x) => (x.id === s.id ? s : x));
    await save({ ...content, sponsors: next });
    setEditing(null);
    setIsNew(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this sponsor?')) return;
    await save({ ...content, sponsors: content.sponsors.filter((s) => s.id !== id) });
  };

  return (
    <AdminLayout>
      <PageTitle
        title="Sponsors"
        subtitle={`${content.sponsors.length} partner${content.sponsors.length !== 1 ? 's' : ''} · homepage marquee`}
        action={
          !editing && (
            <Button onClick={() => { setEditing(newSponsor()); setIsNew(true); }} disabled={isSaving}>
              <Plus className="size-4 mr-2" />Add Sponsor
            </Button>
          )
        }
      />

      <InfoBanner className="mb-6">
        Sponsors appear in the scrolling marquee at the bottom of the homepage. Order here matches display order.
      </InfoBanner>

      {editing ? (
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-foreground">{isNew ? 'New Sponsor' : `Editing: ${editing.name}`}</h2>
          </CardHeader>
          <CardBody>
            <SponsorForm sponsor={editing} onSave={handleSave} onCancel={() => { setEditing(null); setIsNew(false); }} />
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="p-0">
            {content.sponsors.length === 0 && <EmptyState message="No sponsors yet. Add one above." />}
            {content.sponsors.map((s, i) => (
              <div key={s.id} className={`flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3.5 ${i < content.sponsors.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.logo ? `Custom: ${s.logo}` : s.slug ? `Icon: ${s.slug} · #${s.color}` : 'No icon configured'}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => { setEditing(s); setIsNew(false); }}>
                    <Pencil className="size-3 mr-1" />Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(s.id)} disabled={isSaving} className="text-destructive hover:text-destructive border-destructive/40 hover:bg-destructive/5">
                    <Trash2 className="size-3" />
                  </Button>
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
