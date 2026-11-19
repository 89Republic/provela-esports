import { useSyncExternalStore } from 'react';

/** Matches the CSS `fine:` variant in globals.css: a mouse or trackpad that can hover. */
export const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(FINE_POINTER_QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

/** True when the primary input is a hovering, fine pointer (desktop). */
export function isFinePointer() {
  return typeof window !== 'undefined' && window.matchMedia(FINE_POINTER_QUERY).matches;
}

/**
 * Desktop effects (tilt, hover zoom, magnetic pull, parallax, sideways entrances) gate on
 * this. It is false on the server and during hydration, so markup always starts in the
 * touch state and upgrades on desktop after mount.
 */
export function useFinePointer() {
  return useSyncExternalStore(subscribe, isFinePointer, () => false);
}
