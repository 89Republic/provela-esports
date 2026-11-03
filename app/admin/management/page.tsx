'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { AdminLayout } from '../admin-layout';
import {
  PageTitle,
  Card,
  CardHeader,
  CardBody,
  Toast,
  Field,
  FieldRow,
  EmptyState,
  InfoBanner,
  SocialLinksEditor,
  DeleteConfirmDialog,
} from '../admin-ui';
import { ImageUploadField } from '../image-upload-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ManagementMember } from '@/lib/types';
import { BRAND_LOGO } from '@/lib/constants';

function newMember(order: number): ManagementMember {
  return {
    id: `mgmt-${Date.now()}`,
    name: '',
    role: '',
    photo: BRAND_LOGO,
    bio: '',
    socialLinks: [],
    order,
  };
}

function MemberForm({ member, onSave, onCancel, isSaving }: {
  member: ManagementMember;
  onSave: (m: ManagementMember) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<ManagementMember>(member);
  const set = <K extends keyof ManagementMember>(key: K, value: ManagementMember[K]) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6">
      <FieldRow>
        <Field label="Name" required>
          <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name" />
        </Field>
        <Field label="Role" required>
          <Input value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="Founder & CEO" />
        </Field>
      </FieldRow>
      <Field label="Display Order">
        <Input type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} className="w-32" />
        <p className="text-xs text-muted-foreground mt-1">Lower numbers appear first on the About page.</p>
      </Field>
      <Field label="Photo">
        <ImageUploadField
          value={form.photo}
          onChange={(photo) => set('photo', photo)}
          alt={form.name || 'Management photo'}
          folder="management"
          placeholder={BRAND_LOGO}
          contain
        />
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => set('photo', BRAND_LOGO)}>
          Use Provela logo
        </Button>
      </Field>
      <Field label="Bio">
        <Textarea value={form.bio} onChange={(e) => set('bio', e.target.value)} placeholder="Short bio…" className="min-h-24" />
      </Field>
      <Field label="Social Links">
        <SocialLinksEditor
          links={form.socialLinks}
          onChange={(links) => set('socialLinks', links)}
        />
      </Field>
      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave(form)} disabled={!form.name.trim() || !form.role.trim() || isSaving}>
          {isSaving ? 'Saving…' : 'Save Member'}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isSaving}><X className="size-4 mr-1" />Cancel</Button>
      </div>
    </div>
  );
}

export default function ManagementAdminPage() {
  const [members, setMembers] = useState<ManagementMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState<ManagementMember | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind: 'success' | 'error' | 'idle' }>({
    message: '',
    kind: 'idle',
  });

  const notify = useCallback((message: string, kind: 'success' | 'error') => {
    setToast({ message, kind });
    setTimeout(() => setToast({ message: '', kind: 'idle' }), 3500);
  }, []);

  const loadMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/management', { cache: 'no-store' });
      const data = (await response.json()) as { management?: ManagementMember[]; error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to load management.', 'error');
        return;
      }

      setMembers(data.management ?? []);
    } catch {
      notify('Failed to load management.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  const handleSave = async (member: ManagementMember) => {
    const hasEmptyUrl = member.socialLinks.some((link) => !link.url.trim());
    if (hasEmptyUrl) {
      notify('Add a URL for each social link, or remove empty rows before saving.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(
        isNew ? '/api/admin/management' : `/api/admin/management/${member.id}`,
        {
          method: isNew ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(member),
        },
      );

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to save member.', 'error');
        return;
      }

      notify(isNew ? 'Member added.' : 'Member updated.', 'success');
      setEditing(null);
      setIsNew(false);
      await loadMembers();
    } catch {
      notify('Failed to save member.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (member: ManagementMember) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/management/${member.id}`, { method: 'DELETE' });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to delete member.', 'error');
        return;
      }

      notify(`Removed ${member.name}.`, 'success');
      await loadMembers();
    } catch {
      notify('Failed to delete member.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const nextOrder = members.reduce((max, m) => Math.max(max, m.order), 0) + 1;

  return (
    <AdminLayout>
      <PageTitle
        title="Management"
        subtitle={`${members.length} member${members.length !== 1 ? 's' : ''} · About page`}
        action={
          !editing && (
            <Button onClick={() => { setEditing(newMember(nextOrder)); setIsNew(true); }} disabled={isSaving}>
              <Plus className="size-4 mr-2" />Add Member
            </Button>
          )
        }
      />

      <InfoBanner className="mb-6">
        Management members appear in the Management section of the About page, sorted by display order. The section is hidden when there are no members.
      </InfoBanner>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : editing ? (
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-foreground">{isNew ? 'New Member' : `Editing: ${editing.name}`}</h2>
          </CardHeader>
          <CardBody>
            <MemberForm
              member={editing}
              onSave={handleSave}
              onCancel={() => { setEditing(null); setIsNew(false); }}
              isSaving={isSaving}
            />
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="p-0">
            {members.length === 0 && <EmptyState message="No management members yet. Add one above." />}
            {members.map((m, i) => (
              <div key={m.id} className={`flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3.5 ${i < members.length - 1 ? 'border-b border-border' : ''}`}>
                <span className="w-8 shrink-0 text-xs font-mono text-muted-foreground">#{m.order}</span>
                {m.photo && (
                  <div className="size-10 shrink-0 overflow-hidden rounded-full border border-border bg-background">
                    <img src={m.photo} alt={m.name} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{m.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{m.role}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => { setEditing(m); setIsNew(false); }}>
                    <Pencil className="size-3 mr-1" />Edit
                  </Button>
                  <DeleteConfirmDialog
                    title="Delete member?"
                    description={`${m.name} will be permanently removed from the About page.`}
                    onConfirm={() => handleDelete(m)}
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
