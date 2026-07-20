'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, ChevronDown, ChevronRight } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ImageUploadField } from '../image-upload-field';
import type { Division, DivisionMediaItem, PlayerProfile } from '@/lib/types';
import { BRAND_LOGO } from '@/lib/constants';

function newDivision(): Division {
  return {
    id: `div-${Date.now()}`,
    name: '',
    game: '',
    tagline: '',
    description: '',
    icon: '',
    teams: 1,
    players: 0,
    featured: false,
    roster: [],
    achievements: [],
    media: [],
    schedule: [],
  };
}

function newPlayer(): PlayerProfile {
  return {
    id: `p-${Date.now()}`,
    tag: '',
    name: '',
    role: '',
    location: '',
    avatar: BRAND_LOGO,
    socialLinks: [],
  };
}

function PlayerEditor({ player, onChange, onRemove }: {
  player: PlayerProfile;
  onChange: (p: PlayerProfile) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border bg-background overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5">
        <button onClick={() => setOpen(v => !v)} className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors flex-1 text-left">
          {open ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          {player.tag || 'New Player'} {player.name ? `— ${player.name}` : ''}
        </button>
        <button onClick={onRemove} className="text-muted-foreground hover:text-destructive transition-colors p-1">
          <Trash2 className="size-4" />
        </button>
      </div>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
          <FieldRow>
            <Field label="Tag"><Input value={player.tag} onChange={e => onChange({ ...player, tag: e.target.value })} placeholder="PVL Tag" /></Field>
            <Field label="Name"><Input value={player.name} onChange={e => onChange({ ...player, name: e.target.value })} placeholder="Real name" /></Field>
          </FieldRow>
          <FieldRow>
            <Field label="Role"><Input value={player.role} onChange={e => onChange({ ...player, role: e.target.value })} placeholder="Captain, IGL…" /></Field>
            <Field label="Location"><Input value={player.location} onChange={e => onChange({ ...player, location: e.target.value })} placeholder="UK, USA…" /></Field>
          </FieldRow>
          <Field label="Squad Photo">
            <ImageUploadField
              value={player.avatar}
              onChange={(avatar) => onChange({ ...player, avatar })}
              alt={player.name || player.tag}
              folder="divisions/roster"
              placeholder={BRAND_LOGO}
              contain
            />
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => onChange({ ...player, avatar: BRAND_LOGO })}>
              Use Provela logo
            </Button>
          </Field>
          <Field label="Social Links">
            <SocialLinksEditor
              links={player.socialLinks}
              onChange={links => onChange({ ...player, socialLinks: links })}
            />
          </Field>
        </div>
      )}
    </div>
  );
}

