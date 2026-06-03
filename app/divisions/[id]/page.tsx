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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

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
  const nextMatch = division.schedule.find((entry) => entry.status === 'upcoming');

  return (
    <>
      <Navbar />

      <section className="relative mt-16 min-h-[520px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${heroImage}")` }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(4,8,18,0.95)_5%,rgba(4,8,18,0.55)_45%,rgba(4,8,18,0.75)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.28),transparent_45%)]" />

        <Container className="relative py-14 md:py-20">
          <div className="grid gap-10 md:grid-cols-3 md:items-end">
            <div className="md:col-span-2">
              <Link href="/divisions" className={backLinkHeroClass}>
                <ArrowLeft className={backLinkArrowClass} />
                All Divisions
              </Link>

              <p className="mb-2 text-xs uppercase tracking-[0.25em] text-primary font-semibold">{division.game}</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase font-gaming">
                {division.name}
              </h1>
              <p className="mt-4 max-w-2xl text-white/85 text-lg">{division.tagline}</p>
            </div>

            <aside className="rounded-xl border border-white/20 bg-black/35 p-5 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-widest text-primary mb-2">Next Match</p>
              {nextMatch ? (
                <>
                  <p className="text-white font-semibold">{nextMatch.competition}</p>
                  <p className="text-white/80 text-sm mt-1">vs {nextMatch.opponent}</p>
                  <p className="text-primary font-semibold mt-3 text-sm">{formatDate(nextMatch.date)}</p>
                </>
              ) : (
                <p className="text-white/80 text-sm">No upcoming matches right now.</p>
              )}
            </aside>
          </div>
        </Container>
      </section>

      <main className="py-16">
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
                  <div key={`${achievement.title}-${achievement.year}`} className="flex items-center justify-between gap-4">
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
