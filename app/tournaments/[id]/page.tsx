'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHeader, Container } from '@/components/layout';
import { TOURNAMENTS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Calendar, Trophy, Users } from 'lucide-react';

interface TournamentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TournamentDetailPage(props: TournamentDetailPageProps) {
  const params = await props.params;
  const tournament = TOURNAMENTS.find((t) => t.id === params.id);

  if (!tournament) {
    return (
      <>
        <Navbar />
        <PageHeader title="Tournament Not Found" />
        <div className="py-20">
          <Container className="text-center">
            <p className="text-muted-foreground mb-4">We couldn&apos;t find the tournament you&apos;re looking for.</p>
            <Link href="/tournaments">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tournaments
              </Button>
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

  return (
    <>
      <Navbar />
      <div className="relative h-80 overflow-hidden bg-cover bg-center mt-16" style={{ backgroundImage: `url(${tournament.image})` }}>
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-end">
          <Container className="pb-8 w-full">
            <div className="inline-block px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-semibold mb-4 capitalize">
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
                <p className="text-lg text-muted-foreground mb-6">
                  {tournament.name} is one of our premier tournaments in {tournament.game} with an exciting format and
                  competitive play.
                </p>

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
                    <p className="text-foreground font-semibold">{tournament.prizePool}</p>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-primary mb-2">
                      <Users className="w-5 h-5" />
                      <span className="text-sm font-semibold">Participants</span>
                    </div>
                    <p className="text-foreground font-semibold">{tournament.participants} Teams</p>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-primary mb-2">
                      <span className="text-sm font-semibold">Game</span>
                    </div>
                    <p className="text-foreground font-semibold">{tournament.game}</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-4">Standings</h3>
                <div className="bg-background rounded-lg p-6">
                  <p className="text-muted-foreground">
                    Tournament standings will be displayed here once integrated with the backend API.
                  </p>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-4 mt-8">Schedule</h3>
                <div className="bg-background rounded-lg p-6">
                  <p className="text-muted-foreground">Match schedule will be displayed here once integrated with the backend API.</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h3 className="text-lg font-bold text-foreground mb-6">Quick Info</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Status</p>
                    <p className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold capitalize">
                      {tournament.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Prize Pool</p>
                    <p className="text-2xl font-bold text-primary">{tournament.prizePool}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Participating Teams</p>
                    <p className="text-2xl font-bold text-foreground">{tournament.participants}</p>
                  </div>
                  <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-colors">
                    Register Team
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 mt-12">
            <Link href="/tournaments">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tournaments
              </Button>
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
