'use client';

import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { AdminLayout } from '../admin-layout';
import { PageTitle, Card, CardHeader, CardBody, Toast, Field, ImagePreview, InfoBanner, SocialLinksEditor } from '../admin-ui';
import { BRAND_LOGO } from '@/lib/constants';
import { useAdminContent } from '../use-admin-content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { SiteContent } from '@/lib/site-content';
import type { SocialLink } from '@/lib/types';

function useSyncedForm(content: SiteContent | null) {
  const [socials, setSocials] = useState<SocialLink[]>([]);

  useEffect(() => {
    if (content) {
      setSocials(content.brandSocials);
    }
  }, [content]);

  return { socials, setSocials };
}

export default function SettingsAdminPage() {
  const { content, isLoading, isSaving, toast, save, resetToDefaults } = useAdminContent();
  const { socials, setSocials } = useSyncedForm(content);

  const handleSave = async () => {
    if (!content) return;
    await save({ ...content, brandSocials: socials });
  };

  return (
    <AdminLayout>
      <PageTitle
        title="Settings"
        subtitle="Global site configuration"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetToDefaults} disabled={isLoading || isSaving}>
              <RotateCcw className="size-4 mr-2" />Reset to Defaults
            </Button>
            <Button onClick={handleSave} disabled={isLoading || isSaving}>
              {isSaving ? 'Saving…' : 'Save Settings'}
            </Button>
          </div>
        }
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
                <li><strong>Tournament Center</strong> — active tournament with bracket and countdown</li>
                <li><strong>Streamer Wall</strong> — 3D monitor cards linking to live streams</li>
                <li><strong>Dispatch</strong> — latest 4 news articles as field reports</li>
                <li><strong>Sponsor Wall</strong> — scrolling partner marquee (Admin → Sponsors)</li>
                <li>Hero, Featured Match, and Community Pulse are hardcoded — not editable here</li>
              </ul>
            </InfoBanner>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-foreground">Brand Social Links</h2>
          </CardHeader>
          <CardBody>
            <p className="text-xs text-muted-foreground mb-4">These appear in the site footer.</p>
            <SocialLinksEditor links={socials} onChange={setSocials} />
          </CardBody>
        </Card>

        {content && (
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-foreground">Content Summary</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Divisions', value: content.divisions.length },
                  { label: 'Tournaments', value: content.tournaments.length },
                  { label: 'Streamers', value: content.streamers.length },
                  { label: 'News Articles', value: content.newsArticles.length },
                  { label: 'Sponsors', value: content.sponsors.length },
                  { label: 'Social Links', value: socials.length },
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

      <Toast message={toast.message} kind={toast.kind} />
    </AdminLayout>
  );
}
