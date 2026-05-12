'use client';

import { useCallback, useEffect, useState } from 'react';
import type { SiteContent } from '@/lib/site-content';

export type { SiteContent };

export interface UseAdminContentResult {
  content: SiteContent | null;
  isLoading: boolean;
  isSaving: boolean;
  toast: { message: string; kind: 'success' | 'error' | 'idle' };
  save: (next: SiteContent) => Promise<void>;
  reload: () => void;
  resetToDefaults: () => Promise<void>;
}

export function useAdminContent(): UseAdminContentResult {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind: 'success' | 'error' | 'idle' }>({
    message: '',
    kind: 'idle',
  });

  const notify = useCallback((message: string, kind: 'success' | 'error') => {
    setToast({ message, kind });
    setTimeout(() => setToast({ message: '', kind: 'idle' }), 3500);
  }, []);

  const load = useCallback(async (source?: 'default') => {
    setIsLoading(true);
    try {
      const url = source === 'default' ? '/api/admin/content?source=default' : '/api/admin/content';
      const res = await fetch(url, { cache: 'no-store' });
      const payload = (await res.json()) as { data: SiteContent };
      setContent(payload.data);
    } catch {
      notify('Failed to load content.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  const reload = useCallback(() => { void load(); }, [load]);

  const resetToDefaults = useCallback(async () => {
    await load('default');
    notify('Defaults loaded — save to apply site-wide.', 'success');
  }, [load, notify]);

  const save = useCallback(async (next: SiteContent) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: next }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? 'Save failed.');
      }
      setContent(next);
      notify('Changes saved successfully.', 'success');
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Save failed.', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [notify]);

  useEffect(() => { void load(); }, [load]);

  return { content, isLoading, isSaving, toast, save, reload, resetToDefaults };
}
