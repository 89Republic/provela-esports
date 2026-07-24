import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHeader, Container } from '@/components/layout';
import { DivisionsGrid } from '@/components/divisions-grid';
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
      <main className="py-12 sm:py-16 md:py-20">
        <Container>
          <DivisionsGrid divisions={content.divisions} />
        </Container>
      </main>
      <Footer />
    </>
  );
}
