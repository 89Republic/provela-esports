import Link from 'next/link';
import type { Division, Tournament, NewsArticle, Streamer } from '@/lib/types';
import { cn, formatPrizePool, getDivisionHeroImage } from '@/lib/utils';

const NEWS_DATE_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export type CardVariant = 'mobile' | 'desktop';

const cardShellClass =
  'group h-full bg-card border border-border rounded-lg hover:border-primary transition-all duration-300 ease-out overflow-hidden cursor-pointer will-change-transform max-md:hover:translate-y-0 max-md:hover:scale-100 md:hover:-translate-y-1 md:hover:scale-[1.02] md:hover:shadow-2xl md:hover:shadow-primary/25';

const mobileShellClass = 'flex h-[22.5rem] w-full flex-col';
const mobileImageClass = 'relative h-40 shrink-0 overflow-hidden bg-cover bg-center';
const mobileBodyClass = 'flex min-h-0 flex-1 flex-col overflow-hidden p-4';
const mobileTitleClass =
  'mb-2 line-clamp-2 min-h-[3.25rem] text-lg font-bold leading-snug text-foreground';
const mobileSubtitleClass = 'mb-4 line-clamp-2 min-h-[2.5rem] text-sm leading-snug text-muted-foreground';
const mobileFooterClass = 'mt-auto shrink-0 space-y-2 border-t border-border pt-4';
const mobileRowClass = 'flex min-w-0 items-center justify-between gap-2 text-sm';
const mobileLabelClass = 'shrink-0 text-muted-foreground';
const mobileValueClass = 'max-w-[58%] truncate text-right font-semibold text-foreground';
const mobileValuePrimaryClass = 'max-w-[58%] truncate text-right font-semibold text-primary';
const mobileBadgeClass =
  'absolute top-4 right-4 max-w-[calc(100%-2rem)] truncate rounded-md px-2.5 py-1 text-xs font-semibold';
const desktopBadgeClass =
  'absolute top-3 right-3 max-w-[calc(100%-2rem)] truncate rounded-md px-2 py-1 text-xs font-semibold';

type StatRow = {
  label: string;
  value: string;
  primary?: boolean;
};

function formatFollowers(count: number) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (count >= 1_000) return `${Math.round(count / 1_000)}K`;
  return String(count);
}

