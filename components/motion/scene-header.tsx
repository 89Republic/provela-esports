'use client';

import { KineticHeading } from './kinetic-heading';
import { Reveal } from './reveal';

/**
 * Shared scene chrome: a clean accent eyebrow, a kinetic headline, and an
 * optional supporting line.
 */
export function SceneHeader({
  eyebrow,
  titleLines,
  description,
  align = 'center',
  flickerWords = [],
  accent = 'text-provela',
}: {
  index?: string;
  eyebrow: string;
  titleLines: string[];
  description?: string;
  align?: 'center' | 'left';
  flickerWords?: string[];
  accent?: string;
}) {
  const isCenter = align === 'center';
  return (
    <div className={isCenter ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl text-left'}>
      <Reveal from="none">
        <div className={`flex items-center gap-2.5 ${isCenter ? 'justify-center' : 'justify-start'}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${accent.replace('text-', 'bg-')}`} />
          <span className={`text-xs font-semibold uppercase tracking-[0.25em] ${accent}`}>
            {eyebrow}
          </span>
        </div>
      </Reveal>

      <KineticHeading
        as="h2"
        lines={titleLines}
        flickerWords={flickerWords}
        className="mt-5 font-gaming text-3xl font-bold uppercase leading-[0.95] tracking-tight text-cold sm:text-4xl md:text-5xl lg:text-6xl"
      />

      {description && (
        <Reveal from="up" delay={0.1}>
          <p
            className={`mt-5 text-base text-steel sm:text-lg ${
              isCenter ? 'mx-auto max-w-xl' : 'max-w-xl'
            }`}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
