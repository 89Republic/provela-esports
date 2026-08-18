import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Container, backLinkClass, backLinkHeroClass, backLinkArrowClass } from '@/components/layout';
import { SocialIcon, getSocialBrandClasses, getPlatformLabel } from '@/components/social-icon';
import { getSiteContent } from '@/lib/site-content';
import Link from 'next/link';
import { ArrowLeft, Calendar, ExternalLink, Radio, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreamerProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

function formatFollowers(count: number) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (count >= 1_000) return `${Math.round(count / 1_000)}K`;
  return String(count);
}

export async function generateMetadata(props: StreamerProfilePageProps) {
  const params = await props.params;
  const content = await getSiteContent();
  const streamer = content.streamers.find((s) => s.id === params.id);

  if (!streamer) {
    return { title: 'Streamer Not Found | Provela Esports' };
  }

  return {
    title: `${streamer.name} | Provela Streamers`,
    description: streamer.bio,
  };
}

export default async function StreamerProfilePage(props: StreamerProfilePageProps) {
  const params = await props.params;
  const content = await getSiteContent();
  const streamer = content.streamers.find((s) => s.id === params.id);

  if (!streamer) {
    return (
      <>
        <Navbar />
        <div className="py-20 mt-16">
          <Container className="text-center">
            <p className="text-muted-foreground mb-4">We couldn&apos;t find the streamer you&apos;re looking for.</p>
            <Link href="/streamers" className={backLinkClass}>
              <ArrowLeft className={backLinkArrowClass} />
              Back to Streamers
            </Link>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  const isLive = streamer.status === 'live';
  const encodedAvatar = encodeURI(streamer.avatar);
  const primaryPlatformLabel = getPlatformLabel(streamer.platform);

  return (
    <>
      <Navbar />

      <section className="relative mt-16 min-h-[320px] overflow-hidden sm:min-h-[380px] md:min-h-[440px]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${encodedAvatar}")` }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(4,8,18,0.96)_8%,rgba(4,8,18,0.6)_50%,rgba(4,8,18,0.75)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.25),transparent_45%)]" />

        <Container className="relative flex min-h-[320px] flex-col justify-end py-10 sm:min-h-[380px] sm:py-14 md:min-h-[440px] md:py-16">
          <Link href="/streamers" className={backLinkHeroClass}>
            <ArrowLeft className={backLinkArrowClass} />
            All Streamers
          </Link>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
            <div className="relative shrink-0">
              <img
                src={streamer.avatar}
                alt={streamer.name}
                className="size-24 rounded-full border-4 border-primary object-cover shadow-xl sm:size-28 md:size-32"
              />
              {isLive && (
                <span className="absolute bottom-1 right-1 flex size-5 items-center justify-center rounded-full border-2 border-background bg-primary sm:size-6">
                  <span className="live-dot size-2 rounded-full bg-primary-foreground" />
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {isLive ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                    <Radio className="size-3.5" />
                    Live Now
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold capitalize text-muted-foreground">
                    Offline
                  </span>
                )}
                <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-semibold capitalize text-foreground backdrop-blur-sm">
                  {primaryPlatformLabel}
                </span>
              </div>

              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">{streamer.game}</p>
              <h1 className="font-gaming text-3xl font-black uppercase text-white sm:text-4xl md:text-5xl">
                {streamer.name}
              </h1>
              <p className="mt-3 flex items-center gap-1.5 text-sm text-white/80">
                <Users className="size-4 shrink-0" />
                <span className="font-semibold text-white">{formatFollowers(streamer.followers)}</span>
                <span>followers</span>
              </p>
            </div>
          </div>
        </Container>
      </section>

      <main className="py-10 sm:py-14 md:py-16">
        <Container>
          <div className="grid gap-8 md:grid-cols-3 md:gap-12">
            <div className="md:col-span-2 space-y-8">
              {isLive && streamer.embedUrl && (
                <section className="overflow-hidden rounded-lg border border-border bg-card">
                  <div className="border-b border-border px-4 py-3 sm:px-6">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">Live Stream</h2>
                  </div>
                  <div className="aspect-video w-full bg-black">
                    <iframe
                      src={streamer.embedUrl}
                      title={`${streamer.name} live stream`}
                      className="size-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </section>
              )}

              <section className="rounded-lg border border-border bg-card p-4 sm:p-6 md:p-8">
                <h2 className="mb-4 text-xl font-bold text-foreground sm:text-2xl">Overview</h2>
                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{streamer.bio}</p>
              </section>

              {streamer.highlights.length > 0 && (
                <section>
                  <h2 className="mb-4 text-xl font-bold text-foreground">Highlights</h2>
                  <div className="space-y-3 rounded-lg border border-border bg-card p-4 sm:p-6">
                    {streamer.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                      >
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                        <p className="text-foreground">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {streamer.schedule.length > 0 && (
                <section>
                  <h2 className="mb-4 text-xl font-bold text-foreground">Stream Schedule</h2>
                  <div className="space-y-3 rounded-lg border border-border bg-card p-4 sm:p-6">
                    {streamer.schedule.map((slot) => (
                      <div key={slot} className="flex items-center gap-3">
                        <Calendar className="size-4 shrink-0 text-primary" />
                        <p className="text-foreground">{slot}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="md:col-span-1">
              <div className="sticky top-20 space-y-6 sm:top-24">
                <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
                  <h3 className="mb-4 text-lg font-bold text-foreground">Streaming Platforms</h3>

                  <a
                    href={streamer.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'mb-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors',
                      getSocialBrandClasses(streamer.platform),
                    )}
                  >
                    <SocialIcon platform={streamer.platform} className="size-4" />
                    {isLive ? `Watch Live on ${primaryPlatformLabel}` : `Visit ${primaryPlatformLabel} Channel`}
                    <ExternalLink className="size-3.5 opacity-80" />
                  </a>

                  {streamer.socialLinks.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">All Links</p>
                      <div className="space-y-2">
                        {streamer.socialLinks.map((social) => (
                          <a
                            key={`${social.platform}-${social.url}`}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-muted/40"
                          >
                            <span
                              className={cn(
                                'inline-flex size-8 shrink-0 items-center justify-center rounded-full border',
                                getSocialBrandClasses(social.platform),
                              )}
                            >
                              <SocialIcon platform={social.platform} className="size-3.5" />
                            </span>
                            <span className="min-w-0 flex-1 truncate text-sm font-medium capitalize text-foreground">
                              {social.platform === 'x' ? 'X (Twitter)' : social.platform}
                            </span>
                            <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
                  <h3 className="mb-4 text-lg font-bold text-foreground">Quick Info</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">Status</p>
                      <p className={cn('text-sm font-semibold capitalize', isLive ? 'text-primary' : 'text-muted-foreground')}>
                        {streamer.status}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">Primary Game</p>
                      <p className="text-sm font-semibold text-foreground">{streamer.game}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">Followers</p>
                      <p className="text-2xl font-bold text-primary">{formatFollowers(streamer.followers)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-border pt-8">
            <Link href="/streamers" className={backLinkClass}>
              <ArrowLeft className={backLinkArrowClass} />
              Back to Streamers
            </Link>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