function getTournamentStatusColor(status: Tournament['status']) {
  switch (status) {
    case 'active':
      return 'bg-primary/20 text-primary';
    case 'upcoming':
      return 'bg-blue-500/20 text-blue-400';
    case 'past':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function getStreamerStatusColor(status: Streamer['status']) {
  return status === 'live' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground';
}

function MobileCardContent({
  imageUrl,
  badge,
  title,
  subtitle,
  rows,
}: {
  imageUrl: string;
  badge: React.ReactNode;
  title: string;
  subtitle: string;
  rows: StatRow[];
}) {
  return (
    <div className={mobileShellClass}>
      <div className={mobileImageClass} style={{ backgroundImage: `url("${imageUrl}")` }}>
        <div className="absolute inset-0 bg-black/40" />
        {badge}
      </div>
      <div className={mobileBodyClass}>
        <h3 className={mobileTitleClass}>{title}</h3>
        <p className={mobileSubtitleClass}>{subtitle}</p>
        <div className={mobileFooterClass}>
          {rows.map((row) => (
            <div key={row.label} className={mobileRowClass}>
              <span className={mobileLabelClass}>{row.label}</span>
              <span className={row.primary ? mobileValuePrimaryClass : mobileValueClass}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DesktopCardContent({
  imageUrl,
  badge,
  eyebrow,
  title,
  description,
  stats,
}: {
  imageUrl: string;
  badge: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  stats: StatRow[];
}) {
  return (
    <>
      <div
        className="relative h-44 overflow-hidden bg-cover bg-center transition-transform duration-300 md:group-hover:scale-105"
        style={{ backgroundImage: `url("${imageUrl}")` }}
      >
        <div className="absolute inset-0 bg-black/45 transition-colors md:group-hover:bg-black/30" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="mb-1 text-xs uppercase tracking-wide text-primary-foreground/80">{eyebrow}</p>
          <h3 className="line-clamp-1 text-xl font-bold text-white transition-colors md:group-hover:text-primary">
            {title}
          </h3>
        </div>
        {badge}
      </div>
      <div className="p-4">
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{description}</p>
        <div className="flex justify-between gap-2 border-t border-border pt-4 text-sm text-muted-foreground">
          {stats.map((stat) => (
            <div key={stat.label} className="min-w-0">
              <p className={cn('truncate font-semibold', stat.primary ? 'text-primary' : 'text-foreground')}>
                {stat.value}
              </p>
              <p className="text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function DivisionCard({ division, variant = 'desktop' }: { division: Division; variant?: CardVariant }) {
  const encodedCoverImage = encodeURI(getDivisionHeroImage(division));
  const stats = [
    { label: 'Teams', value: String(division.teams) },
    { label: 'Players', value: String(division.players) },
  ];

  const mobile = (
    <MobileCardContent
      imageUrl={encodedCoverImage}
      badge={<div className={cn(mobileBadgeClass, 'bg-primary text-primary-foreground')}>{division.icon}</div>}
      title={division.name}
      subtitle={division.game}
      rows={stats}
    />
  );

  const desktop = (
    <DesktopCardContent
      imageUrl={encodedCoverImage}
      badge={<div className={cn(desktopBadgeClass, 'bg-primary text-primary-foreground')}>{division.icon}</div>}
      eyebrow={division.game}
      title={division.name}
      description={division.tagline}
      stats={stats}
    />
  );

  return (
    <Link href={`/divisions/${division.id}`} className="block h-full min-w-0 w-full">
      <div className={cardShellClass}>{variant === 'mobile' ? mobile : desktop}</div>
    </Link>
  );
}

export function TournamentCard({ tournament, variant = 'desktop' }: { tournament: Tournament; variant?: CardVariant }) {
  const encodedTournamentImage = encodeURI(tournament.image);
  const statusColor = getTournamentStatusColor(tournament.status);
  const stats = [
    { label: 'Prize Pool', value: formatPrizePool(tournament.prizePool), primary: true },
    { label: 'Participants', value: String(tournament.participants.length) },
  ];

  const mobile = (
    <MobileCardContent
      imageUrl={encodedTournamentImage}
      badge={
        <div className={cn(mobileBadgeClass, 'capitalize', statusColor)}>{tournament.status}</div>
      }
      title={tournament.name}
      subtitle={tournament.game}
      rows={stats}
    />
  );

  const desktop = (
    <DesktopCardContent
      imageUrl={encodedTournamentImage}
      badge={<div className={cn(desktopBadgeClass, 'capitalize', statusColor)}>{tournament.status}</div>}
      eyebrow={tournament.game}
      title={tournament.name}
      description={tournament.overview}
      stats={stats}
    />
  );

  return (
    <Link href={`/fcx/${tournament.id}`} className="block h-full min-w-0 w-full">
      <div className={cardShellClass}>{variant === 'mobile' ? mobile : desktop}</div>
    </Link>
  );
}

export function NewsCard({ article, variant = 'desktop' }: { article: NewsArticle; variant?: CardVariant }) {
  const publishedDate = NEWS_DATE_FORMATTER.format(new Date(article.date));
  const encodedArticleImage = encodeURI(article.image);
  const stats = [
    { label: 'Author', value: article.author },
    { label: 'Published', value: publishedDate },
  ];

  const mobile = (
    <MobileCardContent
      imageUrl={encodedArticleImage}
      badge={
        <div className={cn(mobileBadgeClass, 'bg-primary text-primary-foreground capitalize')}>
          {article.category}
        </div>
      }
      title={article.title}
      subtitle={article.excerpt}
      rows={stats}
    />
  );

  const desktop = (
    <DesktopCardContent
      imageUrl={encodedArticleImage}
      badge={
        <div className={cn(desktopBadgeClass, 'bg-primary text-primary-foreground capitalize')}>
          {article.category}
        </div>
      }
      eyebrow={article.category}
      title={article.title}
      description={article.excerpt}
      stats={stats}
    />
  );

  return (
    <Link href={`/news/${article.id}`} className="block h-full min-w-0 w-full">
      <div className={cardShellClass}>{variant === 'mobile' ? mobile : desktop}</div>
    </Link>
  );
}

export function StreamerCard({ streamer, variant = 'desktop' }: { streamer: Streamer; variant?: CardVariant }) {
  const encodedAvatar = encodeURI(streamer.avatar);
  const statusColor = getStreamerStatusColor(streamer.status);
  const stats = [
    { label: 'Followers', value: formatFollowers(streamer.followers), primary: true },
    { label: 'Platform', value: streamer.platform === 'twitch' ? 'Twitch' : 'YouTube' },
  ];

  const mobile = (
    <MobileCardContent
      imageUrl={encodedAvatar}
      badge={<div className={cn(mobileBadgeClass, 'capitalize', statusColor)}>{streamer.status}</div>}
      title={streamer.name}
      subtitle={streamer.game}
      rows={stats}
    />
  );

  const desktop = (
    <DesktopCardContent
      imageUrl={encodedAvatar}
      badge={<div className={cn(desktopBadgeClass, 'capitalize', statusColor)}>{streamer.status}</div>}
      eyebrow={streamer.game}
      title={streamer.name}
      description={streamer.bio}
      stats={stats}
    />
  );

  return (
    <Link href={`/streamers/${streamer.id}`} className="block h-full min-w-0 w-full">
      <div className={cardShellClass}>{variant === 'mobile' ? mobile : desktop}</div>
    </Link>
  );
}
