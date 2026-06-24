'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Container, SectionHeader } from '@/components/layout';
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

const homeSectionClass = 'pt-8 pb-6 md:pt-10 md:pb-8 border-t border-border/50';
const homeSectionShadeA = 'bg-section-a';
const homeSectionShadeB = 'bg-section-b';
const homeSectionShadeC = 'bg-section-c';
const homeSectionShadeD = 'bg-section-d';
const homeSectionShadeE = 'bg-section-e';
const homeSectionCtaClass = 'text-center mt-8 px-3 sm:mt-9 md:mt-6 md:px-0';
const homeSectionLinkClass =
  'group inline-flex cursor-pointer items-center text-sm font-semibold text-primary transition-all duration-200 hover:text-primary/90';
const homeSectionLinkArrowClass =
  'ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1';

function MobileCardCarousel({ children }: { children: React.ReactNode }) {
  return (
    <Carousel opts={{ align: 'start', dragFree: true }} className="relative mb-4 min-h-90 md:hidden">
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
  const heroImage = '/images/provela-hero-bg.png';

  return (
    <section className="relative min-h-screen overflow-hidden bg-background pt-16">
      {/* Background layers */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 animate-hero-ken-burns"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.65)_50%,rgba(0,0,0,0.9)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,255,255,0.04),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.08),transparent_40%)]" />
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[40px_40px]" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-linear-to-t from-background to-transparent" />
      </div>

      {/* Animated accent lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 h-px w-72 rotate-12 bg-linear-to-r from-transparent via-primary/60 to-transparent animate-hero-sweep" />
        <div className="absolute top-2/3 -right-10 h-px w-96 -rotate-6 bg-linear-to-r from-transparent via-primary/40 to-transparent animate-hero-sweep-delayed" />
      </div>

      <Container className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-start pt-6 pb-16 md:pt-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Image
            src="/images/LOGOS-03.png"
            alt="Provela Esports"
            width={420}
            height={130}
            className="mb-5 h-auto w-full max-w-[min(100%,22rem)] sm:max-w-xs md:mb-6 md:max-w-sm drop-shadow-[0_0_40px_rgba(59,130,246,0.35)]"
            priority
          />

          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary/90 font-gaming md:mb-3">
            Forge Victory
          </p>

          <h1 className="mb-4 text-4xl font-black uppercase leading-[1.05] text-white sm:text-5xl md:mb-5 md:text-6xl lg:text-7xl font-gaming">
            Competitive
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-white to-primary">
              Gaming
            </span>
            <br />
            At Its Finest
          </h1>

          <p className="mx-auto max-w-lg text-base text-white/75 sm:text-lg md:text-xl">
            Elite players. World-class tournaments. Non-stop entertainment across EA FC, CODM, eFootball, and beyond.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center md:mt-10">
            <Link href="/divisions">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_24px_rgba(59,130,246,0.35)]">
                Explore Divisions <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/tournaments">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white/30 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
              >
                View Tournaments
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function FeaturedDivisionsSection({ divisions }: { divisions: Division[] }) {
  const featured = divisions.filter((d) => d.featured).slice(0, 4);

  return (
    <div className={`${homeSectionClass} ${homeSectionShadeA}`}>
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
          <Link href="/divisions" className={homeSectionLinkClass}>
            View All Divisions <ArrowRight className={homeSectionLinkArrowClass} />
          </Link>
        </div>
      </Container>
    </div>
  );
}

export function UpcomingTournamentsSection({ tournaments }: { tournaments: Tournament[] }) {
  const upcomingAndActive = tournaments.filter((t) => t.status === 'upcoming' || t.status === 'active').slice(0, 4);

  return (
    <div className={`${homeSectionClass} ${homeSectionShadeC}`}>
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
          <Link href="/tournaments" className={homeSectionLinkClass}>
            View All Tournaments <ArrowRight className={homeSectionLinkArrowClass} />
          </Link>
        </div>
      </Container>
    </div>
  );
}

export function LatestNewsSection({ articles }: { articles: NewsArticle[] }) {
  const latest = articles.slice(0, 4);

  return (
    <div className={`${homeSectionClass} ${homeSectionShadeD}`}>
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
          <Link href="/news" className={homeSectionLinkClass}>
            Read More News <ArrowRight className={homeSectionLinkArrowClass} />
          </Link>
        </div>
      </Container>
    </div>
  );
}

export function StreamersSection({ streamers }: { streamers: Streamer[] }) {
  return (
    <div className={`${homeSectionClass} ${homeSectionShadeB}`}>
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
          <Link href="/streamers" className={homeSectionLinkClass}>
            View All Streamers <ArrowRight className={homeSectionLinkArrowClass} />
          </Link>
        </div>
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
    <section className={`${homeSectionClass} ${homeSectionShadeE} overflow-hidden`}>
      <Container>
        <SectionHeader
          subtitle="Partners"
          title="Our Sponsors"
          description="Powered by brands that help us compete at the highest level."
        />
      </Container>

      <div className="relative mt-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-section-e to-transparent sm:w-16 md:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-section-e to-transparent sm:w-16 md:w-28" />

        <div className="group flex w-max animate-sponsor-marquee items-center gap-4 px-4 hover:[animation-play-state:paused] sm:gap-6 md:gap-8">
          {marqueeItems.map((sponsor, index) => (
            <div
              key={`${sponsor.id}-${index}`}
              className="flex h-20 w-44 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-card px-4 transition-all duration-300 hover:border-primary/35 hover:bg-secondary md:h-24 md:w-52 md:px-6"
              title={sponsor.name}
            >
              <img
                src={sponsorLogoSrc(sponsor)}
                alt={sponsor.name}
                className="h-9 w-full max-w-30 object-contain opacity-90 transition-opacity group-hover:opacity-100 md:max-h-14 md:max-w-42"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
