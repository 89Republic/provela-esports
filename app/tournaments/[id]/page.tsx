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
      <div className="relative h-80 overflow-hidden bg-cover bg-center mt-16" style={{ backgroundImage: `url(${tournament.image})` }}>
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-end">
          <Container className="pb-8 w-full">
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 capitalize ${statusBadge}`}>
              {tournament.status}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">{tournament.name}</h1>
          </Container>
        </div>
      </div>

      <main className="py-20">
        <Container>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <div className="bg-card border border-border rounded-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Tournament Details</h2>
                <p className="text-lg text-muted-foreground mb-3">{tournament.overview}</p>
                <p className="text-muted-foreground mb-6">{tournament.format}</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
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
                    <div key={row.rank} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 text-sm">
                      <span className="text-primary font-semibold">#{row.rank}</span>
                      <span className="text-foreground font-medium">{row.name}</span>
                      <span className="text-muted-foreground">P:{row.played}</span>
                      <span className="text-foreground font-semibold">{row.points} pts</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-foreground mb-4 mt-8">Schedule</h3>
                <div className="bg-background rounded-lg p-6 space-y-3">
                  {tournament.schedule.map((match) => (
                    <div key={match.id} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-foreground">{match.label}</p>
                        <p className="text-sm text-muted-foreground">{match.stage}</p>
                      </div>
                      <span className="text-sm text-primary font-semibold">{formatDate(match.date)}</span>
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
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
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
