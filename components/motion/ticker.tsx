'use client';

import type { ReactNode } from 'react';

/**
 * Broadcast lower-third ticker. Measured pace, seamless loop.
 * Each track is at least full viewport width so sparse item sets
 * stay on-screen while scrolling instead of drifting into empty space.
 */
export function Ticker({
  items,
  className = '',
  speed = 'animate-sponsor-marquee',
}: {
  items: ReactNode[];
  className?: string;
  speed?: string;
}) {
  if (items.length === 0) return null;

  const track = (copy: number) => (
    <div
      key={copy}
      className="flex min-w-screen shrink-0 items-center justify-evenly"
      aria-hidden={copy > 0 ? true : undefined}
    >
      {items.map((item, i) => (
        <div key={`${copy}-${i}`} className="flex items-center">
          {item}
        </div>
      ))}
    </div>
  );

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--section-e)] to-transparent md:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--section-e)] to-transparent md:w-28" />
      <div className={`flex w-max items-center ${speed}`}>{[0, 1].map(track)}</div>
    </div>
  );
}
