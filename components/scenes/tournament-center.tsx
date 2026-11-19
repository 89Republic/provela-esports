'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import type { Tournament } from '@/lib/types';
import { prizeContext } from '@/lib/tournament-display';
import { PrizePlate } from '@/components/prize-plate';
import { SceneHeader } from '@/components/motion/scene-header';
import { Reveal } from '@/components/motion/reveal';
import { ImpactOnView } from '@/components/motion/impact-frame';
import { Magnetic } from '@/components/motion/magnetic-button';

function useCountdown(target: string) {
  const [parts, setParts] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, new Date(target).getTime() - Date.now());
      setParts({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return parts;
}

// schematic 8 → 4 → 2 → 1 connectors
const CONNECTORS = [
  'M70 30 H120 M70 70 H120 M120 30 V70 M120 50 H150',
  'M70 110 H120 M70 150 H120 M120 110 V150 M120 130 H150',
  'M70 190 H120 M70 230 H120 M120 190 V230 M120 210 H150',
  'M70 270 H120 M70 310 H120 M120 270 V310 M120 290 H150',
  'M150 50 H200 M150 130 H200 M200 50 V130 M200 90 H240',
  'M150 210 H200 M150 290 H200 M200 210 V290 M200 250 H240',
  'M240 90 H290 M240 250 H290 M290 90 V250 M290 170 H330',
];

function Bracket() {
  return (
    <svg viewBox="0 0 360 340" className="h-auto w-full" fill="none">
      {/* slot ticks */}
      {[30, 70, 110, 150, 190, 230, 270, 310].map((y) => (
        <rect key={y} x={30} y={y - 6} width={40} height={12} rx={1} className="fill-cold/5 stroke-cold/15" strokeWidth={0.5} />
      ))}
      {CONNECTORS.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          className="stroke-provela"
          strokeWidth={1.2}
          initial={{ pathLength: 0, opacity: 0.3 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: i * 0.12, ease: 'easeInOut' }}
        />
      ))}
      {/* champion node */}
      <motion.circle
        cx={345}
        cy={170}
        r={9}
        className="fill-victory/20 stroke-victory"
        strokeWidth={1.2}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.1, type: 'spring', stiffness: 200 }}
        style={{ transformOrigin: '345px 170px' }}
      />
    </svg>
  );
}

export function TournamentCenter({ tournaments }: { tournaments: Tournament[] }) {
  const active =
    tournaments.find((t) => t.status === 'active') ??
    tournaments.find((t) => t.status === 'upcoming') ??
    tournaments[0];

  // Count down to the nearest upcoming dated milestone across all events so
  // the clock stays live even after the active event's own dates have passed.
  const nearestFuture = tournaments
    .flatMap((t) => [t.startDate, t.endDate, ...t.schedule.map((s) => s.date)])
    .map((d) => new Date(d).getTime())
    .filter((ms) => Number.isFinite(ms) && ms > Date.now())
    .sort((a, b) => a - b)[0];
  const finalDate = nearestFuture
    ? new Date(nearestFuture).toISOString()
    : (active?.endDate ?? new Date().toISOString());
  const { d, h, m, s } = useCountdown(finalDate);

  if (!active) return null;

  return (
    <section className="relative overflow-hidden bg-section-c py-14 sm:py-20 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,oklch(0.2_0.1_85/0.12),transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SceneHeader
          index="03"
          eyebrow="Tournament Command"
          titleLines={['The Command', 'Center']}
          description="Live brackets, prize pools, and match operations — running right now."
          align="left"
          accent="text-victory"
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.4fr_1fr]">
          {/* left: tournament identity */}
          <Reveal from="left">
            <div className="border border-cold/10 bg-abyss/50 p-6 fine:backdrop-blur-sm">
              <span className="inline-block bg-provela/15 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-provela">
                ● {active.status}
              </span>
              <h3 className="mt-4 font-gaming text-2xl font-bold uppercase text-cold">
                {active.name}
              </h3>
              <p className="mt-3 text-sm text-steel">{active.format}</p>
              <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-steel">
                {active.game}
              </p>
            </div>
          </Reveal>

          {/* center: bracket */}
          <Reveal from="none" delay={0.1}>
            <div className="border border-cold/10 bg-void/40 p-6">
              <p className="mb-4 text-center font-mono text-[0.65rem] uppercase tracking-[0.3em] text-steel">
                Live Bracket
              </p>
              <Bracket />
            </div>
          </Reveal>

          {/* right: countdown + prize + cta */}
          <Reveal from="right">
            <div className="flex h-full flex-col gap-4">
              <div className="border border-cold/10 bg-abyss/50 p-5">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-steel">
                  Grand Final In
                </p>
                <div className="mt-3 grid grid-cols-4 gap-1.5 text-center sm:gap-2">
                  {[
                    ['D', d],
                    ['H', h],
                    ['M', m],
                    ['S', s],
                  ].map(([label, val]) => (
                    <div key={label as string} className="bg-void/60 py-1.5 sm:py-2">
                      <span className="block font-gaming text-xl font-bold tabular-nums text-cold sm:text-2xl">
                        {String(val).padStart(2, '0')}
                      </span>
                      <span className="font-mono text-[0.55rem] tracking-[0.2em] text-steel">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* desktop keeps its gold edge flash; every device gets the plate's sheen */}
              <ImpactOnView variant="gold" amount={0.8}>
                <PrizePlate prizePool={active.prizePool} context={prizeContext(active)} />
              </ImpactOnView>

              <Magnetic strength={0.2}>
                <Link
                  href={`/fcx/${active.id}`}
                  className="block bg-provela px-6 py-3.5 text-center font-gaming text-xs font-semibold uppercase tracking-[0.2em] text-void transition-shadow hover:shadow-[0_0_30px_oklch(0.66_0.17_256/0.5)]"
                >
                  {active.registrationOpen ? 'Register Now' : 'View Bracket'}
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
