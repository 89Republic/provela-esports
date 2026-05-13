'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, X, ChevronDown, ChevronRight } from 'lucide-react';
import { AdminLayout } from '../admin-layout';
import { PageTitle, Card, CardHeader, CardBody, Toast, Field, FieldRow, EmptyState } from '../admin-ui';
import { useAdminContent } from '../use-admin-content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Division, PlayerProfile } from '@/lib/types';

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
    avatar: '/placeholder-user.jpg',
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
          <Field label="Avatar URL"><Input value={player.avatar} onChange={e => onChange({ ...player, avatar: e.target.value })} placeholder="/placeholder-user.jpg" /></Field>
        </div>
      )}
    </div>
  );
}

function DivisionForm({ division, onSave, onCancel }: {
  division: Division;
  onSave: (d: Division) => void;
  onCancel: () => void;
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

  return (
    <div className="space-y-6">
      <FieldRow>
        <Field label="Name" required><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Division name" /></Field>
        <Field label="Game" required><Input value={form.game} onChange={e => set('game', e.target.value)} placeholder="EA SPORTS FC" /></Field>
      </FieldRow>
      <FieldRow>
        <Field label="Icon / Badge"><Input value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="FC" /></Field>
        <FieldRow className="grid-cols-2">
          <Field label="Teams"><Input type="number" value={form.teams} onChange={e => set('teams', Number(e.target.value))} /></Field>
          <Field label="Players"><Input type="number" value={form.players} onChange={e => set('players', Number(e.target.value))} /></Field>
        </FieldRow>
      </FieldRow>
      <Field label="Tagline"><Input value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Short tagline" /></Field>
      <Field label="Description"><Textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Full description…" className="min-h-24" /></Field>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="featured" checked={!!form.featured} onChange={e => set('featured', e.target.checked)} className="size-4 accent-primary" />
        <label htmlFor="featured" className="text-sm text-foreground">Featured on homepage</label>
      </div>

      {/* Roster */}
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

      {/* Achievements */}
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
        <Button onClick={() => onSave(form)} disabled={!form.name || !form.game}>Save Division</Button>
        <Button variant="outline" onClick={onCancel}><X className="size-4 mr-1" />Cancel</Button>
      </div>
    </div>
  );
}

export default function DivisionsAdminPage() {
  const { content, isLoading, isSaving, toast, save } = useAdminContent();
  const [editing, setEditing] = useState<Division | null>(null);
  const [isNew, setIsNew] = useState(false);

  if (isLoading || !content) {
    return (
      <AdminLayout>
        <PageTitle title="Divisions" />
        <p className="text-sm text-muted-foreground">Loading…</p>
        <Toast message={toast.message} kind={toast.kind} />
      </AdminLayout>
    );
  }

  const handleSave = async (d: Division) => {
    const next = isNew
      ? [...content.divisions, d]
      : content.divisions.map(x => x.id === d.id ? d : x);
    await save({ ...content, divisions: next });
    setEditing(null);
    setIsNew(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this division?')) return;
    await save({ ...content, divisions: content.divisions.filter(d => d.id !== id) });
  };

  return (
    <AdminLayout>
      <PageTitle
        title="Divisions"
        subtitle={`${content.divisions.length} division${content.divisions.length !== 1 ? 's' : ''}`}
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
            <DivisionForm division={editing} onSave={handleSave} onCancel={() => { setEditing(null); setIsNew(false); }} />
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="p-0">
            {content.divisions.length === 0 && <EmptyState message="No divisions yet. Add one above." />}
            {content.divisions.map((d, i) => (
              <div key={d.id} className={`flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3.5 ${i < content.divisions.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-foreground text-sm">{d.name}</p>
                    {d.featured && <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">Featured</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{d.game} · {d.players} players · {d.roster.length} roster</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => { setEditing(d); setIsNew(false); }}>
                    <Pencil className="size-3 mr-1" />Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(d.id)} disabled={isSaving} className="text-destructive hover:text-destructive border-destructive/40 hover:bg-destructive/5">
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
