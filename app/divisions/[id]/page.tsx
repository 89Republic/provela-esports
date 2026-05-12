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
      <PageHeader title={division.name} subtitle={division.tagline} />
      <main className="py-20">
        <Container>
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-foreground mb-4">About {division.name}</h2>
              <p className="text-lg text-muted-foreground mb-8">{division.description}</p>

              <h3 className="text-xl font-bold text-foreground mb-4 mt-8">Roster</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {division.roster.map((member) => (
                  <div key={member.id} className="bg-card border border-border rounded-lg p-4">
                    <p className="text-xs uppercase tracking-wide text-primary mb-1">{member.tag}</p>
                    <h4 className="text-lg font-semibold text-foreground">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    <p className="text-sm text-muted-foreground mb-3">{member.location}</p>
                    <div className="flex flex-wrap gap-2">
                      {member.socialLinks.map((social) => (
                        <a
                          key={`${member.id}-${social.platform}`}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          {social.platform}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold text-foreground mb-4 mt-8">Achievements</h3>
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

              <h3 className="text-xl font-bold text-foreground mb-4 mt-8">Upcoming Matches</h3>
              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                {division.schedule.filter((entry) => entry.status === 'upcoming').map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground">{entry.competition}</p>
                      <p className="text-sm text-muted-foreground">vs {entry.opponent}</p>
                    </div>
                    <span className="text-sm text-primary font-semibold">{formatDate(entry.date)}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold text-foreground mb-4 mt-8">Media</h3>
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
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Featured</p>
                    <p className="text-lg font-semibold text-foreground">{division.featured ? 'Yes' : 'No'}</p>
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
