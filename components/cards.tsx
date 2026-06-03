import Link from 'next/link';
import type { Division, Tournament, NewsArticle, Streamer } from '@/lib/types';
import { Dot } from 'lucide-react';
import { cn, formatPrizePool } from '@/lib/utils';

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
  'absolute top-4 right-4 max-w-[calc(100%-2rem)] truncate rounded-full px-2.5 py-1 text-xs font-semibold';

type MobileStatRow = {
  label: string;
  value: string;
  primary?: boolean;
};

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
  rows: MobileStatRow[];
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

export function DivisionCard({ division, variant = 'desktop' }: { division: Division; variant?: CardVariant }) {
  const coverImage =
    division.media.find((item) => item.type === 'image')?.url ??
    'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=1200&h=700&fit=crop';
  const encodedCoverImage = encodeURI(coverImage);

  const mobile = (
    <MobileCardContent
      imageUrl={encodedCoverImage}
      badge={
        <div className={cn(mobileBadgeClass, 'rounded-md bg-primary text-primary-foreground')}>{division.icon}</div>
      }
      title={division.name}
      subtitle={division.game}
      rows={[
        { label: 'Teams', value: String(division.teams) },
        { label: 'Players', value: String(division.players) },
      ]}
    />
  );

  const desktop = (
    <>
      <div
        className="relative h-44 overflow-hidden bg-cover bg-center md:group-hover:scale-105 transition-transform duration-300"
        style={{ backgroundImage: `url("${encodedCoverImage}")` }}
      >
        <div className="absolute inset-0 bg-black/45 md:group-hover:bg-black/30 transition-colors" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-xs uppercase tracking-wide text-primary-foreground/80 mb-1">{division.game}</p>
          <h3 className="text-xl font-bold text-white md:group-hover:text-primary transition-colors line-clamp-1">
            {division.name}
          </h3>
        </div>
        <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-semibold bg-primary text-primary-foreground">
          {division.icon}
        </div>
      </div>
      <div className="p-4">
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{division.tagline}</p>
        <div className="flex justify-between text-sm text-muted-foreground border-t border-border pt-4">
          <div>
            <p className="font-semibold text-foreground">{division.teams}</p>
            <p className="text-xs">Teams</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">{division.players}</p>
            <p className="text-xs">Players</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Link href={`/divisions/${division.id}`} className="block h-full min-w-0 w-full">
      <div className={cardShellClass}>{variant === 'mobile' ? mobile : desktop}</div>
    </Link>
  );
}

export function TournamentCard({ tournament, variant = 'desktop' }: { tournament: Tournament; variant?: CardVariant }) {
  const getStatusColor = (status: Tournament['status']) => {
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
  };

  const encodedTournamentImage = encodeURI(tournament.image);

  const mobile = (
    <MobileCardContent
      imageUrl={encodedTournamentImage}
      badge={
        <div className={cn(mobileBadgeClass, 'capitalize', getStatusColor(tournament.status))}>
          {tournament.status}
        </div>
      }
      title={tournament.name}
      subtitle={tournament.game}
      rows={[
        { label: 'Prize Pool', value: formatPrizePool(tournament.prizePool), primary: true },
        { label: 'Participants', value: String(tournament.participants.length) },
      ]}
    />
  );

  const desktop = (
    <>
      <div
        className="relative h-40 overflow-hidden bg-cover bg-center md:group-hover:scale-105 transition-transform duration-300"
        style={{ backgroundImage: `url("${encodedTournamentImage}")` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div
          className={cn(
            'absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold capitalize',
            getStatusColor(tournament.status),
          )}
        >
          {tournament.status}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 md:group-hover:text-primary transition-colors">
          {tournament.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{tournament.game}</p>
        <div className="space-y-2 border-t border-border pt-4">
          <div className={mobileRowClass}>
            <span className="text-muted-foreground">Prize Pool</span>
            <span className="font-semibold text-primary truncate max-w-[58%]">{formatPrizePool(tournament.prizePool)}</span>
          </div>
          <div className={mobileRowClass}>
            <span className="text-muted-foreground">Participants</span>
            <span className="font-semibold text-foreground">{tournament.participants.length}</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Link href={`/tournaments/${tournament.id}`} className="block h-full min-w-0 w-full">
      <div className={cardShellClass}>{variant === 'mobile' ? mobile : desktop}</div>
    </Link>
  );
}

export function NewsCard({ article, variant = 'desktop' }: { article: NewsArticle; variant?: CardVariant }) {
  const publishedDate = NEWS_DATE_FORMATTER.format(new Date(article.date));
  const encodedArticleImage = encodeURI(article.image);

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
      rows={[
        { label: 'Author', value: article.author },
        { label: 'Published', value: publishedDate },
      ]}
    />
  );

  const desktop = (
    <div className="flex h-full flex-col">
      <div
        className="relative h-40 overflow-hidden bg-cover bg-center md:group-hover:scale-105 transition-transform duration-300"
        style={{ backgroundImage: `url("${encodedArticleImage}")` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-4 left-4 px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-semibold">
          {article.category}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold text-foreground mb-2 md:group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">{article.excerpt}</p>
        <div className="flex justify-between gap-2 text-xs text-muted-foreground border-t border-border pt-4 min-w-0">
          <span className="truncate">{article.author}</span>
          <span className="shrink-0">{publishedDate}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Link href={`/news/${article.id}`} className="block h-full min-w-0 w-full">
      <div className={cardShellClass}>{variant === 'mobile' ? mobile : desktop}</div>
    </Link>
  );
}

export function StreamerCard({ streamer }: { streamer: Streamer }) {
  return (
    <a href={streamer.liveUrl} target="_blank" rel="noopener noreferrer" className="block h-auto min-w-0 w-full md:h-full">
      <div className={cn(cardShellClass, 'flex flex-col items-center p-4 text-center md:h-full')}>
        <div className="relative mb-4">
          <img
            src={streamer.avatar}
            alt={streamer.name}
            className="w-16 h-16 rounded-full border-2 border-primary object-cover md:group-hover:border-primary/80 transition-colors"
          />
          {streamer.status === 'live' && (
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full border-2 border-background animate-pulse" />
          )}
        </div>
        <h3 className="font-bold text-foreground mb-1 line-clamp-1 md:group-hover:text-primary transition-colors">
          {streamer.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{streamer.game}</p>
        <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{(streamer.followers / 1000).toFixed(0)}K</span>
          <span>followers</span>
        </div>
        <div className="mt-4 flex w-full items-center justify-center border-t border-border pt-4">
          <div className="flex items-center space-x-1 text-primary">
            <Dot className="w-3 h-3 fill-primary" />
            <span className="text-xs font-semibold capitalize">{streamer.status}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
