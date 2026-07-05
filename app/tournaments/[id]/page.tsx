import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHeader, Container, backLinkClass, backLinkArrowClass } from '@/components/layout';
import { getSiteContent } from '@/lib/site-content';
import { formatPrizePool } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, Calendar, Trophy, Users } from 'lucide-react';

interface TournamentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TournamentDetailPage(props: TournamentDetailPageProps) {
  const params = await props.params;
  const content = await getSiteContent();
  const tournament = content.tournaments.find((t) => t.id === params.id);

  if (!tournament) {
    return (
      <>
        <Navbar />
        <PageHeader title="Tournament Not Found" />
        <div className="py-20">
          <Container className="text-center">
            <p className="text-muted-foreground mb-4">We couldn&apos;t find the tournament you&apos;re looking for.</p>
            <Link href="/tournaments" className={backLinkClass}>
              <ArrowLeft className={backLinkArrowClass} />
              Back to Tournaments
            </Link>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const statusBadge =
    tournament?.status === 'active'
      ? 'bg-primary/20 text-primary'
      : tournament?.status === 'upcoming'
        ? 'bg-blue-500/20 text-blue-400'
        : 'bg-muted text-muted-foreground';

  return (
    <>
      <Navbar />
      <div className="relative mt-16 h-56 overflow-hidden bg-cover bg-center sm:h-72 md:h-80" style={{ backgroundImage: `url(${tournament.image})` }}>
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-end">
          <Container className="w-full pb-6 sm:pb-8">
            <div className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize sm:mb-4 ${statusBadge}`}>
              {tournament.status}
            </div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl lg:text-5xl">{tournament.name}</h1>
          </Container>
        </div>
      </div>

      <main className="py-12 sm:py-16 md:py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-3 md:gap-12">
            <div className="md:col-span-2">
              <div className="mb-8 rounded-lg border border-border bg-card p-4 sm:p-6 md:p-8">
                <h2 className="mb-4 text-xl font-bold text-foreground sm:text-2xl">Tournament Details</h2>
                <p className="mb-3 text-base text-muted-foreground sm:text-lg">{tournament.overview}</p>
                <p className="mb-6 text-sm text-muted-foreground sm:text-base">{tournament.format}</p>

                <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-primary mb-2">
                      <Calendar className="w-5 h-5" />
                      <span className="text-sm font-semibold">Dates</span>
                    </div>
                    <p className="text-foreground font-semibold">
                      {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                    </p>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-primary mb-2">
                      <Trophy className="w-5 h-5" />
                      <span className="text-sm font-semibold">Prize Pool</span>
                    </div>
                    <p className="text-foreground font-semibold">{formatPrizePool(tournament.prizePool)}</p>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-primary mb-2">
                      <Users className="w-5 h-5" />
                      <span className="text-sm font-semibold">Participants</span>
                    </div>
                    <p className="text-foreground font-semibold">{tournament.participants.length} Teams</p>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-primary mb-2">
                      <span className="text-sm font-semibold">Division</span>
                    </div>
                    <p className="text-foreground font-semibold">{tournament.division}</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-4">Participants</h3>
                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  {tournament.participants.map((participant) => (
                    <div key={participant.id} className="border border-border rounded-lg p-3">
                      <p className="font-semibold text-foreground">{participant.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{participant.type}</p>
                      {participant.record && <p className="text-sm text-primary">Record: {participant.record}</p>}
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-foreground mb-4">Standings</h3>
                <div className="bg-background rounded-lg p-6 space-y-3">
                  {tournament.standings.length === 0 && (
                    <p className="text-muted-foreground">Standings will be published once bracket play starts.</p>
                  )}
                  {tournament.standings.map((row) => (
                    <div key={row.rank} className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-2 text-xs sm:gap-4 sm:text-sm">
                      <span className="font-semibold text-primary">#{row.rank}</span>
                      <span className="truncate font-medium text-foreground">{row.name}</span>
                      <span className="text-muted-foreground">P:{row.played}</span>
                      <span className="font-semibold text-foreground">{row.points} pts</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-foreground mb-4 mt-8">Schedule</h3>
                <div className="bg-background rounded-lg p-6 space-y-3">
                  {tournament.schedule.map((match) => (
                    <div key={match.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground">{match.label}</p>
                        <p className="text-sm text-muted-foreground">{match.stage}</p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-primary">{formatDate(match.date)}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-foreground mb-4 mt-8">Recent Results</h3>
                <div className="bg-background rounded-lg p-6 space-y-2">
                  {tournament.results.length === 0 && (
                    <p className="text-muted-foreground">Results will appear here after the first match day.</p>
                  )}
                  {tournament.results.map((result, idx) => (
                    <p key={idx} className="text-foreground">{result}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="sticky top-20 rounded-lg border border-border bg-card p-4 sm:top-24 sm:p-6">
                <h3 className="text-lg font-bold text-foreground mb-6">Quick Info</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Status</p>
                    <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${statusBadge}`}>
                      {tournament.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Prize Pool</p>
                    <p className="text-2xl font-bold text-primary">{formatPrizePool(tournament.prizePool)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Participating Teams</p>
                    <p className="text-2xl font-bold text-foreground">{tournament.participants.length}</p>
                  </div>
                  <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-colors">
                    {tournament.registrationOpen ? 'Register Team' : 'Registration Closed'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 mt-12">
            <Link href="/tournaments" className={backLinkClass}>
              <ArrowLeft className={backLinkArrowClass} />
              Back to Tournaments
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
