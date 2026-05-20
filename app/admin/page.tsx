'use client';

import Link from 'next/link';
import { Swords, Trophy, Radio, Newspaper, Handshake, ExternalLink, RefreshCw } from 'lucide-react';
import { AdminLayout } from './admin-layout';
import { StatCard, Card, CardHeader, CardBody, PageTitle, Toast, InfoBanner } from './admin-ui';
import { useAdminContent } from './use-admin-content';
import { Button } from '@/components/ui/button';

const QUICK_LINKS = [
  { href: '/admin/divisions', label: 'Manage Divisions', icon: Swords, desc: 'Edit rosters, achievements and match schedule' },
  { href: '/admin/tournaments', label: 'Manage Tournaments', icon: Trophy, desc: 'Create, update and close tournaments' },
  { href: '/admin/streamers', label: 'Manage Streamers', icon: Radio, desc: 'Update streamer profiles and status' },
  { href: '/admin/news', label: 'Manage News', icon: Newspaper, desc: 'Publish and edit news articles' },
  { href: '/admin/sponsors', label: 'Manage Sponsors', icon: Handshake, desc: 'Edit homepage partner marquee logos' },
];

export default function AdminDashboard() {
  const { content, isLoading, toast, reload } = useAdminContent();

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
        Homepage uses swipeable carousels on mobile for divisions, streamers, tournaments, and news. Desktop shows featured divisions in a grid; all divisions are swipeable on mobile.
      </InfoBanner>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 mb-8">
        <StatCard label="Divisions" value={content?.divisions.length ?? '—'} sub={content ? `${content.divisions.filter((d) => d.featured).length} featured` : undefined} color="violet" />
        <StatCard label="Tournaments" value={content?.tournaments.length ?? '—'} color="sky" />
        <StatCard label="Streamers" value={content?.streamers.length ?? '—'} color="emerald" />
        <StatCard label="News Articles" value={content?.newsArticles.length ?? '—'} color="amber" />
        <StatCard label="Sponsors" value={content?.sponsors.length ?? '—'} color="rose" />
        <StatCard label="Social Links" value={content?.brandSocials.length ?? '—'} color="cyan" />
        <StatCard label="Contact Topics" value={content?.contactTopics.length ?? '—'} color="violet" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        {QUICK_LINKS.map(({ href, label, icon: Icon, desc }) => (
          <Link key={href} href={href}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardBody className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Icon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-foreground">Recent News</h2>
          <Link href="/admin/news" className="text-xs text-primary hover:underline">View all</Link>
        </CardHeader>
        <CardBody className="p-0">
          {!content && <div className="py-8 text-center text-sm text-muted-foreground">Loading…</div>}
          {content?.newsArticles.slice(0, 5).map((a, i) => (
            <div key={a.id} className={`flex items-center justify-between gap-4 px-5 py-3 ${i < 4 ? 'border-b border-border' : ''}`}>
              <div>
                <p className="text-sm font-medium text-foreground line-clamp-1">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.category} · {a.date}</p>
              </div>
              <a href={`/news/${a.id}`} target="_blank" rel="noopener noreferrer" className="shrink-0 text-muted-foreground hover:text-primary transition-colors">
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
