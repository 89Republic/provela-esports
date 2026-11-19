import type { Tournament } from '@/lib/types';
import { formatShortDate } from '@/lib/utils';

const latestFirst = (a: { date: string }, b: { date: string }) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

/** "Grand Final" → "Grand final" */
function sentenceCase(label: string) {
  return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
}

/**
 * One context line for the prize plate, from real data: the event and its final.
 * "FCX Pro Series S2 · Grand final 15 Jun". Just the event name when no final is scheduled.
 */
export function prizeContext(tournament: Tournament): string {
  const final = tournament.schedule
    .filter((item) => /\bfinal\b/i.test(item.label) && formatShortDate(item.date))
    .sort(latestFirst)[0];
  // non-breaking spaces keep "Final 19 Jul" on one line
  const when = final && `${sentenceCase(final.label)} ${formatShortDate(final.date)}`.replace(/ /g, '\u00A0');
  return when ? `${tournament.name} · ${when}` : tournament.name;
}

/** "5 Jul" from the schedule's "Registration Closes" item, or '' when there isn't one. */
export function registrationClosesOn(tournament: Tournament): string {
  const item = tournament.schedule.find((s) => /registration\s+close/i.test(s.label));
  return item ? formatShortDate(item.date) : '';
}

/** Registration can't be open once the event is over, whatever the flag says. */
export function isRegistrationOpen(tournament: Tournament): boolean {
  return tournament.registrationOpen && tournament.status !== 'past';
}

/** "0 of 32" when the event has a capacity, otherwise the plain count. */
export function teamsCount(tournament: Tournament): string {
  const registered = tournament.participants.length;
  return tournament.capacity ? `${registered} of ${tournament.capacity}` : `${registered}`;
}
