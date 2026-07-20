'use client';

import { Ticker } from '@/components/motion/ticker';
import type { Sponsor } from '@/lib/types';

export function SponsorWall({ sponsors }: { sponsors: Sponsor[] }) {
  const items = sponsors.map((sponsor) => (
    <div key={sponsor.id} className="group relative px-6 py-4 sm:px-10">
      <img
        src={sponsor.logo}
        alt={sponsor.name}
        title={sponsor.name}
        className="relative h-10 w-auto max-w-37.5 object-contain opacity-80 transition-opacity duration-300 group-hover:opacity-100 md:h-12"
      />
    </div>
  ));

  return (
    <section className="relative overflow-hidden border-y border-cold/10 bg-section-e py-12">
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.3em] text-steel">
        Backed By
      </p>
      <Ticker items={items} />
    </section>
  );
}
