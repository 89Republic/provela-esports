import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { HeroScene } from '@/components/scenes/hero-scene';
import { LiveSignalStrip } from '@/components/scenes/live-signal';
import { DivisionsScene } from '@/components/scenes/divisions-scene';
import { TournamentCenter } from '@/components/scenes/tournament-center';
import { FeaturedMatchScene } from '@/components/scenes/featured-match';
import { StreamerWall } from '@/components/scenes/streamer-wall';
import { Dispatch } from '@/components/scenes/dispatch';
import { CommunityPulse } from '@/components/scenes/community-pulse';
import { SponsorWall } from '@/components/scenes/sponsor-wall';
import { FinalCta } from '@/components/scenes/final-cta';
import { getSiteContent } from '@/lib/site-content';

export default async function Home() {
  const content = await getSiteContent();

  return (
    <>
      <Navbar />
      <main>
        <HeroScene />
        <LiveSignalStrip />
        <DivisionsScene divisions={content.divisions} />
        <TournamentCenter tournaments={content.tournaments} />
        <FeaturedMatchScene />
        <StreamerWall streamers={content.streamers} />
        <Dispatch articles={content.newsArticles} />
        <CommunityPulse />
        <SponsorWall sponsors={content.sponsors} />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
