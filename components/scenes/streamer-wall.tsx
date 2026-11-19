'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Clock3 } from 'lucide-react';
import type { Streamer } from '@/lib/types';
import { SceneHeader } from '@/components/motion/scene-header';
import { useEntrance } from '@/components/motion/use-entrance';
import { SocialIcon, getPlatformLabel } from '@/components/social-icon';
import { cn, formatCount } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Placeholder photos (e.g. /placeholder-user.jpg) get a monogram tile instead. */
function hasArt(streamer: Streamer) {
  return Boolean(streamer.avatar.trim()) && !/placeholder/i.test(streamer.avatar);
}

/** "PVL Rune" → "RUNE" */
function monogramText(name: string) {
  const words = name.trim().split(/\s+/);
  return (words[words.length - 1] || name).toUpperCase();
}

/**
 * The art, whole: the frame follows the 4:5 portrait art, at full brightness, anchored to
 * the top where poster titles sit. `fit` sizes the monogram against the art's width.
 */
function Art({ streamer, fit }: { streamer: Streamer; fit: number }) {
  if (!hasArt(streamer)) {
    const text = monogramText(streamer.name);
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(149deg,var(--provela-deep)_13%,var(--abyss-navy)_87%)]">
        <span
          aria-hidden
          className="select-none font-gaming font-bold uppercase leading-none tracking-tight text-cold/90"
          // fit the word to the tile: ~0.674em per Chakra Petch Bold capital
          style={{ fontSize: `min(${(fit / (text.length * 0.674)).toFixed(2)}cqw, 40cqw)` }}
        >
          {text}
        </span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={encodeURI(streamer.avatar)}
      alt=""
      loading="lazy"
      decoding="async"
      className="absolute inset-0 size-full object-cover object-top"
    />
  );
}

/** LIVE is the one loud mark (solid red); Scheduled is a quiet dark pill. Both top-left. */
function StatusPill({ live, compact = false }: { live: boolean; compact?: boolean }) {
  const shape = compact
    ? 'gap-1 py-0.75 pl-1.5 pr-1.75 text-[0.625rem] leading-3 tracking-[0.08em]'
    : 'gap-1.5 py-1.25 pl-2 pr-2.5 text-[0.6875rem] leading-3.5 tracking-[0.12em]';
  if (live) {
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full bg-signal font-gaming font-bold uppercase text-white shadow-[0_2px_8px_rgb(0_0_0/0.35)]',
          shape,
        )}
      >
        <span aria-hidden className={cn('live-dot shrink-0 rounded-full bg-white', compact ? 'size-1.25' : 'size-1.5')} />
        Live
      </span>
    );
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-white/14 bg-void/72 font-gaming font-bold uppercase text-cold backdrop-blur-sm',
        shape,
      )}
    >
      <Clock3
        aria-hidden
        absoluteStrokeWidth
        strokeWidth={1.25}
        className={cn('shrink-0', compact ? 'size-2.25' : 'size-2.5')}
      />
      Scheduled
    </span>
  );
}

/**
 * Poster card (two or more per row): art on top with the pill, caption underneath so
 * nothing covers the image. Name with the follower count trailing (the count never
 * shrinks; the name cuts at the end), then the game. With a mouse it keeps the wall's
 * tilt and hover zoom.
 */
function Poster({ streamer, index }: { streamer: Streamer; index: number }) {
  const followers = streamer.followers > 0 ? formatCount(streamer.followers) : '';
  const { ref, controls, initial } = useEntrance<HTMLLIElement>({
    touch: { opacity: 0, y: 12, scaleY: 1 },
    desktop: { opacity: 0, y: 0, scaleY: 0.02 },
    show: { opacity: 1, y: 0, scaleY: 1 },
    transition: { duration: 0.5, delay: index * 0.08, ease: EASE },
    amount: 0.4,
  });

  return (
    <motion.li ref={ref} initial={initial} animate={controls}>
      <Link
        href={`/streamers/${streamer.id}`}
        className={cn(
          'block overflow-hidden rounded-sm border border-cold/10 bg-abyss',
          'fine:transition-transform fine:duration-500 fine:ease-[cubic-bezier(0.16,1,0.3,1)]',
          index % 2 === 0
            ? 'fine:transform-[perspective(1200px)_rotateY(5deg)]'
            : 'fine:transform-[perspective(1200px)_rotateY(-5deg)]',
          'fine:hover:transform-[perspective(1200px)_translateZ(40px)_scale(1.05)]',
        )}
      >
        <div className="@container/art relative aspect-4/5 overflow-hidden">
          <Art streamer={streamer} fit={88} />
          <div className="absolute left-2 top-2">
            <StatusPill live={streamer.status === 'live'} />
          </div>
        </div>
        <div className="flex flex-col gap-1 border-t border-provela/30 px-2.5 pb-3 pt-2.5">
          <p className="flex items-baseline gap-2">
            <span className="min-w-0 flex-1 truncate font-gaming text-sm font-bold uppercase leading-4.5 text-cold">
              {streamer.name}
            </span>
            {followers && (
              <span className="shrink-0 font-mono text-[0.6875rem] leading-3.5 tracking-[0.04em] text-steel tabular-nums">
                {followers}
                <span className="sr-only"> followers</span>
              </span>
            )}
          </p>
          <p className="truncate font-mono text-[0.6875rem] uppercase leading-3.5 text-steel">{streamer.game}</p>
        </div>
      </Link>
    </motion.li>
  );
}

