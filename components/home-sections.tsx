'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container, SectionHeader, GridSection } from '@/components/layout';
import { DivisionCard, TournamentCard, NewsCard, StreamerCard } from '@/components/cards';
import type { Division, Tournament, NewsArticle, Streamer } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  const heroImage = '/images/hero.png';

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-b from-background via-card to-background pt-16">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.25),rgba(2,6,23,0.86)_45%,rgba(2,6,23,0.96))]" />
        <div className="absolute inset-0 opacity-25 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-size-[34px_34px]" />
      </div>

      <Container className="relative text-center py-20">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-14">
          <div className="inline-block mb-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/20 border border-primary/40 rounded-full max-w-full">
            <span className="text-primary text-xs sm:text-sm font-semibold uppercase tracking-widest break-words" style={{ fontFamily: 'var(--font-gaming)' }}>Welcome to Provela Esports</span>
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 text-center uppercase leading-tight"
            style={{
              fontFamily: 'var(--font-gaming)',
              letterSpacing: 'clamp(0.05em, 2vw, 0.18em)',
              WebkitTextStroke: '1px rgba(255,255,255,0.15)',
            }}
          >
            Competitive<br />Gaming at<br />Its Finest
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join the premier esports organization with elite players, world-class tournaments, and non-stop entertainment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/divisions">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Explore Divisions <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/tournaments">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                View Tournaments
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

export function FeaturedDivisionsSection({ divisions }: { divisions: Division[] }) {
  const featured = divisions.filter((d) => d.featured).slice(0, 4);

  return (
    <div className="py-20 bg-background">
      <Container>
        <SectionHeader
          subtitle="Featured"
          title="Our Divisions"
          description="Explore our competitive divisions across multiple games with the world&apos;s best players."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {featured.map((division) => (
            <DivisionCard key={division.id} division={division} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/divisions">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
              View All Divisions <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}

export function UpcomingTournamentsSection({ tournaments }: { tournaments: Tournament[] }) {
  const upcomingAndActive = tournaments.filter((t) => t.status === 'upcoming' || t.status === 'active').slice(0, 4);

  return (
    <div className="py-20 bg-card">
      <Container>
        <SectionHeader
          subtitle="Competitions"
          title="Tournaments"
          description="Check out the latest tournaments with massive prize pools and intense competition."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {upcomingAndActive.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/tournaments">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
              View All Tournaments <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}

export function LatestNewsSection({ articles }: { articles: NewsArticle[] }) {
  const latest = articles.slice(0, 4);

  return (
    <div className="py-20 bg-background">
      <Container>
        <SectionHeader
          subtitle="Updates"
          title="Latest News"
          description="Stay updated with the latest news, announcements, and stories from the Provela community."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {latest.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/news">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Read More News <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}

export function StreamersSection({ streamers }: { streamers: Streamer[] }) {
  return (
    <div className="py-20 bg-card">
      <Container>
        <SectionHeader
          subtitle="Live Streams"
          title="Featured Streamers"
          description="Follow our professional streamers and watch the best esports content live."
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {streamers.map((streamer) => (
            <StreamerCard key={streamer.id} streamer={streamer} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/streamers">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
              View All Streamers <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}

export function CTASection() {
  return (
    <div className="py-20 bg-linear-to-r from-primary/10 to-primary/5 border-y border-primary/20">
      <Container className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Join the Action?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Whether you&apos;re a player, fan, or aspiring esports professional, there&apos;s a place for you at Provela.
        </p>
        <Link href="/contact">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Get Started <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </Container>
    </div>
  );
}