function DivisionForm({ division, onSave, onCancel, isSaving }: {
  division: Division;
  onSave: (d: Division) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<Division>(division);

  const set = <K extends keyof Division>(key: K, value: Division[K]) => setForm(f => ({ ...f, [key]: value }));

  const addPlayer = () => set('roster', [...form.roster, newPlayer()]);
  const updatePlayer = (i: number, p: PlayerProfile) => set('roster', form.roster.map((r, idx) => idx === i ? p : r));
  const removePlayer = (i: number) => set('roster', form.roster.filter((_, idx) => idx !== i));

  const addAchievement = () => set('achievements', [...form.achievements, { title: '', event: '', year: '' }]);
  const updateAchievement = (i: number, key: 'title' | 'event' | 'year', val: string) =>
    set('achievements', form.achievements.map((a, idx) => idx === i ? { ...a, [key]: val } : a));
  const removeAchievement = (i: number) => set('achievements', form.achievements.filter((_, idx) => idx !== i));

  const addMedia = () =>
    set('media', [...form.media, { id: `media-${Date.now()}`, type: 'image', title: '', url: '' }]);
  const updateMedia = (i: number, key: keyof DivisionMediaItem, val: string) =>
    set('media', form.media.map((m, idx) => (idx === i ? { ...m, [key]: val } : m)));
  const removeMedia = (i: number) => set('media', form.media.filter((_, idx) => idx !== i));

  const handleSave = () => {
    onSave({ ...form, players: form.roster.length });
  };

  return (
    <div className="space-y-6">
      <FieldRow>
        <Field label="Name" required><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Division name" /></Field>
        <Field label="Game" required><Input value={form.game} onChange={e => set('game', e.target.value)} placeholder="EA SPORTS FC" /></Field>
      </FieldRow>
      <FieldRow>
        <Field label="Monogram / Icon" required>
          <Input value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="FC" />
          <p className="text-xs text-muted-foreground mt-1">Shown as the division logo on the homepage grid and /divisions page.</p>
        </Field>
        <FieldRow className="grid-cols-2">
          <Field label="Teams"><Input type="number" value={form.teams} onChange={e => set('teams', Number(e.target.value))} /></Field>
          <Field label="Players"><Input type="number" value={form.players} onChange={e => set('players', Number(e.target.value))} /></Field>
        </FieldRow>
      </FieldRow>
      <Field label="Tagline"><Input value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Short tagline" /></Field>
      <Field label="Description"><Textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Full description…" className="min-h-24" /></Field>
      <InfoBanner>
        All divisions appear on the homepage Divisions Scene and /divisions grid. Upload cover images and squad photos from your device, or paste a URL.
      </InfoBanner>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Media & Cover Image</h3>
          <Button type="button" variant="outline" size="sm" onClick={addMedia}><Plus className="size-3 mr-1" />Add Media</Button>
        </div>
        <p className="text-xs text-muted-foreground mb-3">The first image is used as the detail page hero. Division list pages use monograms, not cover images.</p>
        <div className="space-y-3">
          {form.media.map((m, i) => (
            <div key={m.id} className="rounded-lg border border-border p-3 space-y-2">
              <FieldRow>
                <Field label="Title"><Input value={m.title} onChange={e => updateMedia(i, 'title', e.target.value)} placeholder="Matchday photo" /></Field>
                <Field label="Type">
                  <select
                    value={m.type}
                    onChange={e => updateMedia(i, 'type', e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  >
                    <option value="image">Image</option>
                    <option value="clip">Clip</option>
                  </select>
                </Field>
              </FieldRow>
              <Field label={m.type === 'image' ? 'Image' : 'URL'}>
                {m.type === 'image' ? (
                  <ImageUploadField
                    value={m.url}
                    onChange={(url) => updateMedia(i, 'url', url)}
                    alt={m.title || 'Division media'}
                    folder="divisions/media"
                    placeholder="/uploads/divisions/media/photo.jpg"
                  />
                ) : (
                  <Input value={m.url} onChange={e => updateMedia(i, 'url', e.target.value)} placeholder="https://…" />
                )}
              </Field>
              <button type="button" onClick={() => removeMedia(i)} className="text-xs text-destructive hover:underline">Remove</button>
            </div>
          ))}
          {form.media.length === 0 && <p className="text-xs text-muted-foreground">No media yet.</p>}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Roster ({form.roster.length} players)</h3>
          <Button type="button" variant="outline" size="sm" onClick={addPlayer}><Plus className="size-3 mr-1" />Add Player</Button>
        </div>
        <div className="space-y-2">
          {form.roster.map((p, i) => (
            <PlayerEditor key={p.id} player={p} onChange={up => updatePlayer(i, up)} onRemove={() => removePlayer(i)} />
          ))}
          {form.roster.length === 0 && <p className="text-xs text-muted-foreground">No players yet.</p>}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Achievements</h3>
          <Button type="button" variant="outline" size="sm" onClick={addAchievement}><Plus className="size-3 mr-1" />Add</Button>
        </div>
        <div className="space-y-2">
          {form.achievements.map((a, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-start">
              <Input placeholder="Title" value={a.title} onChange={e => updateAchievement(i, 'title', e.target.value)} />
              <Input placeholder="Event" value={a.event} onChange={e => updateAchievement(i, 'event', e.target.value)} />
              <Input placeholder="Year" className="w-20" value={a.year} onChange={e => updateAchievement(i, 'year', e.target.value)} />
              <button onClick={() => removeAchievement(i)} className="text-muted-foreground hover:text-destructive p-2"><Trash2 className="size-4" /></button>
            </div>
          ))}
          {form.achievements.length === 0 && <p className="text-xs text-muted-foreground">No achievements yet.</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={handleSave} disabled={!form.name || !form.game || !form.icon || isSaving}>
          {isSaving ? 'Saving…' : 'Save Division'}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isSaving}><X className="size-4 mr-1" />Cancel</Button>
      </div>
    </div>
  );
}

export default function DivisionsAdminPage() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState<Division | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind: 'success' | 'error' | 'idle' }>({
    message: '',
    kind: 'idle',
  });

  const notify = useCallback((message: string, kind: 'success' | 'error') => {
    setToast({ message, kind });
    setTimeout(() => setToast({ message: '', kind: 'idle' }), 3500);
  }, []);

  const loadDivisions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/divisions', { cache: 'no-store' });
      const data = (await response.json()) as { divisions?: Division[]; error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to load divisions.', 'error');
        return;
      }

      setDivisions(data.divisions ?? []);
    } catch {
      notify('Failed to load divisions.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void loadDivisions();
  }, [loadDivisions]);

  const handleSave = async (division: Division) => {
    setIsSaving(true);
    try {
      const response = await fetch(
        isNew ? '/api/admin/divisions' : `/api/admin/divisions/${division.id}`,
        {
          method: isNew ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(division),
        },
      );

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to save division.', 'error');
        return;
      }

      notify(isNew ? 'Division created.' : 'Division updated.', 'success');
      setEditing(null);
      setIsNew(false);
      await loadDivisions();
    } catch {
      notify('Failed to save division.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (division: Division) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/divisions/${division.id}`, { method: 'DELETE' });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to delete division.', 'error');
        return;
      }

      notify(`Removed ${division.name}.`, 'success');
      await loadDivisions();
    } catch {
      notify('Failed to delete division.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <PageTitle
        title="Divisions"
        subtitle={`${divisions.length} division${divisions.length !== 1 ? 's' : ''} · all shown on homepage & /divisions`}
        action={
          !editing && (
            <Button onClick={() => { setEditing(newDivision()); setIsNew(true); }} disabled={isSaving}>
              <Plus className="size-4 mr-2" />Add Division
            </Button>
          )
        }
      />

      {editing ? (
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-foreground">{isNew ? 'New Division' : `Editing: ${editing.name}`}</h2>
          </CardHeader>
          <CardBody>
            <DivisionForm
              division={editing}
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
              <p className="px-4 py-8 text-sm text-muted-foreground">Loading divisions…</p>
            ) : divisions.length === 0 ? (
              <EmptyState message="No divisions yet. Add one above." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Game</TableHead>
                    <TableHead>Icon</TableHead>
                    <TableHead>Players</TableHead>
                    <TableHead>Roster</TableHead>
                    <TableHead className="w-[120px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {divisions.map((division) => (
                    <TableRow key={division.id}>
                      <TableCell className="font-medium">{division.name}</TableCell>
                      <TableCell className="text-muted-foreground">{division.game}</TableCell>
                      <TableCell>
                        {division.icon && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                            {division.icon}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{division.players}</TableCell>
                      <TableCell>{division.roster.length}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setEditing(division); setIsNew(false); }}
                            aria-label={`Edit ${division.name}`}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <DeleteConfirmDialog
                            title="Delete division?"
                            description={`${division.name} will be permanently removed from the homepage and /divisions pages.`}
                            onConfirm={() => handleDelete(division)}
                            disabled={isSaving}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isSaving}
                              aria-label={`Delete ${division.name}`}
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
