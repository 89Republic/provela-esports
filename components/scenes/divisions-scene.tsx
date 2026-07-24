'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'motion/react';
import type { Division } from '@/lib/types';
import { DivisionMonogram, divisionTint } from '@/components/division-monogram';
import { KineticHeading } from '@/components/motion/kinetic-heading';
import { Reveal } from '@/components/motion/reveal';
import { getDivisionHeroImage } from '@/lib/utils';

/** Max rotation (deg) for the side columns at full scroll progress. */
const TILT = 24;
/** How far the side columns recede on the z-axis (px). */
const DEPTH = -70;

/**
 * One division tile. The visual transform (a scroll-linked 3D "perspective wall"
 * rotation) lives on the wrapper; the inner Link keeps its own CSS hover state.
 * Left column tilts one way, right column the inverse, center stays flat — the
 * tilt eases in as the grid scrolls into view. Disabled below `lg` and for
 * reduced-motion users, where it renders as a flat grid.
 */
function PerspectiveTile({
  division,
  column,
  progress,
  enabled,
}: {
  division: Division;
  column: 0 | 1 | 2;
  progress: MotionValue<number>;
  enabled: boolean;
}) {
  const { tint } = divisionTint(division.id);
  const heroImage = encodeURI(getDivisionHeroImage(division));
  const isSide = column !== 1;
  const target = column === 0 ? TILT : column === 2 ? -TILT : 0;
  const depth = isSide ? DEPTH : 0;

  const rotateY = useTransform(progress, [0, 1], [0, target]);
  const translateZ = useTransform(progress, [0, 1], [0, depth]);
  // depth shadow easing in, cast outward toward each end. On the near-black
  // background a dark shadow is invisible, so we use a luminous provela glow
  // (the dark-UI equivalent of a drop shadow) plus a dark contact layer.
  const shadowFrom = '0px 0px 0px rgba(47,140,255,0), 0px 0px 0px rgba(0,0,0,0)';
  const shadowTo = isSide
    ? `${column === 0 ? '-32px' : '32px'} 28px 55px -18px rgba(47,140,255,0.22), ${
        column === 0 ? '-14px' : '14px'
      } 22px 40px -20px rgba(0,0,0,0.35)`
    : shadowFrom;
  const boxShadow = useTransform(progress, [0, 1], [shadowFrom, shadowTo]);

  return (
    <motion.div
      className="rounded-xl [transform-style:preserve-3d]"
      style={{
        rotateY: enabled ? rotateY : 0,
        translateZ: enabled ? translateZ : 0,
        boxShadow: enabled ? boxShadow : undefined,
      }}
    >
      <Link
        href={`/divisions/${division.id}`}
        aria-label={`${division.name} — ${division.game}`}
        style={{ ['--tint' as string]: tint }}
        className="group relative flex h-36 items-center justify-center overflow-hidden rounded-xl border border-cold/10 bg-cold/[0.03] transition-[background-color,border-color,transform] duration-300 hover:-translate-y-1 hover:border-[var(--tint)]/40 focus-visible:outline-none focus-visible:border-[var(--tint)]/60 sm:h-44 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      >
        <span
          aria-hidden
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          style={{ backgroundImage: `url("${heroImage}")` }}
        />
        <span aria-hidden className="absolute inset-0 bg-black/55 transition-colors duration-300 group-hover:bg-black/40" />
        {/* tint wash on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tint),_transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-[0.18]"
        />
        <DivisionMonogram
          division={division}
          className="relative text-4xl text-cold drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] transition-[transform,color] duration-300 group-hover:scale-110 group-hover:text-[var(--tint)] sm:text-5xl motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </Link>
    </motion.div>
  );
}

/**
 * Homepage divisions section — a logo-only tile grid (Team Liquid "Ride With The
 * Cavalry" style) with a scroll-linked 3D perspective-wall effect on desktop.
 */
export function DivisionsScene({ divisions }: { divisions: Division[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [isWide, setIsWide] = useState(false);

  // The 3D tilt only makes sense in the 3-column (lg) layout.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsWide(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const enabled = isWide && !reduced;

  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ['start end', 'center center'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
    restDelta: 0.001,
  });

  return (
    <section className="relative overflow-hidden bg-void py-14 sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* two-column header */}
        <div className="grid gap-8 md:grid-cols-2 md:items-end md:gap-12">
          <div>
            <Reveal from="none">
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-provela" />
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-provela">
                  Divisions
                </span>
              </div>
            </Reveal>
            <KineticHeading
              as="h2"
              lines={['Pick Your', 'World']}
              className="mt-5 font-gaming text-4xl font-bold uppercase leading-[0.95] tracking-tight text-cold sm:text-5xl md:text-6xl"
            />
          </div>

          <Reveal from="up" delay={0.1}>
            <div className="md:flex md:justify-end md:pb-2">
              <Link
                href="/divisions"
                className="group inline-flex items-center gap-2 font-gaming text-sm font-semibold uppercase tracking-[0.2em] text-victory transition-colors hover:text-victory/80"
              >
                View all divisions
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* logo tile grid — perspective container */}
        <div
          ref={gridRef}
          className="mt-12 grid grid-cols-2 gap-3 [perspective:1600px] sm:gap-4 lg:grid-cols-3"
        >
          {divisions.map((division, i) => (
            <PerspectiveTile
              key={division.id}
              division={division}
              column={(i % 3) as 0 | 1 | 2}
              progress={progress}
              enabled={enabled}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
