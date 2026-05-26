'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container, SectionHeader, GridSection } from '@/components/layout';
import { DivisionCard, TournamentCard, NewsCard, StreamerCard } from '@/components/cards';
import type { Division, Tournament, NewsArticle, Sponsor, Streamer } from '@/lib/types';
import { ArrowRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const carouselNavClass =
  'z-10 top-1/2 -translate-y-1/2 size-9 border-primary/30 bg-card text-primary hover:bg-primary/10';

const mobileCarouselItemClass = 'pl-4 basis-1/2 min-w-0 flex';

const homeSectionClass = 'pt-8 pb-6 md:pt-10 md:pb-8';
const homeSectionCtaClass = 'text-center mt-8 px-3 sm:mt-9 md:mt-6 md:px-0';

function MobileCardCarousel({ children }: { children: React.ReactNode }) {
  return (
    <Carousel opts={{ align: 'start', dragFree: true }} className="relative mb-4 min-h-[22.5rem] md:hidden">
      <CarouselContent className="-ml-4 items-stretch">{children}</CarouselContent>
      <CarouselPrevious className={`left-0 ${carouselNavClass}`} />
      <CarouselNext className={`right-0 ${carouselNavClass}`} />
    </Carousel>
  );
}

const streamersCarouselItemClass = 'pl-4 basis-1/2 min-w-0';

function StreamersMobileCarousel({ children }: { children: React.ReactNode }) {
  return (
    <Carousel opts={{ align: 'start', dragFree: true }} className="relative mb-4 md:hidden">
      <CarouselContent className="-ml-4 items-center">{children}</CarouselContent>
      <CarouselPrevious className={`left-0 ${carouselNavClass}`} />
      <CarouselNext className={`right-0 ${carouselNavClass}`} />
    </Carousel>
  );
}

export function HeroSection() {
  const heroImage = '/images/hero.png';

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-b from-background via-card to-background pt-16">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.28),rgba(2,6,23,0.88)_45%,rgba(2,6,23,0.97))]" />
        <div className="absolute inset-0 opacity-25 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-size-[34px_34px]" />
      </div>

      <Container className="relative text-center py-20">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-14">
          <div className="inline-block mb-4 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full max-w-full border border-sky-400/40 bg-sky-500/15 backdrop-blur-sm">
            <span className="text-sky-200 text-xs sm:text-sm font-semibold uppercase tracking-widest wrap-break-words font-gaming">Welcome to Provela Esports</span>
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 text-center uppercase leading-tight font-gaming"
            style={{
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
    <div className={`${homeSectionClass} bg-background`}>
      <Container>
        <SectionHeader
          subtitle="Featured"
          title="Our Divisions"
          description="Explore our competitive divisions across multiple games with the world&apos;s best players."
        />
        <MobileCardCarousel>
          {divisions.map((division) => (
            <CarouselItem key={division.id} className={mobileCarouselItemClass}>
              <DivisionCard division={division} variant="mobile" />
            </CarouselItem>
          ))}
        </MobileCardCarousel>

        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {featured.map((division) => (
            <DivisionCard key={division.id} division={division} variant="desktop" />
          ))}
        </div>
        <div className={homeSectionCtaClass}>
          <Link href="/divisions" className="inline-block max-md:mx-auto max-md:block max-md:w-full max-md:max-w-sm">
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 sm:w-auto">
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
    <div className={`${homeSectionClass} bg-background`}>
      <Container>
        <SectionHeader
          subtitle="Competitions"
          title="Tournaments"
          description="Check out the latest tournaments with massive prize pools and intense competition."
        />
        <MobileCardCarousel>
          {upcomingAndActive.map((tournament) => (
            <CarouselItem key={tournament.id} className={mobileCarouselItemClass}>
              <TournamentCard tournament={tournament} variant="mobile" />
            </CarouselItem>
          ))}
        </MobileCardCarousel>

        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {upcomingAndActive.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} variant="desktop" />
          ))}
        </div>
        <div className={homeSectionCtaClass}>
          <Link href="/tournaments" className="inline-block max-md:mx-auto max-md:block max-md:w-full max-md:max-w-sm">
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 sm:w-auto">
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
    <div className={`${homeSectionClass} bg-card`}>
      <Container>
        <SectionHeader
          subtitle="Updates"
          title="Latest News"
          description="Stay updated with the latest news, announcements, and stories from the Provela community."
        />
        <MobileCardCarousel>
          {articles.map((article) => (
            <CarouselItem key={article.id} className={mobileCarouselItemClass}>
              <NewsCard article={article} variant="mobile" />
            </CarouselItem>
          ))}
        </MobileCardCarousel>

        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {latest.map((article) => (
            <NewsCard key={article.id} article={article} variant="desktop" />
          ))}
        </div>
        <div className={homeSectionCtaClass}>
          <Link href="/news" className="inline-block max-md:mx-auto max-md:block max-md:w-full max-md:max-w-sm">
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 sm:w-auto">
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
    <div className={`${homeSectionClass} bg-card`}>
      <Container>
        <SectionHeader
          subtitle="Live Streams"
          title="Featured Streamers"
          description="Follow our professional streamers and watch the best esports content live."
        />
        <StreamersMobileCarousel>
          {streamers.map((streamer) => (
            <CarouselItem key={streamer.id} className={streamersCarouselItemClass}>
              <StreamerCard streamer={streamer} />
            </CarouselItem>
          ))}
        </StreamersMobileCarousel>

        <div className="hidden md:grid md:grid-cols-4 gap-6">
          {streamers.map((streamer) => (
            <StreamerCard key={streamer.id} streamer={streamer} />
          ))}
        </div>
        <div className={homeSectionCtaClass}>
          <Link href="/streamers" className="inline-block max-md:mx-auto max-md:block max-md:w-full max-md:max-w-sm">
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 sm:w-auto">
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
    <div className={`${homeSectionClass} bg-linear-to-r from-primary/10 to-primary/5 border-y border-primary/20`}>
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

function sponsorLogoSrc(sponsor: Sponsor) {
  if (sponsor.logo) return sponsor.logo;
  if (sponsor.slug) return `https://cdn.simpleicons.org/${sponsor.slug}/${sponsor.color}`;
  return '/placeholder-logo.svg';
}

export function SponsorsSection({ sponsors }: { sponsors: Sponsor[] }) {
  const marqueeItems = [...sponsors, ...sponsors];

  return (
    <section className={`${homeSectionClass} bg-background overflow-hidden border-t border-border`}>
      <Container>
        <SectionHeader
          subtitle="Partners"
          title="Our Sponsors"
          description="Powered by brands that help us compete at the highest level."
        />
      </Container>

      <div className="relative mt-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-background to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-background to-transparent sm:w-28" />

        <div className="group flex w-max animate-sponsor-marquee items-center gap-8 px-4 hover:[animation-play-state:paused]">
          {marqueeItems.map((sponsor, index) => (
            <div
              key={`${sponsor.id}-${index}`}
              className="flex h-20 w-44 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-card/80 px-6 transition-all duration-300 hover:border-primary/40 hover:bg-card"
              title={sponsor.name}
            >
              <img
                src={sponsorLogoSrc(sponsor)}
                alt={sponsor.name}
                className="h-9 w-full max-w-[120px] object-contain opacity-90 transition-opacity group-hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
