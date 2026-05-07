import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  HeroSection,
  FeaturedDivisionsSection,
  UpcomingTournamentsSection,
  LatestNewsSection,
  StreamersSection,
  CTASection,
} from '@/components/home-sections';
import { DIVISIONS, TOURNAMENTS, NEWS_ARTICLES, STREAMERS } from '@/lib/constants';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedDivisionsSection divisions={DIVISIONS} />
        <UpcomingTournamentsSection tournaments={TOURNAMENTS} />
        <LatestNewsSection articles={NEWS_ARTICLES} />
        <StreamersSection streamers={STREAMERS} />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
