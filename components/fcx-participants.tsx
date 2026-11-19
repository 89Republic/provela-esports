import type { Tournament } from '@/lib/types';
import { isRegistrationOpen, registrationClosesOn } from '@/lib/tournament-display';
import { cn } from '@/lib/utils';

/** One segment per slot reads well up to ~40 slots at 320 px; bigger events get one bar. */
const MAX_SEGMENTS = 40;

/** Shared with the Quick Info button so the page has one Register Team look. */
export const registerButtonClass =
  'w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90';

/** Registered teams as plain rows: name, then record. One record, one row; no placeholders. */
export function RegisteredTeams({ participants }: { participants: Tournament['participants'] }) {
  if (participants.length === 0) return null;
  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-card">
      {participants.map((p) => (
        <li key={p.id} className="flex items-center gap-3 px-4 py-3">
          <span className="min-w-0 flex-1 truncate text-base text-foreground">{p.name}</span>
          {p.record && (
            <span className="shrink-0 text-[0.8125rem] leading-4.5 text-muted-foreground tabular-nums">
              Record {p.record}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function SlotsMeter({ capacity, taken }: { capacity: number; taken: number }) {
  if (capacity > MAX_SEGMENTS) {
    return (
      <div aria-hidden className="h-2 rounded-[1px] bg-border md:h-2.5">
        <div
          className="h-full rounded-[1px] bg-primary"
          style={{ width: `${Math.min(100, (taken / capacity) * 100)}%` }}
        />
      </div>
    );
  }
  return (
    <div aria-hidden className="flex gap-0.5 md:gap-0.75">
      {Array.from({ length: capacity }, (_, i) => (
        <span
          key={i}
          className={cn('h-2 min-w-0 flex-1 rounded-[1px] md:h-2.5', i < taken ? 'bg-primary' : 'bg-border')}
        />
      ))}
    </div>
  );
}

/**
 * One card for the open slots instead of a card per empty slot: slots left as the figure,
 * a meter with one segment per slot, when registration closes, and Register Team.
 * States: open / filling, full (no button), closed (title replaces the figure).
 * Desktop lays it out wide without the button; the sticky Quick Info holds the only one there.
 */
export function SlotsCard({ tournament }: { tournament: Tournament & { capacity: number } }) {
  const { capacity } = tournament;
  const taken = Math.min(tournament.participants.length, capacity);
  const left = capacity - taken;
  const open = isRegistrationOpen(tournament);
  const closesOn = registrationClosesOn(tournament);

  const teamsIn = taken === 0 ? 'No teams yet' : `${taken} of ${capacity} teams in`;
  const status = !open
    ? closesOn && `Closed ${closesOn}`
    : left === 0
      ? 'Registration is full'
      : closesOn && `Registration closes ${closesOn}`;
  // Each segment stays whole, so a narrow card breaks the line only at the "·".
  const meta = [teamsIn, status].filter((part): part is string => Boolean(part));

  return (
    <div className="grid gap-4 rounded-lg border border-border bg-card p-5 md:grid-cols-[auto_1fr] md:items-baseline md:p-6">
      {open ? (
        <p className="flex items-baseline gap-2.5 whitespace-nowrap">
          <span className="text-5xl font-bold leading-none tracking-[-0.01em] text-foreground tabular-nums">
            {left}
          </span>
          <span className="text-base text-muted-foreground">{left === 1 ? 'slot left' : 'slots left'}</span>
        </p>
      ) : (
        <p className="text-base font-semibold leading-5.5 text-foreground">Registration closed</p>
      )}

      <div className="order-2 md:order-3 md:col-span-2">
        <SlotsMeter capacity={capacity} taken={taken} />
      </div>

      <p className="order-3 text-[0.8125rem] leading-4.5 text-muted-foreground md:order-2 md:justify-self-end md:text-right">
        {meta.map((part, i) => (
          <span key={part} className="whitespace-nowrap">
            {i > 0 && ' · '}
            {part}
          </span>
        ))}
      </p>

      {open && left > 0 && (
        <button type="button" className={cn(registerButtonClass, 'order-4 md:hidden')}>
          Register Team
        </button>
      )}
    </div>
  );
}
