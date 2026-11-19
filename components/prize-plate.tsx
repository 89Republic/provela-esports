'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { Trophy } from 'lucide-react';
import { useRevealSettled } from '@/components/motion/reveal';
import { cn, formatPrizeParts } from '@/lib/utils';

/** Pause between the plate settling into place and the sheen starting. */
const SHEEN_DELAY_MS = 150;

/**
 * The prize as a contained gold plate: a deep-gold shade fading into the card, the figure
 * large in gold with the currency small and muted beside it, and one context line.
 * A single warm sheen crosses it the first time it is 60% in view, on every device.
 *
 * `standalone` draws its own gold border (Command Center); `header` sits at the top of a
 * card that already has a border (event page Quick Info).
 */
export function PrizePlate({
  prizePool,
  context,
  variant = 'standalone',
  className,
}: {
  prizePool: string;
  context?: string;
  variant?: 'standalone' | 'header';
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const settled = useRevealSettled();
  const [play, setPlay] = useState(false);
  const { unit, amount } = formatPrizeParts(prizePool);

  useEffect(() => {
    if (!inView || !settled || play) return;
    const id = setTimeout(() => setPlay(true), SHEEN_DELAY_MS);
    return () => clearTimeout(id);
  }, [inView, settled, play]);

  return (
    <div
      ref={ref}
      className={cn(
        '@container/plate relative overflow-hidden bg-[linear-gradient(116deg,var(--victory-deep)_11%,var(--victory-shade)_46%,var(--card)_89%)]',
        variant === 'standalone' && 'border border-victory/28',
        className,
      )}
    >
      <span aria-hidden className="prize-sheen" data-play={play || undefined} />
      <div className="relative flex flex-col gap-3 px-5 pb-5.5 pt-5">
        <p className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase leading-3.5 tracking-[0.18em] text-victory-muted">
          <Trophy aria-hidden className="size-4 shrink-0 text-victory" />
          Prize Pool
        </p>
        <p className="flex flex-wrap items-baseline gap-x-1.5 font-gaming">
          {unit && (
            <span className="text-[1.375rem] font-semibold leading-7 text-victory-muted">{unit}</span>
          )}
          <span className="text-[2.25rem] font-bold leading-none tracking-[-0.01em] text-victory tabular-nums @min-[17.5rem]/plate:text-5xl">
            {amount}
          </span>
        </p>
        {context && (
          <p className="text-[0.8125rem] leading-4.5 text-victory-ink">{context}</p>
        )}
      </div>
    </div>
  );
}
