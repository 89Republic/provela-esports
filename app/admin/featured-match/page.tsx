'use client';

import { useCallback, useEffect, useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { AdminLayout } from '../admin-layout';
import { PageTitle, Card, CardHeader, CardBody, Toast, Field, FieldRow, InfoBanner } from '../admin-ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { FeaturedMatch } from '@/lib/types';

const EMPTY_MATCH: FeaturedMatch = {
  teamA: '',
  teamB: '',
  division: '',
  when: '',
  streamUrl: '',
  enabled: true,
};

export default function FeaturedMatchAdminPage() {
  const [form, setForm] = useState<FeaturedMatch>(EMPTY_MATCH);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind: 'success' | 'error' | 'idle' }>({
    message: '',
    kind: 'idle',
  });

  const notify = useCallback((message: string, kind: 'success' | 'error') => {
    setToast({ message, kind });
    window.setTimeout(() => setToast({ message: '', kind: 'idle' }), 3500);
  }, []);

  const set = <K extends keyof FeaturedMatch>(key: K, value: FeaturedMatch[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleToggle = async (enabled: boolean) => {
    const previous = form;
    setForm((current) => ({ ...current, enabled }));
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/featured-match', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      const data = (await response.json()) as { featuredMatch?: FeaturedMatch; error?: string };

      if (!response.ok) {
        setForm(previous);
        notify(data.error ?? 'Failed to update visibility.', 'error');
        return;
      }

      if (data.featuredMatch) setForm(data.featuredMatch);
      notify(enabled ? 'Featured match is now live on the homepage.' : 'Featured match hidden from the homepage.', 'success');
    } catch {
      setForm(previous);
      notify('Failed to update visibility.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const loadMatch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/featured-match', { cache: 'no-store' });
      const data = (await response.json()) as { featuredMatch?: FeaturedMatch; error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to load featured match.', 'error');
        return;
      }

      if (data.featuredMatch) setForm(data.featuredMatch);
    } catch {
      notify('Failed to load featured match.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void loadMatch();
  }, [loadMatch]);

  const handleSave = async () => {
    if (!form.teamA.trim() || !form.teamB.trim() || !form.division.trim() || !form.when.trim() || !form.streamUrl.trim()) {
      notify('Fill in both teams, division, when, and stream URL before saving.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/featured-match', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { featuredMatch?: FeaturedMatch; error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to save featured match.', 'error');
        return;
      }

      if (data.featuredMatch) setForm(data.featuredMatch);
      notify('Featured match saved. Homepage is updated.', 'success');
    } catch {
      notify('Failed to save featured match.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/featured-match/reset', { method: 'POST' });
      const data = (await response.json()) as { featuredMatch?: FeaturedMatch; error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to reset featured match.', 'error');
        return;
      }

      if (data.featuredMatch) setForm(data.featuredMatch);
      notify('Featured match reset to defaults.', 'success');
    } catch {
      notify('Failed to reset featured match.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const canSave = Boolean(
    form.teamA.trim()
    && form.teamB.trim()
    && form.division.trim()
    && form.when.trim()
    && form.streamUrl.trim(),
  );

  return (
    <AdminLayout>
      <PageTitle
        title="Featured Match"
        subtitle="Homepage faceoff between two teams"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} disabled={isLoading || isSaving}>
              <RotateCcw className="size-3 mr-1" />Reset
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isLoading || isSaving || !canSave}>
              <Save className="size-3 mr-1" />
              {isSaving ? 'Saving…' : 'Save Match'}
            </Button>
          </div>
        }
      />

      <InfoBanner className="mb-6">
        This is the single upcoming match shown on the homepage Featured Match scene. Turn it off when there is no match to promote.
      </InfoBanner>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-foreground">Visibility</h2>
            </CardHeader>
            <CardBody>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Show on homepage</p>
                  <p className="text-xs text-muted-foreground">
                    {form.enabled
                      ? 'The Featured Match scene is live on the homepage.'
                      : 'Hidden until you turn this back on.'}
                    {' '}This switch saves immediately.
                  </p>
                </div>
                <Switch
                  checked={form.enabled}
                  onCheckedChange={(enabled) => { void handleToggle(enabled); }}
                  disabled={isSaving}
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-foreground">Match details</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <FieldRow>
                <Field label="Team A" required>
                  <Input
                    value={form.teamA}
                    onChange={(e) => set('teamA', e.target.value)}
                    placeholder="Shokunin"
                  />
                </Field>
                <Field label="Team B" required>
                  <Input
                    value={form.teamB}
                    onChange={(e) => set('teamB', e.target.value)}
                    placeholder="Vanguard"
                  />
                </Field>
              </FieldRow>
              <FieldRow>
                <Field label="Division / event" required>
                  <Input
                    value={form.division}
                    onChange={(e) => set('division', e.target.value)}
                    placeholder="CODM · FCX Open Qualifier"
                  />
                </Field>
                <Field label="When" required>
                  <Input
                    value={form.when}
                    onChange={(e) => set('when', e.target.value)}
                    placeholder="Tonight · 20:00 GMT"
                  />
                </Field>
              </FieldRow>
              <Field label="Watch live URL" required>
                <Input
                  value={form.streamUrl}
                  onChange={(e) => set('streamUrl', e.target.value)}
                  placeholder="https://youtube.com/@provelaesports/live"
                />
              </Field>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-foreground">Preview</h2>
            </CardHeader>
            <CardBody>
              <div className="rounded-lg border border-border bg-muted/30 px-4 py-6 text-center">
                <p className="mb-4 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
                  Featured Match
                </p>
                <p className="font-semibold uppercase tracking-tight text-foreground">
                  {form.teamA || 'Team A'} <span className="text-primary">VS</span> {form.teamB || 'Team B'}
                </p>
                <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
                  {form.division || 'Division / event'}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {form.when || 'When'}
                </p>
                {!form.enabled && (
                  <p className="mt-4 text-xs font-medium text-amber-500">Currently hidden on the homepage</p>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      <Toast message={toast.message} kind={toast.kind} />
    </AdminLayout>
  );
}
