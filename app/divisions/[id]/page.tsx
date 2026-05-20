import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Container } from '@/components/layout';
import { SquadCarousel } from '@/components/squad-carousel';
import { getSiteContent } from '@/lib/site-content';
import { Button } from '@/components/ui/button';
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
            <Link href="/divisions">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Divisions
              </Button>
            </Link>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  const heroImage = division.media.find((item) => item.type === 'image')?.url ?? '/images/hero.png';
  const nextMatch = division.schedule.find((entry) => entry.status === 'upcoming');
  const completedMatches = division.schedule.filter((entry) => entry.status === 'completed').length;

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
              <Link href="/divisions">
                <Button variant="outline" className="mb-8 border-white/35 text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  All Divisions
                </Button>
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

          <section className="grid grid-cols-4 gap-2 sm:gap-4 mb-12">
            <article className="rounded-lg border border-border bg-card p-3 sm:p-5 min-w-0 overflow-hidden">
              <p className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground leading-tight truncate">Teams</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">{division.teams}</p>
            </article>
            <article className="rounded-lg border border-border bg-card p-3 sm:p-5 min-w-0 overflow-hidden">
              <p className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground leading-tight truncate">Players</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">{division.players}</p>
            </article>
            <article className="rounded-lg border border-border bg-card p-3 sm:p-5 min-w-0 overflow-hidden">
              <p className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground leading-tight truncate">Achievements</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">{division.achievements.length}</p>
            </article>
            <article className="rounded-lg border border-border bg-card p-3 sm:p-5 min-w-0 overflow-hidden">
              <p className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground leading-tight truncate">
                <span className="sm:hidden">Matches</span>
                <span className="hidden sm:inline">Completed Matches</span>
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">{completedMatches}</p>
            </article>
          </section>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-8">
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

              <section>
                <h3 className="text-xl font-bold text-foreground mb-4">Media</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {division.media.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <p className="text-xs uppercase tracking-wide text-primary mb-1">{item.type}</p>
                      <p className="font-semibold text-foreground">{item.title}</p>
                    </a>
                  ))}
                </div>
              </section>
            </div>

            <div className="md:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h3 className="text-lg font-bold text-foreground mb-6">Match Schedule</h3>
                <div className="space-y-4">
                  {division.schedule.length === 0 && (
                    <p className="text-sm text-muted-foreground">Schedule will be published soon.</p>
                  )}
                  {division.schedule.map((entry) => (
                    <div key={entry.id} className="rounded-md border border-border p-3">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-semibold text-foreground text-sm">{entry.competition}</p>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full capitalize ${entry.status === 'upcoming' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {entry.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">vs {entry.opponent}</p>
                      <p className="text-xs text-primary mt-2 font-semibold">{formatDate(entry.date)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 mt-12">
            <Link href="/divisions">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Divisions
              </Button>
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
