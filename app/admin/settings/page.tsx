'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, RotateCcw } from 'lucide-react';
import { AdminLayout } from '../admin-layout';
import { PageTitle, Card, CardHeader, CardBody, Toast, Field, FieldRow } from '../admin-ui';
import { useAdminContent } from '../use-admin-content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SiteContent } from '@/lib/site-content';
import type { SocialLink } from '@/lib/types';

const PLATFORMS: SocialLink['platform'][] = ['x', 'instagram', 'youtube', 'twitch', 'tiktok', 'discord'];

function useSyncedForm(content: SiteContent | null) {
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [topics, setTopics] = useState<string[]>([]);

  useEffect(() => {
    if (content) {
      setSocials(content.brandSocials);
      setTopics(content.contactTopics);
    }
  }, [content]);

  return { socials, setSocials, topics, setTopics };
}

export default function SettingsAdminPage() {
  const { content, isLoading, isSaving, toast, save, resetToDefaults } = useAdminContent();
  const { socials, setSocials, topics, setTopics } = useSyncedForm(content);

  const handleSave = async () => {
    if (!content) return;
    await save({ ...content, brandSocials: socials, contactTopics: topics });
  };

  const addSocial = () => setSocials(s => [...s, { platform: 'x', url: '' }]);
  const updateSocial = (i: number, key: keyof SocialLink, val: string) =>
    setSocials(s => s.map((item, idx) => idx === i ? { ...item, [key]: val } : item));
  const removeSocial = (i: number) => setSocials(s => s.filter((_, idx) => idx !== i));

  const addTopic = () => setTopics(t => [...t, '']);
  const updateTopic = (i: number, val: string) => setTopics(t => t.map((x, idx) => idx === i ? val : x));
  const removeTopic = (i: number) => setTopics(t => t.filter((_, idx) => idx !== i));

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
        {/* Social Links */}
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-foreground">Brand Social Links</h2>
            <Button variant="outline" size="sm" onClick={addSocial}><Plus className="size-3 mr-1" />Add Link</Button>
          </CardHeader>
          <CardBody>
            <p className="text-xs text-muted-foreground mb-4">These appear in the site footer and are referenced across the site.</p>
            <div className="space-y-3">
              {socials.map((s, i) => (
                <div key={i} className="grid grid-cols-[180px_1fr_auto] gap-3 items-center">
                  <Select value={s.platform} onValueChange={v => updateSocial(i, 'platform', v)}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input placeholder="https://…" value={s.url} onChange={e => updateSocial(i, 'url', e.target.value)} />
                  <button onClick={() => removeSocial(i)} className="text-muted-foreground hover:text-destructive p-2 transition-colors">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
              {socials.length === 0 && <p className="text-xs text-muted-foreground">No social links configured.</p>}
            </div>
          </CardBody>
        </Card>

        {/* Contact Topics */}
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-foreground">Contact Form Topics</h2>
            <Button variant="outline" size="sm" onClick={addTopic}><Plus className="size-3 mr-1" />Add Topic</Button>
          </CardHeader>
          <CardBody>
            <p className="text-xs text-muted-foreground mb-4">Options shown in the contact page subject selector.</p>
            <div className="space-y-2">
              {topics.map((t, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto] gap-3 items-center">
                  <Input value={t} onChange={e => updateTopic(i, e.target.value)} placeholder="General Enquiry" />
                  <button onClick={() => removeTopic(i)} className="text-muted-foreground hover:text-destructive p-2 transition-colors">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
              {topics.length === 0 && <p className="text-xs text-muted-foreground">No topics configured.</p>}
            </div>
          </CardBody>
        </Card>

        {/* Website Info Panel */}
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-foreground">Site Info</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <FieldRow>
              <Field label="Contact Email">
                <Input defaultValue="contact@provela.gg" disabled className="opacity-60" />
              </Field>
              <Field label="Business Email">
                <Input defaultValue="business@provela.gg" disabled className="opacity-60" />
              </Field>
            </FieldRow>
            <p className="text-xs text-muted-foreground">Contact emails are currently hardcoded in the contact page. Edit <code className="text-xs bg-muted px-1 py-0.5 rounded">app/contact/page.tsx</code> to update them.</p>
          </CardBody>
        </Card>

        {/* Content Stats */}
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
                  { label: 'Social Links', value: socials.length },
                  { label: 'Contact Topics', value: topics.length },
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
