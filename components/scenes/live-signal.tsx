'use client';

import { Ticker } from '@/components/motion/ticker';
import { LIVE_SIGNAL } from '@/lib/constants';

export function LiveSignalStrip() {
  const items = LIVE_SIGNAL.map((item, i) => (
    <div
      key={i}
      className="flex items-center gap-2 whitespace-nowrap border-r border-cold/10 px-4 py-3 font-mono text-[0.62rem] uppercase tracking-[0.12em] sm:gap-3 sm:px-8 sm:py-3.5 sm:text-[0.72rem] sm:tracking-[0.18em]"
    >
      {item.kind === 'live' ? (
        <span className="live-dot inline-block h-2 w-2 rounded-full bg-signal" />
      ) : item.kind === 'next' ? (
        <span className="text-ion">▸</span>
      ) : (
        <span className="h-1 w-1 rounded-full bg-steel/60" />
      )}
      <span
        className={
          item.kind === 'live'
            ? 'text-signal'
            : item.kind === 'next'
              ? 'text-ion'
              : 'text-steel'
        }
      >
        {item.label}:
      </span>
      <span className="text-cold">{item.value}</span>
    </div>
  ));

  return (
    <section className="relative border-y border-cold/10 bg-[var(--section-e)]">
      <Ticker items={items} />
    </section>
  );
}
