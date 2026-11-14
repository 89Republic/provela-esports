import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Container } from '@/components/layout';
import { getSiteContent } from '@/lib/site-content';
import type { Sponsor } from '@/lib/types';

export const metadata = {
  title: 'Partners | Provela Esports',
  description: 'Meet the brands and organizations that back Provela Esports.',
};

// Black tile so logos exported on a solid black background blend in.
const logoTileClass =
  'flex h-44 w-full items-center justify-center rounded-lg border border-cold/10 bg-black p-8 sm:h-48';

function PartnerLogo({ partner }: { partner: Sponsor }) {
  const logo = (
    <img
      src={partner.logo}
      alt={partner.name}
      className="max-h-full max-w-full object-contain"
    />
  );

  if (!partner.website) {
    return <div className={logoTileClass}>{logo}</div>;
  }

  return (
    <a
      href={partner.website}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${partner.name} website`}
      className={`${logoTileClass} transition-colors duration-300 hover:border-provela/50`}
    >
      {logo}
    </a>
  );
}

function PartnerRow({ partner }: { partner: Sponsor }) {
  return (
    <article className="grid gap-6 border-t border-cold/10 py-10 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-16 md:py-12 lg:gap-24">
      <PartnerLogo partner={partner} />
      {partner.description && (
        <p className="text-base leading-relaxed text-cold/85 sm:text-lg">{partner.description}</p>
      )}
    </article>
  );
}

export default async function PartnersPage() {
  const content = await getSiteContent();

  return (
    <>
      <Navbar />
      <section className="relative mt-16 overflow-hidden bg-[linear-gradient(to_bottom,oklch(0.3_0.12_256/0.55),var(--void-black)_85%)] py-20 sm:py-24 md:py-28">
        <Container className="relative text-center">
          <h1 className="font-gaming text-4xl font-bold leading-[1.05] tracking-tight text-cold sm:text-6xl md:text-7xl">
            Meet Our
            <br />
            Partners
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base text-cold/85 sm:text-lg">
            Provela Esports is powered by partners who believe in the future of competitive gaming in Ghana and beyond.
            Their support helps us run FCX tournaments, grow our divisions, and bring creator-led broadcasts to our
            community.
          </p>
        </Container>
      </section>

      <main className="pb-16 sm:pb-20 md:pb-24">
        <Container>
          {content.sponsors.length === 0 ? (
            <p className="border-t border-cold/10 py-12 text-center text-muted-foreground">
              Partner announcements are coming soon.
            </p>
          ) : (
            <div className="border-b border-cold/10">
              {content.sponsors.map((partner) => (
                <PartnerRow key={partner.id} partner={partner} />
              ))}
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
