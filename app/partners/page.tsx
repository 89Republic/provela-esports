import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Container } from '@/components/layout';
import { getImageSize } from '@/lib/image-size';
import { getSiteContent } from '@/lib/site-content';
import type { Sponsor } from '@/lib/types';

export const metadata = {
  title: 'Partners | Provela Esports',
  description: 'Meet the brands and organizations that back Provela Esports.',
};

// Black tile so logos exported on a solid black background blend in. Like the other
// media boxes on the site it's sized in px, so it holds its shape when text is enlarged.
const logoTileClass =
  'flex h-[160px] w-full items-center justify-center rounded-lg border border-border bg-black lg:h-[192px]';

// Every logo gets the same area, capped by a max box, so a wide wordmark and a square
// badge carry equal weight. One box per layout: phone, tablet (md), desktop (lg).
const LOGO_BOXES = {
  compact: { area: 11000, maxWidth: 220, maxHeight: 96 },
  medium: { area: 12000, maxWidth: 200, maxHeight: 88 },
  expanded: { area: 14000, maxWidth: 240, maxHeight: 112 },
};

function logoWidth(aspectRatio: number, box: (typeof LOGO_BOXES)[keyof typeof LOGO_BOXES]) {
  const width = Math.min(box.maxWidth, box.maxHeight * aspectRatio, Math.sqrt(box.area * aspectRatio));
  return `${Math.round(width)}px`;
}

function logoSizeStyle(aspectRatio: number | null): CSSProperties | undefined {
  if (!aspectRatio) return undefined;
  return {
    '--logo-w': logoWidth(aspectRatio, LOGO_BOXES.compact),
    '--logo-w-md': logoWidth(aspectRatio, LOGO_BOXES.medium),
    '--logo-w-lg': logoWidth(aspectRatio, LOGO_BOXES.expanded),
  } as CSSProperties;
}

function PartnerLogo({ partner, aspectRatio }: { partner: Sponsor; aspectRatio: number | null }) {
  // The name is the heading beside the logo, so the image itself is decorative. When the
  // file's proportions are unknown the width variables are unset and the logo fits the tile.
  const logo = (
    <img
      src={partner.logo}
      alt=""
      className="max-h-[70%] max-w-[85%] object-contain w-(--logo-w) md:w-(--logo-w-md) lg:w-(--logo-w-lg)"
      style={logoSizeStyle(aspectRatio)}
    />
  );

  if (!partner.website) {
    return <div className={logoTileClass}>{logo}</div>;
  }

  // A bigger pointer target for the "Visit website" link, which is the one keyboard
  // and screen reader stop.
  return (
    <a
      href={partner.website}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={-1}
      aria-hidden
      className={`${logoTileClass} transition-colors duration-300 hover:border-provela/50`}
    >
      {logo}
    </a>
  );
}

function PartnerRow({ partner, logoAspectRatio }: { partner: Sponsor; logoAspectRatio: number | null }) {
  return (
    <article className="flex flex-col gap-4 border-t border-border py-8 md:grid md:grid-cols-[280px_minmax(0,1fr)] md:items-center md:gap-10 md:py-12 lg:grid-cols-[352px_minmax(0,40rem)] lg:gap-16">
      <PartnerLogo partner={partner} aspectRatio={logoAspectRatio} />
      <div className="flex flex-col gap-1.5 md:gap-2">
        <h2 className="text-xl font-semibold leading-6.5 tracking-normal text-cold">{partner.name}</h2>
        {partner.description && (
          <p className="text-base leading-relaxed text-body-copy sm:text-lg">{partner.description}</p>
        )}
        {partner.website && (
          <a
            href={partner.website}
            target="_blank"
            rel="noopener noreferrer"
            className="relative mt-2.5 inline-flex items-center gap-1.5 self-start text-[0.8125rem] font-semibold uppercase leading-4 tracking-[0.18em] text-provela transition-colors after:absolute after:-inset-x-1 after:-inset-y-3 hover:text-provela/80 md:mt-2"
          >
            Visit website
            <span className="sr-only"> for {partner.name} (opens in a new tab)</span>
            <ArrowUpRight aria-hidden className="h-3.5 w-3.5" strokeWidth={2.25} />
          </a>
        )}
      </div>
    </article>
  );
}

export default async function PartnersPage() {
  const content = await getSiteContent();
  const logoAspectRatios = await Promise.all(
    content.sponsors.map(async (partner) => {
      const size = await getImageSize(partner.logo);
      return size ? size.width / size.height : null;
    }),
  );

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
            <p className="border-t border-border py-12 text-center text-muted-foreground">
              Partner announcements are coming soon.
            </p>
          ) : (
            <div className="border-b border-border">
              {content.sponsors.map((partner, index) => (
                <PartnerRow key={partner.id} partner={partner} logoAspectRatio={logoAspectRatios[index]} />
              ))}
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
