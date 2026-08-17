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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Streamer } from '@/lib/types';

function newStreamer(): Streamer {
  return {
    id: `str-${Date.now()}`,
    name: '',
    game: '',
    avatar: '/placeholder-user.jpg',
    status: 'offline',
    platform: 'youtube',
    followers: 0,
    bio: '',
    embedUrl: '',
    liveUrl: '',
    socialLinks: [],
    highlights: [],
    schedule: [],
  };
}

function formatFollowers(count: number) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (count >= 1_000) return `${Math.round(count / 1_000)}K`;
  return count.toLocaleString();
}

const STATUS_STYLES: Record<Streamer['status'], string> = {
  live: 'bg-primary/10 text-primary',
  offline: 'bg-muted text-muted-foreground',
};

function StreamerForm({ streamer, onSave, onCancel, isSaving }: {
  streamer: Streamer;
  onSave: (s: Streamer) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<Streamer>(streamer);
  const set = <K extends keyof Streamer>(key: K, value: Streamer[K]) => setForm(f => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6">
      <FieldRow>
        <Field label="Name" required><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="PVL Lens" /></Field>
        <Field label="Game"><Input value={form.game} onChange={e => set('game', e.target.value)} placeholder="EA SPORTS FC" /></Field>
      </FieldRow>
      <FieldRow>
        <Field label="Status">
          <Select value={form.status} onValueChange={v => set('status', v as Streamer['status'])}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Platform">
          <Select value={form.platform} onValueChange={v => set('platform', v as Streamer['platform'])}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="twitch">Twitch</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </FieldRow>
      <Field label="Followers">
        <Input type="number" value={form.followers} onChange={e => set('followers', Number(e.target.value))} />
      </Field>
      <Field label="Avatar">
        <ImageUploadField
          value={form.avatar}
          onChange={(avatar) => set('avatar', avatar)}
          alt={form.name || 'Streamer avatar'}
          folder="streamers"
          placeholder="/uploads/streamers/avatar.jpg"
        />
      </Field>
      <Field label="Bio"><Textarea value={form.bio} onChange={e => set('bio', e.target.value)} className="min-h-20" placeholder="Shown on the streamer profile page" /></Field>
      <FieldRow>
        <Field label="Live URL" required>
          <Input value={form.liveUrl} onChange={e => set('liveUrl', e.target.value)} placeholder="https://youtube.com/…/live" />
          <p className="text-xs text-muted-foreground mt-1">Primary streaming link on the profile page.</p>
        </Field>
        <Field label="Embed URL">
          <Input value={form.embedUrl} onChange={e => set('embedUrl', e.target.value)} placeholder="https://www.youtube.com/embed/…" />
          <p className="text-xs text-muted-foreground mt-1">Embedded player when status is Live.</p>
        </Field>
      </FieldRow>
      <Field label="Social Links">
        <SocialLinksEditor
          links={form.socialLinks}
          onChange={links => set('socialLinks', links)}
        />
      </Field>
      <Field label="Highlights (one per line)">
        <Textarea className="min-h-20 font-mono text-xs" value={form.highlights.join('\n')} onChange={e => set('highlights', e.target.value.split('\n'))} />
      </Field>
      <Field label="Schedule (one entry per line)">
        <Textarea className="min-h-16 font-mono text-xs" value={form.schedule.join('\n')} onChange={e => set('schedule', e.target.value.split('\n'))} />
      </Field>

      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave(form)} disabled={!form.name || !form.liveUrl || isSaving}>
          {isSaving ? 'Saving…' : 'Save Streamer'}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isSaving}><X className="size-4 mr-1" />Cancel</Button>
      </div>
    </div>
  );
}

export default function StreamersAdminPage() {
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState<Streamer | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind: 'success' | 'error' | 'idle' }>({
    message: '',
    kind: 'idle',
  });

  const notify = useCallback((message: string, kind: 'success' | 'error') => {
    setToast({ message, kind });
    setTimeout(() => setToast({ message: '', kind: 'idle' }), 3500);
  }, []);

  const loadStreamers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/streamers', { cache: 'no-store' });
      const data = (await response.json()) as { streamers?: Streamer[]; error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to load streamers.', 'error');
        return;
      }

      setStreamers(data.streamers ?? []);
    } catch {
      notify('Failed to load streamers.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void loadStreamers();
  }, [loadStreamers]);

  const handleSave = async (streamer: Streamer) => {
    setIsSaving(true);
    try {
      const response = await fetch(
        isNew ? '/api/admin/streamers' : `/api/admin/streamers/${streamer.id}`,
        {
          method: isNew ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(streamer),
        },
      );

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to save streamer.', 'error');
        return;
      }

      notify(isNew ? 'Streamer created.' : 'Streamer updated.', 'success');
      setEditing(null);
      setIsNew(false);
      await loadStreamers();
    } catch {
      notify('Failed to save streamer.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (streamer: Streamer) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/streamers/${streamer.id}`, { method: 'DELETE' });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to delete streamer.', 'error');
        return;
      }

      notify(`Removed ${streamer.name}.`, 'success');
      await loadStreamers();
    } catch {
      notify('Failed to delete streamer.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const liveCount = streamers.filter(s => s.status === 'live').length;

  return (
    <AdminLayout>
      <PageTitle
        title="Streamers"
        subtitle={`${streamers.length} streamer${streamers.length !== 1 ? 's' : ''} · ${liveCount} live · Streamer Wall & profiles`}
        action={
          !editing && (
            <Button onClick={() => { setEditing(newStreamer()); setIsNew(true); }} disabled={isSaving}>
              <Plus className="size-4 mr-2" />Add Streamer
            </Button>
          )
        }
      />

      <InfoBanner className="mb-6">
        Streamer Wall and cards link to each creator&apos;s profile page. Set status to &quot;Live&quot; for the LIVE badge and embedded player on their profile.
      </InfoBanner>

      {editing ? (
        <Card>
          <CardHeader><h2 className="text-sm font-semibold text-foreground">{isNew ? 'New Streamer' : `Editing: ${editing.name}`}</h2></CardHeader>
          <CardBody>
            <StreamerForm
              streamer={editing}
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
              <p className="px-4 py-8 text-sm text-muted-foreground">Loading streamers…</p>
            ) : streamers.length === 0 ? (
              <EmptyState message="No streamers yet. Add one above." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Game</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Followers</TableHead>
                    <TableHead className="w-[120px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {streamers.map((streamer) => (
                    <TableRow key={streamer.id}>
                      <TableCell className="font-medium">{streamer.name}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-1.5 py-0.5 rounded capitalize ${STATUS_STYLES[streamer.status]}`}>
                          {streamer.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{streamer.game || '—'}</TableCell>
                      <TableCell className="capitalize">{streamer.platform}</TableCell>
                      <TableCell>{formatFollowers(streamer.followers)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setEditing(streamer); setIsNew(false); }}
                            aria-label={`Edit ${streamer.name}`}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <DeleteConfirmDialog
                            title="Delete streamer?"
                            description={`${streamer.name} will be permanently removed from the Streamer Wall and profile pages.`}
                            onConfirm={() => handleDelete(streamer)}
                            disabled={isSaving}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isSaving}
                              aria-label={`Delete ${streamer.name}`}
                            >
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </DeleteConfirmDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>
      )}

      <Toast message={toast.message} kind={toast.kind} />
    </AdminLayout>
  );
}
