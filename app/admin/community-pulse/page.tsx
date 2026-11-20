'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import { AdminLayout } from '../admin-layout';
import { PageTitle, Card, CardHeader, CardBody, Toast, Field, FieldRow, InfoBanner } from '../admin-ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DEFAULT_COMMUNITY_PULSE } from '@/lib/constants';
import type { CommunityPulseContent, CommunityStat } from '@/lib/types';

const EMPTY_FORM: CommunityPulseContent = DEFAULT_COMMUNITY_PULSE;

export default function CommunityPulseAdminPage() {
  const [form, setForm] = useState<CommunityPulseContent>(EMPTY_FORM);
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

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/community-pulse', { cache: 'no-store' });
      const data = (await response.json()) as { communityPulse?: CommunityPulseContent; error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to load community pulse.', 'error');
        return;
      }

      if (data.communityPulse) setForm(data.communityPulse);
    } catch {
      notify('Failed to load community pulse.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  const updateStat = (index: number, patch: Partial<CommunityStat>) => {
    setForm((current) => ({
      ...current,
      stats: current.stats.map((stat, i) => (i === index ? { ...stat, ...patch } : stat)),
    }));
  };

  const addStat = () => {
    setForm((current) => ({
      ...current,
      stats: [...current.stats, { label: 'New stat', value: 0 }],
    }));
  };

  const removeStat = (index: number) => {
    setForm((current) => ({
      ...current,
      stats: current.stats.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (form.stats.length < 1) {
      notify('Add at least one stat.', 'error');
      return;
    }
    if (!form.ctaHref.trim().startsWith('/')) {
      notify('CTA link must be a path starting with /.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/community-pulse', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { communityPulse?: CommunityPulseContent; error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to save community pulse.', 'error');
        return;
      }

      if (data.communityPulse) setForm(data.communityPulse);
      notify('Community Pulse saved. Homepage is updated.', 'success');
    } catch {
      notify('Failed to save community pulse.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/community-pulse/reset', { method: 'POST' });
      const data = (await response.json()) as { communityPulse?: CommunityPulseContent; error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to reset community pulse.', 'error');
        return;
      }

      if (data.communityPulse) setForm(data.communityPulse);
      notify('Community Pulse reset to defaults.', 'success');
    } catch {
      notify('Failed to reset community pulse.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const feedText = form.feed.join('\n');

  const setFeedFromText = (text: string) => {
    const feed = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    setForm((current) => ({ ...current, feed }));
  };

  return (
    <AdminLayout>
      <PageTitle
        title="Community Pulse"
        subtitle="Homepage stats, headline, ticker, and CTA"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} disabled={isLoading || isSaving}>
              <RotateCcw className="size-3 mr-1" />Reset
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isLoading || isSaving}>
              <Save className="size-3 mr-1" />
              {isSaving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        }
      />

      <InfoBanner className="mb-6">
        This is the “Inside The Network” section on the homepage — player counts, background ticker lines, and the Join button.
      </InfoBanner>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-foreground">Section header</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <Field label="Eyebrow">
                <Input
                  value={form.eyebrow}
                  onChange={(e) => setForm((c) => ({ ...c, eyebrow: e.target.value }))}
                  placeholder="Community Pulse"
                />
              </Field>
              <FieldRow>
                <Field label="Title line 1">
                  <Input
                    value={form.titleLines[0] ?? ''}
                    onChange={(e) =>
                      setForm((c) => ({
                        ...c,
                        titleLines: [e.target.value, c.titleLines[1] ?? ''],
                      }))
                    }
                    placeholder="Inside The"
                  />
                </Field>
                <Field label="Title line 2">
                  <Input
                    value={form.titleLines[1] ?? ''}
                    onChange={(e) =>
                      setForm((c) => ({
                        ...c,
                        titleLines: [c.titleLines[0] ?? '', e.target.value],
                      }))
                    }
                    placeholder="Network"
                  />
                </Field>
              </FieldRow>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-foreground">Stats</h2>
                <Button type="button" variant="outline" size="sm" onClick={addStat}>
                  <Plus className="size-3 mr-1" />Add stat
                </Button>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {form.stats.map((stat, index) => (
                <div key={index} className="rounded-lg border border-border p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Stat {index + 1}</p>
                    {form.stats.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeStat(index)}
                      >
                        <Trash2 className="size-3 mr-1" />Remove
                      </Button>
                    )}
                  </div>
                  <FieldRow>
                    <Field label="Label" required>
                      <Input
                        value={stat.label}
                        onChange={(e) => updateStat(index, { label: e.target.value })}
                        placeholder="Players Registered"
                      />
                    </Field>
                    <Field label="Value" required>
                      <Input
                        type="number"
                        min={0}
                        value={stat.value}
                        onChange={(e) => updateStat(index, { value: Number(e.target.value) || 0 })}
                      />
                    </Field>
                    <Field label="Suffix (optional)">
                      <Input
                        value={stat.suffix ?? ''}
                        onChange={(e) => updateStat(index, { suffix: e.target.value || undefined })}
                        placeholder="M+"
                      />
                    </Field>
                  </FieldRow>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-foreground">Background ticker</h2>
            </CardHeader>
            <CardBody>
              <Field label="One line per row (scrolling feed behind the stats)">
                <Textarea
                  value={feedText}
                  onChange={(e) => setFeedFromText(e.target.value)}
                  rows={8}
                  placeholder="PVL Raze advanced to FCX Quarters"
                  className="font-mono text-xs"
                />
              </Field>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-foreground">Call to action</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <FieldRow>
                <Field label="Button label" required>
                  <Input
                    value={form.ctaLabel}
                    onChange={(e) => setForm((c) => ({ ...c, ctaLabel: e.target.value }))}
                    placeholder="Join The Network"
                  />
                </Field>
                <Field label="Link (site path)" required>
                  <Input
                    value={form.ctaHref}
                    onChange={(e) => setForm((c) => ({ ...c, ctaHref: e.target.value }))}
                    placeholder="/about"
                  />
                </Field>
              </FieldRow>
            </CardBody>
          </Card>
        </div>
      )}

      <Toast message={toast.message} kind={toast.kind} />
    </AdminLayout>
  );
}