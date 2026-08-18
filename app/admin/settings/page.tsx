'use client';

import { useCallback, useEffect, useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { AdminLayout } from '../admin-layout';
import { AdminUsersSection } from '../admin-users-section';
import { PageTitle, Card, CardHeader, CardBody, Toast, Field, ImagePreview, InfoBanner, SocialLinksEditor } from '../admin-ui';
import { BRAND_LOGO } from '@/lib/constants';
import { useAdminContent } from '../use-admin-content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { SocialLink } from '@/lib/types';

export default function SettingsAdminPage() {
  const { content, isLoading: isContentLoading } = useAdminContent();
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [isLoadingSocials, setIsLoadingSocials] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind: 'success' | 'error' | 'idle' }>({
    message: '',
    kind: 'idle',
  });
  const [currentUserId, setCurrentUserId] = useState<string>();
  const [userToast, setUserToast] = useState<{ message: string; kind: 'success' | 'error' | 'idle' }>({
    message: '',
    kind: 'idle',
  });

  const notify = useCallback((message: string, kind: 'success' | 'error') => {
    setToast({ message, kind });
    window.setTimeout(() => setToast({ message: '', kind: 'idle' }), 3500);
  }, []);

  const loadSocials = useCallback(async () => {
    setIsLoadingSocials(true);
    try {
      const response = await fetch('/api/admin/brand-socials', { cache: 'no-store' });
      const data = (await response.json()) as { brandSocials?: SocialLink[]; error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to load brand social links.', 'error');
        return;
      }

      setSocials(data.brandSocials ?? []);
    } catch {
      notify('Failed to load brand social links.', 'error');
    } finally {
      setIsLoadingSocials(false);
    }
  }, [notify]);

  useEffect(() => {
    void loadSocials();
  }, [loadSocials]);

  useEffect(() => {
    fetch('/api/admin/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user?._id) setCurrentUserId(data.user._id);
      })
      .catch(() => undefined);
  }, []);

  const handleSave = async () => {
    const hasEmptyUrl = socials.some((link) => !link.url.trim());
    if (hasEmptyUrl) {
      notify('Add a URL for each link, or remove empty rows before saving.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/brand-socials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandSocials: socials }),
      });

      const data = (await response.json()) as { brandSocials?: SocialLink[]; error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to save brand social links.', 'error');
        return;
      }

      setSocials(data.brandSocials ?? []);
      notify('Brand social links saved.', 'success');
      await loadSocials();
    } catch {
      notify('Failed to save brand social links.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async (index: number, link: SocialLink) => {
    if (!link.url.trim()) {
      setSocials((current) => current.filter((_, i) => i !== index));
      return;
    }

    setIsSaving(true);
    try {
      const params = new URLSearchParams({ platform: link.platform, url: link.url });
      const response = await fetch(`/api/admin/brand-socials?${params.toString()}`, {
        method: 'DELETE',
      });
      const data = (await response.json()) as { brandSocials?: SocialLink[]; error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to delete social link.', 'error');
        return;
      }

      setSocials(data.brandSocials ?? []);
      notify('Social link deleted.', 'success');
    } catch {
      notify('Failed to delete social link.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/brand-socials/reset', { method: 'POST' });
      const data = (await response.json()) as { brandSocials?: SocialLink[]; error?: string };

      if (!response.ok) {
        notify(data.error ?? 'Failed to reset brand social links.', 'error');
        return;
      }

      setSocials(data.brandSocials ?? []);
      notify('Brand social links reset to defaults.', 'success');
      await loadSocials();
    } catch {
      notify('Failed to reset brand social links.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const showUserNotice = (message: string, kind: 'success' | 'error') => {
    setUserToast({ message, kind });
    window.setTimeout(() => setUserToast({ message: '', kind: 'idle' }), 3000);
  };

  const isLoading = isContentLoading || isLoadingSocials;

  return (
    <AdminLayout>
      <PageTitle
        title="Settings"
        subtitle="Global site configuration"
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-foreground">Brand Assets</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Field label="Site logo (navbar, footer, favicon)">
              <Input value={BRAND_LOGO} disabled className="opacity-70 font-mono text-xs" />
              <ImagePreview src={BRAND_LOGO} alt="Provela logo" contain />
            </Field>
            <p className="text-xs text-muted-foreground">
              Logo file: <code className="bg-muted px-1 py-0.5 rounded">public{BRAND_LOGO}</code>. Replace that file to update the logo site-wide. Squad photos default to this logo in division rosters.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-foreground">Homepage Layout</h2>
          </CardHeader>
          <CardBody>
            <InfoBanner>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li><strong>Divisions Scene</strong> — all divisions in a monogram tile grid</li>
                <li><strong>Tournament Center</strong> — active FCX event with bracket and countdown</li>
                <li><strong>Streamer Wall</strong> — 3D monitor cards linking to streamer profiles</li>
                <li><strong>Dispatch</strong> — latest 4 news articles as field reports</li>
                <li><strong>Sponsor Wall</strong> — scrolling partner marquee (Admin → Sponsors)</li>
                <li><strong>Featured Match</strong> — upcoming homepage faceoff (Admin → Featured Match)</li>
                <li>Hero and Community Pulse are hardcoded — not editable here</li>
              </ul>
            </InfoBanner>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-foreground">Brand Social Links</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleReset} disabled={isLoading || isSaving}>
                  <RotateCcw className="size-3 mr-1" />Reset
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isLoading || isSaving}>
                  <Save className="size-3 mr-1" />
                  {isSaving ? 'Saving…' : 'Save Social Links'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-xs text-muted-foreground mb-4">
              Shown in the site footer. Saved links delete immediately from the site when you click the trash icon.
              New rows still need a URL and <strong>Save Social Links</strong>.
            </p>
            {isLoadingSocials ? (
              <p className="text-sm text-muted-foreground">Loading social links…</p>
            ) : (
              <SocialLinksEditor
                links={socials}
                onChange={setSocials}
                onRemove={handleRemove}
                removeDisabled={isSaving}
              />
            )}
          </CardBody>
        </Card>

        <AdminUsersSection currentUserId={currentUserId} onNotice={showUserNotice} />

        {content && (
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-foreground">Content Summary</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Divisions', value: content.divisions.length },
                  { label: 'FCX', value: content.fcx.length },
                  { label: 'Streamers', value: content.streamers.length },
                  { label: 'News Articles', value: content.newsArticles.length },
                  { label: 'Sponsors', value: content.sponsors.length },
                  { label: 'Social Links', value: socials.length },
                  { label: 'Featured Match', value: content.featuredMatch.enabled ? 'Live' : 'Hidden' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-xl font-bold text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      <Toast message={toast.message || userToast.message} kind={toast.kind !== 'idle' ? toast.kind : userToast.kind} />
    </AdminLayout>
  );
}