/**
 * List row (when only one card fits: 320 px phones or enlarged text). The text runs the
 * full height of the art: name, game, bio (up to three lines), and the platform with its
 * follower count anchored to the art's bottom edge. No box; space separates the rows,
 * and the row grows past the art with large text instead of clipping.
 */
function Row({ streamer, index }: { streamer: Streamer; index: number }) {
  // The art is a fixed 112 × 140 raster box: with enlarged text the words get the room
  // and the row grows taller, rather than the art doubling and squeezing the text.
  const { ref, controls, initial } = useEntrance<HTMLLIElement>({
    touch: { opacity: 0, y: 12 },
    desktop: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: index * 0.08, ease: EASE },
    amount: 0.4,
  });

  return (
    <motion.li ref={ref} initial={initial} animate={controls}>
      <Link href={`/streamers/${streamer.id}`} className="flex gap-3">
        <div className="@container/art relative h-[140px] w-[112px] shrink-0 overflow-hidden rounded-sm border border-cold/10 bg-abyss">
          <Art streamer={streamer} fit={72} />
          <div className="absolute left-1.5 top-1.5">
            <StatusPill live={streamer.status === 'live'} compact />
          </div>
        </div>
        <div className="flex min-h-[140px] min-w-0 flex-1 flex-col justify-between gap-3 py-0.5">
          <div className="flex flex-col gap-0.5">
            <p className="truncate font-gaming text-base font-bold uppercase leading-5 text-cold">{streamer.name}</p>
            <p className="truncate font-mono text-[0.6875rem] uppercase leading-3.5 text-steel">{streamer.game}</p>
            {streamer.bio && (
              <p className="mt-2.5 line-clamp-3 text-[0.8125rem] leading-4.5 text-body-copy">{streamer.bio}</p>
            )}
          </div>
          <p className="flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase leading-3.5 text-steel">
            <SocialIcon platform={streamer.platform} className="size-3.5 shrink-0" />
            {streamer.followers > 0
              ? `${formatCount(streamer.followers)} followers`
              : getPlatformLabel(streamer.platform)}
          </p>
        </div>
      </Link>
    </motion.li>
  );
}

export function StreamerWall({ streamers }: { streamers: Streamer[] }) {
  return (
    <section className="relative overflow-hidden bg-section-b py-14 sm:py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SceneHeader
          index="05"
          eyebrow="On Air"
          titleLines={['The Broadcast', 'Wall']}
          description="Creator-led programming across the network — live and scheduled."
          align="left"
        />
        {/* Columns follow the space, not a device list: a poster needs ~9.5rem, so two fit
            from a 19.75rem wall (348 px phones); below that, or with enlarged text, list rows. */}
        <div className="@container/wall mt-12">
          <ul className="flex flex-col gap-4 @min-[19.75rem]/wall:hidden">
            {streamers.map((streamer, i) => (
              <Row key={streamer.id} streamer={streamer} index={i} />
            ))}
          </ul>
          <ul className="hidden grid-cols-[repeat(auto-fill,minmax(min(9.5rem,100%),1fr))] gap-x-3 gap-y-4 @min-[19.75rem]/wall:grid min-[24.375rem]:gap-x-4 min-[24.375rem]:gap-y-5 md:grid-cols-4 md:gap-6">
            {streamers.map((streamer, i) => (
              <Poster key={streamer.id} streamer={streamer} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
