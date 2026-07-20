'use client';

import Link from 'next/link';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { AdminLayout } from './admin-layout';
import { StatCard, Card, CardHeader, CardBody, PageTitle, Toast, InfoBanner } from './admin-ui';
import { useAdminContent } from './use-admin-content';
import { Button } from '@/components/ui/button';

const HOMEPAGE_SCENES = [
  { scene: 'Divisions Scene', source: 'All divisions', admin: '/admin/divisions' },
  { scene: 'Tournament Center', source: 'Active / upcoming FCX events', admin: '/admin/fcx' },
  { scene: 'Streamer Wall', source: 'All streamers', admin: '/admin/streamers' },
  { scene: 'Dispatch', source: 'Latest 4 news articles', admin: '/admin/news' },
  { scene: 'Sponsor Wall', source: 'All sponsors', admin: '/admin/sponsors' },
];

export default function AdminDashboard() {
  const { content, isLoading, toast, reload } = useAdminContent();

  const liveStreamers = content?.streamers.filter(s => s.status === 'live').length ?? 0;
  const activeFcx = content?.fcx.filter(t => t.status === 'active').length ?? 0;

  return (
    <AdminLayout>
      <PageTitle
        title="Dashboard"
        subtitle="Overview of all website content"
        action={
          <Button variant="outline" size="sm" onClick={reload} disabled={isLoading}>
            <RefreshCw className={`size-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />

      <InfoBanner className="mb-6">
        The homepage uses a scene-based broadcast layout — Divisions Scene, Tournament Center, Streamer Wall, Dispatch, and Sponsor Wall. Content you edit here feeds directly into those sections.
      </InfoBanner>

      <div className="mb-6 grid grid-cols-3 gap-2">
        <StatCard label="Divisions" value={content?.divisions.length ?? '—'} sub="shown on homepage & /divisions" color="violet" />
        <StatCard label="FCX" value={content?.fcx.length ?? '—'} sub={content ? `${activeFcx} active` : undefined} color="sky" />
        <StatCard label="Streamers" value={content?.streamers.length ?? '—'} sub={content ? `${liveStreamers} live now` : undefined} color="emerald" />
        <StatCard label="News Articles" value={content?.newsArticles.length ?? '—'} sub="top 4 on Dispatch" color="amber" />
        <StatCard label="Sponsors" value={content?.sponsors.length ?? '—'} color="rose" />
        <StatCard label="Social Links" value={content?.brandSocials.length ?? '—'} sub="footer" color="cyan" />
      </div>

      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-sm font-semibold text-foreground">Homepage Scene Map</h2>
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
            Preview <ExternalLink className="size-3" />
          </a>
        </CardHeader>
        <CardBody className="p-0">
          {HOMEPAGE_SCENES.map((row, i) => (
            <div key={row.scene} className={`flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:px-5 ${i < HOMEPAGE_SCENES.length - 1 ? 'border-b border-border' : ''}`}>
              <p className="text-sm font-medium text-foreground sm:w-44 shrink-0">{row.scene}</p>
              <p className="text-xs text-muted-foreground flex-1">{row.source}</p>
              <Link href={row.admin} className="text-xs text-primary hover:underline shrink-0">Manage →</Link>
            </div>
          ))}
          <div className="border-t border-border bg-muted/30 px-4 py-3 sm:px-5">
            <p className="text-xs text-muted-foreground">
              Hero, Featured Match, and Community Pulse are hardcoded in the codebase — not editable here.
            </p>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-foreground">Recent News</h2>
          <Link href="/admin/news" className="text-xs text-primary hover:underline">View all</Link>
        </CardHeader>
        <CardBody className="p-0">
          {!content && <div className="py-8 text-center text-sm text-muted-foreground">Loading…</div>}
          {content?.newsArticles.slice(0, 5).map((a, i) => (
            <div key={a.id} className={`flex items-start justify-between gap-3 px-4 py-3 sm:items-center sm:gap-4 sm:px-5 ${i < 4 ? 'border-b border-border' : ''}`}>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground line-clamp-2 sm:line-clamp-1">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.category} · {a.date}</p>
              </div>
              <a href={`/news/${a.id}`} target="_blank" rel="noopener noreferrer" className="shrink-0 pt-0.5 text-muted-foreground hover:text-primary transition-colors sm:pt-0">
                <ExternalLink className="size-4" />
              </a>
            </div>
          ))}
        </CardBody>
      </Card>

      <Toast message={toast.message} kind={toast.kind} />
    </AdminLayout>
  );
}
