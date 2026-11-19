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
}: {
  index?: string;
  /** Leave out when it would only repeat the title. */
  eyebrow?: string;
  titleLines: string[];
  description?: string;
  align?: 'center' | 'left';
  flickerWords?: string[];
}) {
  const isCenter = align === 'center';
  return (
    <div className={isCenter ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl text-left'}>
      {eyebrow && (
        <Reveal from="none">
          <div className={`mb-5 flex items-center gap-2.5 ${isCenter ? 'justify-center' : 'justify-start'}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-provela" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-provela">{eyebrow}</span>
          </div>
        </Reveal>
      )}

      {/* One fluid size for every section headline on phones (32–44 px), fixed sizes from md.
          The lines flow at every width, so the title sits on one line when it fits. */}
      <KineticHeading
        as="h2"
        lines={titleLines}
        flickerWords={flickerWords}
        flow
        className="text-balance font-gaming text-[clamp(2rem,10vw,2.75rem)] font-bold uppercase leading-[0.95] tracking-tight text-cold md:text-5xl lg:text-6xl"
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
