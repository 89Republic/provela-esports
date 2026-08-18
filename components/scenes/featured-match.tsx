'use client';

import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from 'motion/react';
import { useImpact } from '@/components/motion/impact-frame';
import type { FeaturedMatch } from '@/lib/types';

export function FeaturedMatchScene({ match }: { match: FeaturedMatch }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const aX = useTransform(scrollYProgress, [0.1, 0.5], ['-14%', '0%']);
  const bX = useTransform(scrollYProgress, [0.1, 0.5], ['14%', '0%']);
  const cardOpacity = useTransform(scrollYProgress, [0.42, 0.55], [0, 1]);
  const cardScale = useTransform(scrollYProgress, [0.42, 0.55], [0.9, 1]);

  const { fire } = useImpact();
  const [fired, setFired] = useState(false);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!fired && v >= 0.5 && v < 0.7) {
      setFired(true);
      fire('red-glitch'); // the page's one sanctioned red flash
    }
  });

  return (
    <section
      ref={ref}
      className="scanlines relative flex min-h-[55vh] items-center overflow-hidden bg-void py-12 sm:min-h-[62vh] sm:py-16 md:min-h-[88vh] md:py-20"
    >
      {/* faceoff backdrop */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_70%_at_50%_50%,oklch(0.18_0.09_256/0.4),transparent_70%)]" />
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-linear-to-b from-transparent via-provela/50 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(oklch(0.84 0.12 218) 1px, transparent 1px), linear-gradient(90deg, oklch(0.84 0.12 218) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center font-mono text-[0.6rem] tracking-[0.25em] text-signal sm:mb-10 sm:text-[0.7rem] sm:tracking-[0.4em]">
          ◢ FEATURED MATCH ◣
        </p>

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-4">
          <motion.span
            style={{ x: reduced ? 0 : aX }}
            className="max-w-full text-center font-gaming text-2xl font-bold uppercase tracking-tight text-cold break-words sm:text-left sm:text-4xl md:text-6xl lg:text-7xl"
          >
            {match.teamA}
          </motion.span>

          <span className="shrink-0 font-gaming text-lg font-bold text-provela sm:text-2xl md:text-4xl">
            VS
          </span>

          <motion.span
            style={{ x: reduced ? 0 : bX }}
            className="max-w-full text-center font-gaming text-2xl font-bold uppercase tracking-tight text-cold break-words sm:text-right sm:text-4xl md:text-6xl lg:text-7xl"
          >
            {match.teamB}
          </motion.span>
        </div>

        <motion.div
          style={{ opacity: reduced ? 1 : cardOpacity, scale: reduced ? 1 : cardScale }}
          className="mx-auto mt-8 max-w-md border border-provela/30 bg-abyss/60 p-4 text-center backdrop-blur-sm sm:mt-12 sm:p-6"
        >
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-steel">
            {match.division}
          </p>
          <p className="mt-2 font-gaming text-2xl font-bold uppercase text-cold">
            {match.when}
          </p>
          <a
            href={match.streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 bg-provela px-6 py-2.5 font-gaming text-xs font-semibold uppercase tracking-[0.2em] text-void transition-shadow hover:shadow-[0_0_30px_oklch(0.66_0.17_256/0.5)]"
          >
            Watch Live ▸
          </a>
        </motion.div>
      </div>
    </section>
  );
}
