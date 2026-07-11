'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { AdminLayout } from '../admin-layout';
import { PageTitle, Card, CardHeader, CardBody, Toast, Field, FieldRow, EmptyState, ImagePreview, InfoBanner, SocialLinksEditor } from '../admin-ui';
import { useAdminContent } from '../use-admin-content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

function StreamerForm({ streamer, onSave, onCancel }: {
  streamer: Streamer;
  onSave: (s: Streamer) => void;
  onCancel: () => void;
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
      <FieldRow>
        <Field label="Followers"><Input type="number" value={form.followers} onChange={e => set('followers', Number(e.target.value))} /></Field>
        <Field label="Avatar URL">
          <Input value={form.avatar} onChange={e => set('avatar', e.target.value)} placeholder="/images/…" />
          <ImagePreview src={form.avatar} alt={form.name} />
        </Field>
      </FieldRow>
      <Field label="Bio"><Textarea value={form.bio} onChange={e => set('bio', e.target.value)} className="min-h-20" placeholder="Optional — not shown on homepage" /></Field>
      <FieldRow>
        <Field label="Live URL" required>
          <Input value={form.liveUrl} onChange={e => set('liveUrl', e.target.value)} placeholder="https://youtube.com/…/live" />
          <p className="text-xs text-muted-foreground mt-1">Used by Streamer Wall monitors and /streamers cards.</p>
        </Field>
        <Field label="Embed URL">
          <Input value={form.embedUrl} onChange={e => set('embedUrl', e.target.value)} placeholder="https://www.youtube.com/embed/…" />
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
        <Button onClick={() => onSave(form)} disabled={!form.name}>Save Streamer</Button>
        <Button variant="outline" onClick={onCancel}><X className="size-4 mr-1" />Cancel</Button>
      </div>
    </div>
  );
}

export default function StreamersAdminPage() {
  const { content, isLoading, isSaving, toast, save } = useAdminContent();
  const [editing, setEditing] = useState<Streamer | null>(null);
  const [isNew, setIsNew] = useState(false);

  if (isLoading || !content) {
    return <AdminLayout><PageTitle title="Streamers" /><p className="text-sm text-muted-foreground">Loading…</p><Toast message={toast.message} kind={toast.kind} /></AdminLayout>;
  }

  const handleSave = async (s: Streamer) => {
    const next = isNew ? [...content.streamers, s] : content.streamers.map(x => x.id === s.id ? s : x);
    await save({ ...content, streamers: next });
    setEditing(null); setIsNew(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this streamer?')) return;
    await save({ ...content, streamers: content.streamers.filter(s => s.id !== id) });
  };

  return (
    <AdminLayout>
      <PageTitle
        title="Streamers"
        subtitle={`${content.streamers.length} streamer${content.streamers.length !== 1 ? 's' : ''} · ${content.streamers.filter(s => s.status === 'live').length} live · Streamer Wall`}
        action={!editing && <Button onClick={() => { setEditing(newStreamer()); setIsNew(true); }} disabled={isSaving}><Plus className="size-4 mr-2" />Add Streamer</Button>}
      />

      <InfoBanner className="mb-6">
        Streamer Wall shows avatar, name, game, followers, and live status. Set status to &quot;Live&quot; for the red LIVE badge. Cards link to the Live URL.
      </InfoBanner>

      {editing ? (
        <Card>
          <CardHeader><h2 className="text-sm font-semibold text-foreground">{isNew ? 'New Streamer' : `Editing: ${editing.name}`}</h2></CardHeader>
          <CardBody><StreamerForm streamer={editing} onSave={handleSave} onCancel={() => { setEditing(null); setIsNew(false); }} /></CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="p-0">
            {content.streamers.length === 0 && <EmptyState message="No streamers yet." />}
            {content.streamers.map((s, i) => (
              <div key={s.id} className={`flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3.5 ${i < content.streamers.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-sm">{s.name}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${s.status === 'live' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>{s.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{s.game} · {s.platform} · {s.followers.toLocaleString()} followers</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => { setEditing(s); setIsNew(false); }}><Pencil className="size-3 mr-1" />Edit</Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(s.id)} disabled={isSaving} className="text-destructive hover:text-destructive border-destructive/40 hover:bg-destructive/5"><Trash2 className="size-3" /></Button>
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
