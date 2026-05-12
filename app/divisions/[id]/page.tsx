import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHeader, Container } from '@/components/layout';
import { DIVISIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, MapPin } from 'lucide-react';

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

  const sidePanelImage = division.media.find((item) => item.type === 'image')?.url ?? '/images/hero.png';

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

              <h3 className="text-xl font-bold text-foreground mb-4 mt-8">Player Profiles</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {division.roster.map((member) => (
                  <article key={member.id} className="bg-card border border-border rounded-lg p-4 hover:border-primary/60 transition-colors">
                    <div className="flex items-start gap-4">
                      <img
                        src={member.avatar || '/placeholder-user.jpg'}
                        alt={member.name}
                        className="w-16 h-16 rounded-full border-2 border-primary/30 object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs uppercase tracking-wide text-primary mb-1">{member.tag}</p>
                        <h4 className="text-lg font-semibold text-foreground leading-tight line-clamp-1">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        <div className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span className="line-clamp-1">{member.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Social Links</p>
                      <div className="flex flex-wrap gap-2">
                      {member.socialLinks.map((social) => (
                        <a
                          key={`${member.id}-${social.platform}`}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          <span>{social.platform}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                    </div>
                  </article>
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
                <div className="mb-5 overflow-hidden rounded-md border border-border">
                  <img
                    src={sidePanelImage}
                    alt={`${division.name} cover`}
                    className="w-full h-36 object-cover"
                  />
                </div>
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
