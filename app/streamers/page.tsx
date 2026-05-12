import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHeader, Container, GridSection } from '@/components/layout';
import { StreamerCard } from '@/components/cards';
import { getSiteContent } from '@/lib/site-content';

export const metadata = {
  title: 'Streamers | Provela Esports',
  description: 'Follow our professional streamers and watch the best esports content live on Twitch and YouTube.',
};

export default async function StreamersPage() {
  const content = await getSiteContent();
  const liveStreamers = content.streamers.filter((s) => s.status === 'live');
  const offlineStreamers = content.streamers.filter((s) => s.status === 'offline');

  return (
    <>
      <Navbar />
      <PageHeader
        title="Streamers"
        subtitle="Follow our professional streamers and watch live content"
      />
      <main className="py-20">
        <Container>
          {liveStreamers.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center">
                <span className="w-3 h-3 bg-primary rounded-full mr-3 animate-pulse" />
                Live Now
              </h2>
              <GridSection cols={4}>
                {liveStreamers.map((streamer) => (
                  <StreamerCard key={streamer.id} streamer={streamer} />
                ))}
              </GridSection>
            </div>
          )}

          {offlineStreamers.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-8">Offline</h2>
              <GridSection cols={4}>
                {offlineStreamers.map((streamer) => (
                  <StreamerCard key={streamer.id} streamer={streamer} />
                ))}
              </GridSection>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
