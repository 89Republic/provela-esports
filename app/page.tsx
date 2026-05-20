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
import { getSiteContent } from '@/lib/site-content';

export default async function Home() {
  const content = await getSiteContent();

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedDivisionsSection divisions={content.divisions} />
        <StreamersSection streamers={content.streamers} />
        <UpcomingTournamentsSection tournaments={content.tournaments} />
        <LatestNewsSection articles={content.newsArticles} />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
