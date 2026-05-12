'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container, SectionHeader, GridSection } from '@/components/layout';
import { DivisionCard, TournamentCard, NewsCard, StreamerCard } from '@/components/cards';
import type { Division, Tournament, NewsArticle, Streamer } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  const heroImage =
    'https://images.unsplash.com/photo-1542751371-29b0f74f9713?w=2000&h=1200&fit=crop';

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
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/20 bg-black/35 px-6 py-10 md:px-10 md:py-14 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-md transform-[perspective(1200px)_rotateX(6deg)]">
          <div className="inline-block mb-4 px-4 py-2 bg-primary/20 border border-primary/40 rounded-full">
            <span className="text-primary text-sm font-semibold">Welcome to Provela Esports</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
            Competitive Gaming at Its Finest
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
  const featured = divisions.filter((d) => d.featured).slice(0, 3);

  return (
    <div className="py-20 bg-background">
      <Container>
        <SectionHeader
          subtitle="Featured"
          title="Our Divisions"
          description="Explore our competitive divisions across multiple games with the world&apos;s best players."
        />
        <GridSection cols={3}>
          {featured.map((division) => (
            <DivisionCard key={division.id} division={division} />
          ))}
        </GridSection>
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
  const upcomingAndActive = tournaments.filter((t) => t.status === 'upcoming' || t.status === 'active').slice(0, 3);

  return (
    <div className="py-20 bg-card">
      <Container>
        <SectionHeader
          subtitle="Competitions"
          title="Tournaments"
          description="Check out the latest tournaments with massive prize pools and intense competition."
        />
        <GridSection cols={3}>
          {upcomingAndActive.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </GridSection>
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
  const latest = articles.slice(0, 3);

  return (
    <div className="py-20 bg-background">
      <Container>
        <SectionHeader
          subtitle="Updates"
          title="Latest News"
          description="Stay updated with the latest news, announcements, and stories from the Provela community."
        />
        <GridSection cols={3}>
          {latest.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </GridSection>
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
        <GridSection cols={4}>
          {streamers.map((streamer) => (
            <StreamerCard key={streamer.id} streamer={streamer} />
          ))}
        </GridSection>
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
