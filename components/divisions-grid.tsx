import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Division } from '@/lib/types';
import { DivisionMonogram, divisionTint } from '@/components/division-monogram';

/**
 * Dense, logo-led divisions grid (Team Liquid "Our Teams" style): one continuous
 * grid whose cells share hairline dividers via a `gap-px` track over a tinted
 * background. Pure CSS hover/transition — no client JS required.
 */
export function DivisionsGrid({ divisions }: { divisions: Division[] }) {
  return (
    <div className="border-l border-t border-cold/10">
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {divisions.map((division) => {
          const { tint } = divisionTint(division.id);
          return (
            <Link
              key={division.id}
              href={`/divisions/${division.id}`}
              style={{ ['--tint' as string]: tint }}
              className="group relative flex h-44 flex-col justify-between overflow-hidden border-b border-r border-cold/10 p-4 ring-1 ring-inset ring-transparent transition-colors duration-300 hover:bg-[var(--tint)]/[0.04] focus-visible:outline-none focus-visible:ring-[var(--tint)]/50 group-hover:ring-[var(--tint)]/25 sm:h-52 sm:p-6"
            >
              {/* tint wash on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_125%,_var(--tint),_transparent_72%)] opacity-0 transition-opacity duration-500 group-hover:opacity-25"
              />
              {/* ghost wordmark watermark */}
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-5 -right-2 select-none font-gaming text-7xl font-bold uppercase leading-none tracking-tighter text-cold/[0.03] transition-colors duration-300 group-hover:text-cold/[0.06]"
              >
                {division.icon}
              </span>

              <DivisionMonogram
                division={division}
                className="text-3xl text-cold/90 transition-[transform,color] duration-300 group-hover:scale-110 group-hover:text-[var(--tint)] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />

              <div className="relative flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-gaming text-base font-bold uppercase tracking-tight text-cold transition-colors duration-300 group-hover:text-[var(--tint)]">
                    {division.name}
                  </h3>
                  <p className="mt-1 truncate text-xs uppercase tracking-[0.18em] text-steel">
                    {division.game}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-steel transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-[var(--tint)] motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
