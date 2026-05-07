import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHeader, Container, GridSection } from '@/components/layout';
import { TournamentCard } from '@/components/cards';
import { TOURNAMENTS } from '@/lib/constants';

export const metadata = {
  title: 'Tournaments | Provela Esports',
  description: 'Discover upcoming, ongoing, and completed tournaments with massive prize pools.',
};

export default function TournamentsPage() {
  const upcoming = TOURNAMENTS.filter((t) => t.status === 'upcoming');
  const ongoing = TOURNAMENTS.filter((t) => t.status === 'ongoing');
  const completed = TOURNAMENTS.filter((t) => t.status === 'completed');

  return (
    <>
      <Navbar />
      <PageHeader
        title="Tournaments"
        subtitle="World-class competitions with amazing prizes"
      />
      <main className="py-20">
        <Container>
          {ongoing.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-8">Ongoing</h2>
              <GridSection cols={3}>
                {ongoing.map((tournament) => (
                  <TournamentCard key={tournament.id} tournament={tournament} />
                ))}
              </GridSection>
            </div>
          )}

          {upcoming.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-8">Upcoming</h2>
              <GridSection cols={3}>
                {upcoming.map((tournament) => (
                  <TournamentCard key={tournament.id} tournament={tournament} />
                ))}
              </GridSection>
            </div>
          )}

          {completed.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-8">Completed</h2>
              <GridSection cols={3}>
                {completed.map((tournament) => (
                  <TournamentCard key={tournament.id} tournament={tournament} />
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
