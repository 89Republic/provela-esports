import type { Division } from '@/lib/types';
import { DivisionCard } from '@/components/cards';
import { GridSection } from '@/components/layout';

/**
 * User-facing divisions listing — same card shell as elsewhere, with the
 * division hero (first media image) as the cover.
 */
export function DivisionsGrid({ divisions }: { divisions: Division[] }) {
  return (
    <GridSection cols={3}>
      {divisions.map((division) => (
        <DivisionCard key={division.id} division={division} />
      ))}
    </GridSection>
  );
}
