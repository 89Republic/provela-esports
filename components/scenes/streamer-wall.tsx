'use client';

import { motion } from 'motion/react';
import type { Streamer } from '@/lib/types';
import { SceneHeader } from '@/components/motion/scene-header';

function Monitor({ streamer, index }: { streamer: Streamer; index: number }) {
  const live = streamer.status === 'live';
  const tilt = index % 2 === 0 ? 5 : -5;
  return (
    <motion.a
      href={streamer.liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-4/3 overflow-hidden rounded-md border border-cold/10 bg-abyss"
      initial={{ scaleY: 0.02, opacity: 0 }}
      whileInView={{ scaleY: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.05, rotateY: 0, z: 40 }}
      style={{ rotateY: tilt, transformStyle: 'preserve-3d' }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70 transition-all duration-500 group-hover:opacity-100 group-hover:saturate-150"
        style={{ backgroundImage: `url("${encodeURI(streamer.avatar)}")` }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-void via-void/30 to-transparent" />
      {/* scanline overlay */}
      <div className="scanlines absolute inset-0" />

      {/* live badge */}
      <div className="absolute right-3 top-3 flex items-center gap-1.5">
        {live ? (
          <>
            <span className="live-dot h-2 w-2 rounded-full bg-signal" />
            <span className="font-mono text-[0.6rem] tracking-[0.2em] text-signal">LIVE</span>
          </>
        ) : (
          <span className="font-mono text-[0.6rem] tracking-[0.2em] text-steel">SCHEDULED</span>
        )}
      </div>

      {/* lower-third */}
      <div className="absolute inset-x-0 bottom-0 border-t border-provela/30 bg-void/70 px-3 py-2.5 backdrop-blur-sm">
        <p className="truncate font-gaming text-sm font-bold uppercase text-cold">
          {streamer.name}
        </p>
        <p className="truncate font-mono text-[0.6rem] uppercase tracking-[0.15em] text-steel">
          {streamer.game} · {(streamer.followers / 1000).toFixed(0)}K
        </p>
      </div>
    </motion.a>
  );
}

export function StreamerWall({ streamers }: { streamers: Streamer[] }) {
  return (
    <section className="relative overflow-hidden bg-section-b py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SceneHeader
          index="05"
          eyebrow="On Air"
          titleLines={['The Broadcast', 'Wall']}
          description="Creator-led programming across the network — live and scheduled."
          align="left"
        />
        <div
          className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
          style={{ perspective: '1200px' }}
        >
          {streamers.map((streamer, i) => (
            <Monitor key={streamer.id} streamer={streamer} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
