'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { AdminLayout } from '../admin-layout';
import { PageTitle, Card, CardHeader, CardBody, Toast, Field, FieldRow, EmptyState, ImagePreview } from '../admin-ui';
import { useAdminContent } from '../use-admin-content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Tournament, TournamentParticipant, TournamentScheduleItem, TournamentStandingsEntry } from '@/lib/types';
import { formatPrizePool } from '@/lib/utils';

function newTournament(): Tournament {
  return {
    id: `t-${Date.now()}`,
    name: '',
    game: '',
    division: 'FCX',
    status: 'upcoming',
    overview: '',
    format: '',
    startDate: '',
    endDate: '',
    prizePool: '',
    registrationOpen: false,
    image: '/images/tournament.jpg',
    participants: [],
    standings: [],
    schedule: [],
    results: [],
  };
}

function TournamentForm({ tournament, onSave, onCancel }: {
  tournament: Tournament;
  onSave: (t: Tournament) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Tournament>(tournament);
  const set = <K extends keyof Tournament>(key: K, value: Tournament[K]) => setForm(f => ({ ...f, [key]: value }));

  const addParticipant = () => set('participants', [...form.participants, { id: `par-${Date.now()}`, name: '', type: 'team' } as TournamentParticipant]);
  const updateParticipant = (i: number, key: keyof TournamentParticipant, val: string) =>
    set('participants', form.participants.map((p, idx) => idx === i ? { ...p, [key]: val } : p));
  const removeParticipant = (i: number) => set('participants', form.participants.filter((_, idx) => idx !== i));

  const addScheduleItem = () => set('schedule', [...form.schedule, { id: `sch-${Date.now()}`, label: '', stage: '', date: '' } as TournamentScheduleItem]);
  const updateSchedule = (i: number, key: keyof TournamentScheduleItem, val: string) =>
    set('schedule', form.schedule.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  const removeSchedule = (i: number) => set('schedule', form.schedule.filter((_, idx) => idx !== i));

  const addStanding = () => set('standings', [...form.standings, { rank: form.standings.length + 1, name: '', played: 0, points: 0 } as TournamentStandingsEntry]);
  const updateStanding = (i: number, key: keyof TournamentStandingsEntry, val: string | number) =>
    set('standings', form.standings.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  const removeStanding = (i: number) => set('standings', form.standings.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-6">
      <FieldRow>
        <Field label="Name" required><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="FCX Pro Series S3" /></Field>
        <Field label="Game" required><Input value={form.game} onChange={e => set('game', e.target.value)} placeholder="EA SPORTS FC" /></Field>
      </FieldRow>
      <FieldRow>
        <Field label="Status">
          <Select value={form.status} onValueChange={v => set('status', v as Tournament['status'])}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="past">Past</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Prize Pool"><Input value={form.prizePool} onChange={e => set('prizePool', e.target.value)} placeholder="GH₵5,000" /></Field>
      </FieldRow>
      <FieldRow>
        <Field label="Start Date"><Input type="datetime-local" value={form.startDate.slice(0, 16)} onChange={e => set('startDate', new Date(e.target.value).toISOString())} /></Field>
        <Field label="End Date"><Input type="datetime-local" value={form.endDate.slice(0, 16)} onChange={e => set('endDate', new Date(e.target.value).toISOString())} /></Field>
      </FieldRow>
      <Field label="Image URL">
        <Input value={form.image} onChange={e => set('image', e.target.value)} placeholder="/images/tournament.jpg" />
        <ImagePreview src={form.image} alt={form.name} />
      </Field>
      <Field label="Overview"><Textarea value={form.overview} onChange={e => set('overview', e.target.value)} className="min-h-20" /></Field>
      <Field label="Format"><Textarea value={form.format} onChange={e => set('format', e.target.value)} className="min-h-16" /></Field>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="regOpen" checked={form.registrationOpen} onChange={e => set('registrationOpen', e.target.checked)} className="size-4 accent-primary" />
        <label htmlFor="regOpen" className="text-sm text-foreground">Registration open</label>
      </div>

      {/* Participants */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">Participants ({form.participants.length})</h3>
          <Button type="button" variant="outline" size="sm" onClick={addParticipant}><Plus className="size-3 mr-1" />Add</Button>
        </div>
        <div className="space-y-2">
          {form.participants.map((p, i) => (
            <div key={p.id} className="grid grid-cols-[1fr_auto_auto] gap-2 items-center">
              <Input placeholder="Team/Player name" value={p.name} onChange={e => updateParticipant(i, 'name', e.target.value)} />
              <Input placeholder="Record" className="w-24" value={p.record ?? ''} onChange={e => updateParticipant(i, 'record', e.target.value)} />
              <button onClick={() => removeParticipant(i)} className="text-muted-foreground hover:text-destructive p-2"><Trash2 className="size-4" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Standings */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">Standings</h3>
          <Button type="button" variant="outline" size="sm" onClick={addStanding}><Plus className="size-3 mr-1" />Add</Button>
        </div>
        <div className="space-y-2">
          {form.standings.map((s, i) => (
            <div key={i} className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-2 items-center">
              <Input type="number" className="w-16" placeholder="#" value={s.rank} onChange={e => updateStanding(i, 'rank', Number(e.target.value))} />
              <Input placeholder="Team name" value={s.name} onChange={e => updateStanding(i, 'name', e.target.value)} />
              <Input type="number" className="w-20" placeholder="Played" value={s.played} onChange={e => updateStanding(i, 'played', Number(e.target.value))} />
              <Input type="number" className="w-20" placeholder="Pts" value={s.points} onChange={e => updateStanding(i, 'points', Number(e.target.value))} />
              <button onClick={() => removeStanding(i)} className="text-muted-foreground hover:text-destructive p-2"><Trash2 className="size-4" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">Schedule</h3>
          <Button type="button" variant="outline" size="sm" onClick={addScheduleItem}><Plus className="size-3 mr-1" />Add</Button>
        </div>
        <div className="space-y-2">
          {form.schedule.map((s, i) => (
            <div key={s.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
              <Input placeholder="Label (Semi Final 1)" value={s.label} onChange={e => updateSchedule(i, 'label', e.target.value)} />
              <Input placeholder="Stage" value={s.stage} onChange={e => updateSchedule(i, 'stage', e.target.value)} />
              <Input type="datetime-local" value={s.date.slice(0, 16)} onChange={e => updateSchedule(i, 'date', new Date(e.target.value).toISOString())} />
              <button onClick={() => removeSchedule(i)} className="text-muted-foreground hover:text-destructive p-2"><Trash2 className="size-4" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      <Field label="Results (one per line)">
        <Textarea
          className="min-h-20 font-mono text-xs"
          value={form.results.join('\n')}
          onChange={e => set('results', e.target.value.split('\n'))}
          placeholder="Grand Final: Team A 3-2 Team B"
        />
      </Field>

      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave(form)} disabled={!form.name}>Save Tournament</Button>
        <Button variant="outline" onClick={onCancel}><X className="size-4 mr-1" />Cancel</Button>
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<Tournament['status'], string> = {
  active: 'bg-primary/10 text-primary',
  upcoming: 'bg-blue-500/10 text-blue-400',
  past: 'bg-muted text-muted-foreground',
};

export default function TournamentsAdminPage() {
  const { content, isLoading, isSaving, toast, save } = useAdminContent();
  const [editing, setEditing] = useState<Tournament | null>(null);
  const [isNew, setIsNew] = useState(false);

  if (isLoading || !content) {
    return <AdminLayout><PageTitle title="Tournaments" /><p className="text-sm text-muted-foreground">Loading…</p><Toast message={toast.message} kind={toast.kind} /></AdminLayout>;
  }

  const handleSave = async (t: Tournament) => {
    const next = isNew ? [...content.tournaments, t] : content.tournaments.map(x => x.id === t.id ? t : x);
    await save({ ...content, tournaments: next });
    setEditing(null); setIsNew(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tournament?')) return;
    await save({ ...content, tournaments: content.tournaments.filter(t => t.id !== id) });
  };

  return (
    <AdminLayout>
      <PageTitle
        title="Tournaments"
        subtitle={`${content.tournaments.length} tournament${content.tournaments.length !== 1 ? 's' : ''} · upcoming/active shown on homepage carousel`}
        action={!editing && <Button onClick={() => { setEditing(newTournament()); setIsNew(true); }} disabled={isSaving}><Plus className="size-4 mr-2" />Add Tournament</Button>}
      />

      {editing ? (
        <Card>
          <CardHeader><h2 className="text-sm font-semibold text-foreground">{isNew ? 'New Tournament' : `Editing: ${editing.name}`}</h2></CardHeader>
          <CardBody><TournamentForm tournament={editing} onSave={handleSave} onCancel={() => { setEditing(null); setIsNew(false); }} /></CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="p-0">
            {content.tournaments.length === 0 && <EmptyState message="No tournaments yet." />}
            {content.tournaments.map((t, i) => (
              <div key={t.id} className={`flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3.5 ${i < content.tournaments.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-foreground text-sm">{t.name}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded capitalize ${STATUS_STYLES[t.status]}`}>{t.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t.game} · {formatPrizePool(t.prizePool)} · {t.participants.length} teams</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => { setEditing(t); setIsNew(false); }}><Pencil className="size-3 mr-1" />Edit</Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(t.id)} disabled={isSaving} className="text-destructive hover:text-destructive border-destructive/40 hover:bg-destructive/5"><Trash2 className="size-3" /></Button>
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
