import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHeader, Container, GridSection } from '@/components/layout';
import { DivisionCard } from '@/components/cards';
import { getSiteContent } from '@/lib/site-content';

export const metadata = {
  title: 'Divisions | Provela Esports',
  description: 'Explore all Provela Esports divisions across Valorant, Counter-Strike, League of Legends, Dota 2, and Overwatch 2.',
};

export default async function DivisionsPage() {
  const content = await getSiteContent();

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
            {content.divisions.map((division) => (
              <DivisionCard key={division.id} division={division} />
            ))}
          </GridSection>
        </Container>
      </main>
      <Footer />
    </>
  );
}
