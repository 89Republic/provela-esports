import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHeader, Container, GridSection } from '@/components/layout';
import { TournamentCard } from '@/components/cards';
import { TOURNAMENTS } from '@/lib/constants';

export const metadata = {
  title: 'Tournaments | Provela Esports',
  description: 'Discover upcoming, active, and past tournaments with massive prize pools.',
};

export default function TournamentsPage() {
  const upcoming = TOURNAMENTS.filter((t) => t.status === 'upcoming');
  const active = TOURNAMENTS.filter((t) => t.status === 'active');
  const past = TOURNAMENTS.filter((t) => t.status === 'past');

  return (
    <>
      <Navbar />
      <PageHeader
        title="Tournaments"
        subtitle="World-class competitions with amazing prizes"
      />
      <main className="py-20">
        <Container>
          {active.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-8">Active</h2>
              <GridSection cols={3}>
                {active.map((tournament) => (
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

          {past.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-8">Past</h2>
              <GridSection cols={3}>
                {past.map((tournament) => (
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
