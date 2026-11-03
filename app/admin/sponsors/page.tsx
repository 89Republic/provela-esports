'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { AdminLayout } from '../admin-layout';
import { PageTitle, Card, CardHeader, CardBody, Toast, Field, EmptyState, InfoBanner, DeleteConfirmDialog } from '../admin-ui';
import { ImageUploadField } from '../image-upload-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Sponsor } from '@/lib/types';

function normalizeSponsor(sponsor: Sponsor): Sponsor {
  return {
    ...sponsor,
    name: sponsor.name ?? '',
    logo: sponsor.logo ?? '',
    website: sponsor.website ?? '',
  };
}

function newSponsor(): Sponsor {
  return {
    id: `sponsor-${Date.now()}`,
    name: '',
    logo: '',
    website: '',
  };
}

function SponsorForm({ sponsor, onSave, onCancel, isSaving }: {
  sponsor: Sponsor;
  onSave: (s: Sponsor) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<Sponsor>(() => normalizeSponsor(sponsor));
  const set = <K extends keyof Sponsor>(key: K, value: Sponsor[K]) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6">
      <Field label="Name" required>
        <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Razer" />
      </Field>
      <Field label="Logo" required>
        <ImageUploadField
          value={form.logo}
          onChange={(logo) => set('logo', logo)}
          alt={form.name || 'Sponsor logo'}
          folder="sponsors"
          placeholder="/uploads/sponsors/logo.png"
          contain
        />
      </Field>
      <Field label="Website">
        <Input value={form.website ?? ''} onChange={(e) => set('website', e.target.value)} placeholder="https://…" />
        <p className="text-xs text-muted-foreground mt-1">Optional. The partner card on /partners links here.</p>
      </Field>
      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave(form)} disabled={!form.name.trim() || !form.logo?.trim() || isSaving}>
          {isSaving ? 'Saving…' : 'Save Sponsor'}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isSaving}><X className="size-4 mr-1" />Cancel</Button>
      </div>
    </div>
  );
}

export default function SponsorsAdminPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind: 'success' | 'error' | 'idle' }>({
    message: '',
    kind: 'idle',
  });

  const notify = useCallback((message: string, kind: 'success' | 'error') => {
    setToast({ message, kind });
    setTimeout(() => setToast({ message: '', kind: 'idle' }), 3500);
  }, []);

  const loadSponsors = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/sponsors', { cache: 'no-store' });
      const data = (await response.json()) as { sponsors?: Sponsor[]; error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to load sponsors.', 'error');
        return;
      }

      setSponsors(data.sponsors ?? []);
    } catch {
      notify('Failed to load sponsors.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void loadSponsors();
  }, [loadSponsors]);

  const handleSave = async (sponsor: Sponsor) => {
    setIsSaving(true);
    try {
      const response = await fetch(
        isNew ? '/api/admin/sponsors' : `/api/admin/sponsors/${sponsor.id}`,
        {
          method: isNew ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sponsor),
        },
      );

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to save sponsor.', 'error');
        return;
      }

      notify(isNew ? 'Sponsor created.' : 'Sponsor updated.', 'success');
      setEditing(null);
      setIsNew(false);
      await loadSponsors();
    } catch {
      notify('Failed to save sponsor.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (sponsor: Sponsor) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/sponsors/${sponsor.id}`, { method: 'DELETE' });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to delete sponsor.', 'error');
        return;
      }

      notify(`Removed ${sponsor.name}.`, 'success');
      await loadSponsors();
    } catch {
      notify('Failed to delete sponsor.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <PageTitle
        title="Sponsors"
        subtitle={`${sponsors.length} partner${sponsors.length !== 1 ? 's' : ''} · homepage marquee`}
        action={
          !editing && (
            <Button onClick={() => { setEditing(newSponsor()); setIsNew(true); }} disabled={isSaving}>
              <Plus className="size-4 mr-2" />Add Sponsor
            </Button>
          )
        }
      />

      <InfoBanner className="mb-6">
        Sponsors appear in the scrolling marquee at the bottom of the homepage and on the /partners page. Order here matches display order.
      </InfoBanner>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : editing ? (
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-foreground">{isNew ? 'New Sponsor' : `Editing: ${editing.name}`}</h2>
          </CardHeader>
          <CardBody>
            <SponsorForm
              sponsor={editing}
              onSave={handleSave}
              onCancel={() => { setEditing(null); setIsNew(false); }}
              isSaving={isSaving}
            />
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="p-0">
            {sponsors.length === 0 && <EmptyState message="No sponsors yet. Add one above." />}
            {sponsors.map((s, i) => (
              <div key={s.id} className={`flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3.5 ${i < sponsors.length - 1 ? 'border-b border-border' : ''}`}>
                {s.logo && (
                  <div className="h-10 w-24 shrink-0 overflow-hidden rounded border border-border bg-background p-1">
                    <img src={s.logo} alt={s.name} className="h-full w-full object-contain" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.website || 'No website'}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => { setEditing(normalizeSponsor(s)); setIsNew(false); }}>
                    <Pencil className="size-3 mr-1" />Edit
                  </Button>
                  <DeleteConfirmDialog
                    title="Delete sponsor?"
                    description={`${s.name} will be permanently removed from the homepage marquee and /partners page.`}
                    onConfirm={() => handleDelete(s)}
                    disabled={isSaving}
                  >
                    <Button variant="outline" size="sm" disabled={isSaving} className="text-destructive hover:text-destructive border-destructive/40 hover:bg-destructive/5">
                      <Trash2 className="size-3" />
                    </Button>
                  </DeleteConfirmDialog>
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
