import { formatCedis } from '@/lib/utils';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHeader, Container, SectionHeader } from '@/components/layout';
import { SocialIconLink } from '@/components/social-icon';
import { getSiteContent } from '@/lib/site-content';
import type { ManagementMember } from '@/lib/types';
import { Trophy, Users, Zap } from 'lucide-react';

export const metadata = {
  title: 'About | Provela Esports',
  description: 'Learn about Provela Esports, our mission, values, and commitment to professional gaming.',
};

function ManagementCard({ member }: { member: ManagementMember }) {
  const isBrandLogo = member.photo.includes('LOGOS-03');

  return (
    <article className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="relative aspect-[5/6] w-full overflow-hidden">
        <img
          src={member.photo || '/placeholder-user.jpg'}
          alt={member.name}
          className={`absolute inset-0 h-full w-full ${isBrandLogo ? 'object-contain bg-black p-6' : 'object-cover'}`}
        />
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{member.role}</p>
        <h3 className="mt-0.5 font-gaming text-lg font-bold text-foreground">{member.name}</h3>
        {member.bio && <p className="mt-2 text-sm leading-snug text-muted-foreground">{member.bio}</p>}
        {member.socialLinks.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {member.socialLinks.map((social) => (
              <SocialIconLink key={`${member.id}-${social.platform}-${social.url}`} social={social} size="sm" />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <>
      <Navbar />
      <PageHeader
        title="About Provela Esports"
        subtitle="Building the future of professional gaming"
      />
      <main>
        <div className="py-12 sm:py-16 md:py-20 bg-section-a border-t border-border/50">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Provela Esports was founded with a simple mission: to bring world-class competitive gaming to players
                and fans around the globe. We believe in the power of esports to inspire, connect, and elevate the
                gaming community.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                From our humble beginnings, we&apos;ve grown into a premier esports organization with divisions across
                multiple titles, world-class tournaments, and a community of passionate gamers and fans.
              </p>
              <p className="text-lg text-muted-foreground">
                Today, Provela Esports stands as a testament to the dedication, skill, and passion of our players,
                streamers, and support staff. We&apos;re committed to pushing the boundaries of competitive gaming and
                creating unforgettable experiences for our community.
              </p>
            </div>
          </Container>
        </div>

        <div className="py-12 sm:py-16 md:py-20 bg-section-b border-t border-border/50">
          <Container>
            <SectionHeader
              title="Our Values"
              description="The principles that guide everything we do at Provela Esports"
            />
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Excellence</h3>
                <p className="text-muted-foreground">
                  We strive for excellence in every competition, event, and interaction with our community.
                </p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Community</h3>
                <p className="text-muted-foreground">
                  Our community is at the heart of everything we do. We celebrate, support, and uplift our members.
                </p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously innovate and adapt to bring fresh experiences to competitive gaming.
                </p>
              </div>
            </div>
          </Container>
        </div>

        {content.management.length > 0 && (
          <div className="py-12 sm:py-16 md:py-20 bg-section-c border-t border-border/50">
            <Container>
              <SectionHeader
                title="Management"
                description="The team leading Provela Esports"
              />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
                {content.management.map((member) => (
                  <ManagementCard key={member.id} member={member} />
                ))}
              </div>
            </Container>
          </div>
        )}

        <div className="py-12 sm:py-16 md:py-20 bg-section-d border-t border-border/50">
          <Container>
            <SectionHeader
              title="By The Numbers"
              description="Provela Esports at a glance"
            />
            <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4 max-w-5xl mx-auto">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">5</p>
                <p className="text-muted-foreground">Active Divisions</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">40+</p>
                <p className="text-muted-foreground">Professional Players</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">{formatCedis(5_000)}+</p>
                <p className="text-muted-foreground">Prize Pools</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">500K+</p>
                <p className="text-muted-foreground">Community Members</p>
              </div>
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
}
