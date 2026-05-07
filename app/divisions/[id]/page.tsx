'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHeader, Container } from '@/components/layout';
import { DIVISIONS } from '@/lib/constants';
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
  const division = DIVISIONS.find((d) => d.id === params.id);

  if (!division) {
    return (
      <>
        <Navbar />
        <PageHeader title="Division Not Found" />
        <div className="py-20">
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

  return (
    <>
      <Navbar />
      <PageHeader title={division.name} subtitle={division.game} />
      <main className="py-20">
        <Container>
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-foreground mb-4">About {division.name}</h2>
              <p className="text-lg text-muted-foreground mb-6">{division.description}</p>
              <p className="text-muted-foreground mb-8">
                This is one of our premier competitive divisions featuring the highest level of play in {division.game}
                . Our players are dedicated to excellence and pushing the boundaries of competitive gaming.
              </p>

              <h3 className="text-xl font-bold text-foreground mb-4 mt-8">Current Teams</h3>
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-muted-foreground">
                  Teams roster information will be displayed here once integrated with the backend API.
                </p>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-4 mt-8">Upcoming Matches</h3>
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-muted-foreground">No upcoming matches scheduled. Check back soon!</p>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <div className="text-6xl mb-4 text-center">{division.icon}</div>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Teams</p>
                    <p className="text-3xl font-bold text-foreground">{division.teams}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Players</p>
                    <p className="text-3xl font-bold text-foreground">{division.players}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Game</p>
                    <p className="text-lg font-semibold text-primary">{division.game}</p>
                  </div>
                  <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-colors">
                    Join Division
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8">
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
