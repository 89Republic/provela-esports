'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import type { CommunityPulseContent } from '@/lib/types';
import { Odometer } from '@/components/motion/odometer';
import { SceneHeader } from '@/components/motion/scene-header';
import { Magnetic } from '@/components/motion/magnetic-button';

function FeedColumn({ items, offset }: { items: string[]; offset: number }) {
  const reduced = useReducedMotion();
  const doubled = [...items, ...items];
  return (
    <div className="relative h-full overflow-hidden">
      <motion.div
        className="flex flex-col gap-3"
        animate={reduced ? undefined : { y: ['0%', '-50%'] }}
        transition={{ duration: 24 + offset * 6, ease: 'linear', repeat: Infinity }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="whitespace-nowrap font-mono text-[0.6rem] uppercase tracking-[0.15em] text-cold/[0.06]"
          >
            ▸ {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function CommunityPulse({ content }: { content: CommunityPulseContent }) {
  return (
    <section className="relative overflow-hidden bg-[var(--section-e)] py-14 sm:py-20 md:py-28">
      {/* drifting data stream behind — desktop only */}
      <div className="pointer-events-none absolute inset-0 hidden grid-cols-3 gap-8 px-6 md:grid">
        <FeedColumn items={content.feed} offset={0} />
        <FeedColumn items={[...content.feed].reverse()} offset={1} />
        <FeedColumn items={content.feed} offset={2} />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,oklch(0.16_0.06_256/0.45),var(--section-e)_75%)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <SceneHeader
          index="07"
          eyebrow={content.eyebrow}
          titleLines={content.titleLines}
        />

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-4">
          {content.stats.map((stat) => (
            <div key={stat.label} className="border border-cold/10 bg-void/40 px-3 py-4 fine:backdrop-blur-sm sm:px-4 sm:py-6">
              <span className="block font-gaming text-2xl font-bold text-provela sm:text-3xl md:text-4xl">
                <Odometer value={stat.value} />
                {stat.suffix}
              </span>
              <span className="mt-2 block font-mono text-[0.6rem] uppercase tracking-[0.2em] text-steel">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <Magnetic strength={0.25}>
          <Link
            href={content.ctaHref}
            className="cta-sweep relative mt-12 inline-flex overflow-hidden bg-provela px-8 py-3.5 font-gaming text-sm font-semibold uppercase tracking-[0.2em] text-void shadow-[0_0_30px_oklch(0.66_0.17_256/0.4)]"
          >
            {content.ctaLabel}
          </Link>
        </Magnetic>
      </div>
    </section>
  );
}
