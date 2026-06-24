'use client';

import type { ReactNode } from 'react';

/**
 * Broadcast lower-third ticker. Measured pace, seamless loop.
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
  const doubled = [...items, ...items];
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--section-e)] to-transparent md:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--section-e)] to-transparent md:w-28" />
      <div className={`flex w-max items-center ${speed}`}>
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
