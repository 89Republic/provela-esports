import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Container, backLinkClass, backLinkHeroClass, backLinkArrowClass } from '@/components/layout';
import { SquadCarousel } from '@/components/squad-carousel';
import { getSiteContent } from '@/lib/site-content';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface DivisionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DivisionDetailPage(props: DivisionDetailPageProps) {
  const params = await props.params;
  const content = await getSiteContent();
  const division = content.divisions.find((d) => d.id === params.id);

  if (!division) {
    return (
      <>
        <Navbar />
        <div className="py-20 mt-16">
          <Container className="text-center">
            <p className="text-muted-foreground mb-4">We couldn&apos;t find the division you&apos;re looking for.</p>
            <Link href="/divisions" className={backLinkClass}>
              <ArrowLeft className={backLinkArrowClass} />
              Back to Divisions
            </Link>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  const heroImage = division.media.find((item) => item.type === 'image')?.url ?? '/images/hero.png';

  return (
    <>
      <Navbar />

      <section className="relative mt-16 min-h-[360px] overflow-hidden sm:min-h-[440px] md:min-h-[520px]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${heroImage}")` }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(4,8,18,0.95)_5%,rgba(4,8,18,0.55)_45%,rgba(4,8,18,0.75)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.28),transparent_45%)]" />

        <Container className="relative py-10 sm:py-14 md:py-20">
          <Link href="/divisions" className={backLinkHeroClass}>
            <ArrowLeft className={backLinkArrowClass} />
            All Divisions
          </Link>

          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-primary font-semibold">{division.game}</p>
          <h1 className="text-3xl font-black uppercase text-white font-gaming sm:text-4xl sm:text-5xl md:text-6xl">
            {division.name}
          </h1>
          <p className="mt-4 max-w-2xl text-white/85 text-lg">{division.tagline}</p>
        </Container>
      </section>

      <main className="py-10 sm:py-14 md:py-16">
        <Container>
          <SquadCarousel roster={division.roster} divisionName={division.name} />

          <div className="space-y-8 mt-12">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-3">About {division.name}</h2>
              <p className="text-lg text-muted-foreground">{division.description}</p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-foreground mb-4">Achievements</h3>
              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                {division.achievements.map((achievement) => (
                  <div key={`${achievement.title}-${achievement.year}`} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <div>
                      <p className="font-semibold text-foreground">{achievement.title}</p>
                      <p className="text-sm text-muted-foreground">{achievement.event}</p>
                    </div>
                    <span className="text-sm text-primary font-semibold">{achievement.year}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="border-t border-border pt-8 mt-12">
            <Link href="/divisions" className={backLinkClass}>
              <ArrowLeft className={backLinkArrowClass} />
              Back to Divisions
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
