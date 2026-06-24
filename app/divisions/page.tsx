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
      <main className="relative overflow-hidden py-20">
        {/* ambient gradient field — keeps the page from reading as flat black */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_15%_-10%,_oklch(0.66_0.17_256/0.18),_transparent_60%),radial-gradient(ellipse_70%_60%_at_100%_110%,_oklch(0.84_0.12_218/0.12),_transparent_55%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-[linear-gradient(to_right,transparent,oklch(0.66_0.17_256/0.4),transparent)]"
        />
        <Container>
          <DivisionsGrid divisions={content.divisions} />
        </Container>
      </main>
      <Footer />
    </>
  );
}
