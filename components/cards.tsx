import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Division, Tournament, NewsArticle, Streamer } from '@/lib/types';
import { Dot } from 'lucide-react';

export function DivisionCard({ division }: { division: Division }) {
  return (
    <Link href={`/divisions/${division.id}`}>
      <div className="group h-full bg-card border border-border rounded-lg hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/20 p-6 cursor-pointer">
        <div className="text-4xl mb-4">{division.icon}</div>
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {division.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">{division.description}</p>
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
    </Link>
  );
}

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-primary/20 text-primary';
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <Link href={`/tournaments/${tournament.id}`}>
      <div className="group h-full bg-card border border-border rounded-lg hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/20 overflow-hidden cursor-pointer">
        <div className="relative h-40 overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${tournament.image})` }}>
          <div className="absolute inset-0 bg-black/40" />
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(tournament.status)} capitalize`}>
            {tournament.status}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {tournament.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">{tournament.game}</p>
          <div className="space-y-2 border-t border-border pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Prize Pool</span>
              <span className="font-semibold text-primary">{tournament.prizePool}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Participants</span>
              <span className="font-semibold text-foreground">{tournament.participants}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <Link href={`/news/${article.id}`}>
      <div className="group h-full bg-card border border-border rounded-lg hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/20 overflow-hidden cursor-pointer flex flex-col">
        <div className="relative h-40 overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${article.image})` }}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute top-4 left-4 px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-semibold">
            {article.category}
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">{article.excerpt}</p>
          <div className="flex justify-between text-xs text-muted-foreground border-t border-border pt-4">
            <span>{article.author}</span>
            <span>{new Date(article.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function StreamerCard({ streamer }: { streamer: Streamer }) {
  return (
    <a href={streamer.twitchUrl} target="_blank" rel="noopener noreferrer">
      <div className="group h-full bg-card border border-border rounded-lg hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/20 p-4 cursor-pointer flex flex-col items-center text-center">
        <div className="relative mb-4">
          <img
            src={streamer.avatar}
            alt={streamer.name}
            className="w-16 h-16 rounded-full border-2 border-primary group-hover:border-primary/80 transition-colors"
          />
          {streamer.status === 'live' && (
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full border-2 border-background animate-pulse" />
          )}
        </div>
        <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {streamer.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">{streamer.game}</p>
        <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{(streamer.followers / 1000).toFixed(0)}K</span>
          <span>followers</span>
        </div>
        <div className="mt-4 pt-4 border-t border-border w-full flex items-center justify-center">
          <div className="flex items-center space-x-1 text-primary">
            <Dot className="w-3 h-3 fill-primary" />
            <span className="text-xs font-semibold capitalize">{streamer.status}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
