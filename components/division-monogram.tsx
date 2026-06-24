import type { Division } from '@/lib/types';
import { DIVISION_VISUALS } from '@/lib/constants';

/** Color identity per division, sourced from DIVISION_VISUALS with a provela fallback
 *  for ids that aren't mapped there yet (e.g. provela-sp3, streamers). */
export type DivisionTint = {
  tint: string;
  accentText: string;
  accentBorder: string;
};

const DEFAULT_TINT: DivisionTint = {
  tint: 'oklch(0.66 0.17 256)', // provela-blue
  accentText: 'text-provela',
  accentBorder: 'border-provela/60',
};

export function divisionTint(id: string): DivisionTint {
  const v = DIVISION_VISUALS.find((d) => d.id === id);
  if (!v) return DEFAULT_TINT;
  return { tint: v.tint, accentText: v.accentText, accentBorder: v.accentBorder };
}

/**
 * Division "logo" mark. Renders the division's short icon code as a styled
 * monogram. Built as a single slot so a real logo image/SVG can be dropped in
 * later without touching the surrounding layout — just swap the inner span.
 */
export function DivisionMonogram({
  division,
  className = '',
}: {
  division: Division;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`inline-flex select-none items-center justify-center font-gaming font-bold uppercase leading-none tracking-tight ${className}`}
    >
      {division.icon}
    </span>
  );
}
