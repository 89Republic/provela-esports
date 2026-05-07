import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHeader, Container, GridSection } from '@/components/layout';
import { DivisionCard } from '@/components/cards';
import { DIVISIONS } from '@/lib/constants';

export const metadata = {
  title: 'Divisions | Provela Esports',
  description: 'Explore all Provela Esports divisions across Valorant, Counter-Strike, League of Legends, Dota 2, and Overwatch 2.',
};

export default function DivisionsPage() {
  return (
    <>
      <Navbar />
      <PageHeader
        title="Divisions"
        subtitle="Explore our competitive divisions featuring the world's best players"
      />
      <main className="py-20">
        <Container>
          <GridSection cols={3}>
            {DIVISIONS.map((division) => (
              <DivisionCard key={division.id} division={division} />
            ))}
          </GridSection>
        </Container>
      </main>
      <Footer />
    </>
  );
}
