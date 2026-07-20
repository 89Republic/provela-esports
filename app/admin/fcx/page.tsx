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
  ImagePreview,
  InfoBanner,
  DeleteConfirmDialog,
} from '../admin-ui';
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
import type { Tournament, TournamentParticipant, TournamentScheduleItem, TournamentStandingsEntry } from '@/lib/types';
import { formatPrizePool } from '@/lib/utils';

function newFcxEvent(): Tournament {
  return {
    id: `fcx-${Date.now()}`,
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

function formatDate(iso: string) {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function TournamentForm({ tournament, onSave, onCancel, isSaving }: {
  tournament: Tournament;
  onSave: (t: Tournament) => void;
  onCancel: () => void;
  isSaving: boolean;
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
              <button type="button" onClick={() => removeParticipant(i)} className="text-muted-foreground hover:text-destructive p-2"><Trash2 className="size-4" /></button>
            </div>
          ))}
        </div>
      </div>

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
              <button type="button" onClick={() => removeStanding(i)} className="text-muted-foreground hover:text-destructive p-2"><Trash2 className="size-4" /></button>
            </div>
          ))}
        </div>
      </div>

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
              <button type="button" onClick={() => removeSchedule(i)} className="text-muted-foreground hover:text-destructive p-2"><Trash2 className="size-4" /></button>
            </div>
          ))}
        </div>
      </div>

      <Field label="Results (one per line)">
        <Textarea
          className="min-h-20 font-mono text-xs"
          value={form.results.join('\n')}
          onChange={e => set('results', e.target.value.split('\n'))}
          placeholder="Grand Final: Team A 3-2 Team B"
        />
      </Field>

      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave(form)} disabled={!form.name || !form.game || isSaving}>
          {isSaving ? 'Saving…' : 'Save Event'}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isSaving}><X className="size-4 mr-1" />Cancel</Button>
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<Tournament['status'], string> = {
  active: 'bg-primary/10 text-primary',
  upcoming: 'bg-blue-500/10 text-blue-400',
  past: 'bg-muted text-muted-foreground',
};

export default function FcxAdminPage() {
  const [events, setEvents] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState<Tournament | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind: 'success' | 'error' | 'idle' }>({
    message: '',
    kind: 'idle',
  });

  const notify = useCallback((message: string, kind: 'success' | 'error') => {
    setToast({ message, kind });
    setTimeout(() => setToast({ message: '', kind: 'idle' }), 3500);
  }, []);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/fcx', { cache: 'no-store' });
      const data = (await response.json()) as { fcx?: Tournament[]; error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to load FCX events.', 'error');
        return;
      }

      setEvents(data.fcx ?? []);
    } catch {
      notify('Failed to load FCX events.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const handleSave = async (tournament: Tournament) => {
    setIsSaving(true);
    try {
      const response = await fetch(
        isNew ? '/api/admin/fcx' : `/api/admin/fcx/${tournament.id}`,
        {
          method: isNew ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tournament),
        },
      );

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to save tournament.', 'error');
        return;
      }

      notify(isNew ? 'FCX event created.' : 'FCX event updated.', 'success');
      setEditing(null);
      setIsNew(false);
      await loadEvents();
    } catch {
      notify('Failed to save FCX event.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (tournament: Tournament) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/fcx/${tournament.id}`, { method: 'DELETE' });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to delete FCX event.', 'error');
        return;
      }

      notify(`Removed ${tournament.name}.`, 'success');
      await loadEvents();
    } catch {
      notify('Failed to delete FCX event.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const activeCount = events.filter(t => t.status === 'active').length;

  return (
    <AdminLayout>
      <PageTitle
        title="FCX"
        subtitle={`${events.length} event${events.length !== 1 ? 's' : ''} · ${activeCount} active · Tournament Center`}
        action={
          !editing && (
            <Button onClick={() => { setEditing(newFcxEvent()); setIsNew(true); }} disabled={isSaving}>
              <Plus className="size-4 mr-2" />Add Event
            </Button>
          )
        }
      />

      <InfoBanner className="mb-6">
        Tournament Center on the homepage highlights the active FCX event with bracket, countdown, and standings. Set status to &quot;Active&quot; for homepage prominence.
      </InfoBanner>

      {editing ? (
        <Card>
          <CardHeader><h2 className="text-sm font-semibold text-foreground">{isNew ? 'New FCX Event' : `Editing: ${editing.name}`}</h2></CardHeader>
          <CardBody>
            <TournamentForm
              tournament={editing}
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
              <p className="px-4 py-8 text-sm text-muted-foreground">Loading FCX events…</p>
            ) : events.length === 0 ? (
              <EmptyState message="No FCX events yet. Add one above." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Game</TableHead>
                    <TableHead>Prize Pool</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>Teams</TableHead>
                    <TableHead className="w-[120px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-1.5 py-0.5 rounded capitalize ${STATUS_STYLES[t.status]}`}>
                          {t.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{t.game}</TableCell>
                      <TableCell>{formatPrizePool(t.prizePool) || '—'}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(t.startDate)}</TableCell>
                      <TableCell>{t.participants.length}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setEditing(t); setIsNew(false); }}
                            aria-label={`Edit ${t.name}`}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <DeleteConfirmDialog
                            title="Delete FCX event?"
                            description={`${t.name} will be permanently removed from the Tournament Center.`}
                            onConfirm={() => handleDelete(t)}
                            disabled={isSaving}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isSaving}
                              aria-label={`Delete ${t.name}`}
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
