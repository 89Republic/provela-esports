import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHeader, Container } from '@/components/layout';
import { getSiteContent } from '@/lib/site-content';
import type { Sponsor } from '@/lib/types';
import { ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Partners | Provela Esports',
  description: 'Meet the brands and organizations that back Provela Esports.',
};

const cardClass =
  'group flex h-full flex-col items-center justify-between gap-5 rounded-lg border border-border bg-card p-6 text-center transition-all duration-300';

function PartnerCard({ partner }: { partner: Sponsor }) {
  const content = (
    <>
      <div className="flex h-24 w-full items-center justify-center">
        <img
          src={partner.logo}
          alt={partner.name}
          className="max-h-full max-w-full object-contain opacity-90 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>
      <div>
        <p className="font-gaming text-sm font-semibold uppercase tracking-wide text-foreground">{partner.name}</p>
        {partner.website && (
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">
            Visit website
            <ExternalLink className="size-3" />
          </span>
        )}
      </div>
    </>
  );

  if (!partner.website) {
    return <div className={cardClass}>{content}</div>;
  }

  return (
    <a
      href={partner.website}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cardClass} hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10`}
    >
      {content}
    </a>
  );
}

export default async function PartnersPage() {
  const content = await getSiteContent();

  return (
    <>
      <Navbar />
      <PageHeader
        title="Partners"
        subtitle="The brands and organizations backing Provela Esports"
      />
      <main className="py-12 sm:py-16 md:py-20">
        <Container>
          <div className="mb-12 max-w-3xl space-y-4">
            <p className="text-lg text-muted-foreground">
              Provela Esports is powered by partners who believe in the future of competitive gaming in Ghana and beyond.
              Their support helps us run FCX tournaments, grow our divisions, and bring creator-led broadcasts to our
              community.
            </p>
            <p className="text-lg text-muted-foreground">
              We&apos;re proud to compete alongside them.
            </p>
          </div>

          {content.sponsors.length === 0 ? (
            <p className="text-muted-foreground">Partner announcements are coming soon.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {content.sponsors.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
