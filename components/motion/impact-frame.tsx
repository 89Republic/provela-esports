'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

/**
 * Impact accents — a SINGLE soft, low-luminance pulse fired at earned moments.
 *
 * Deliberately NOT a strobe: no full-screen white/red inversion, no rapid
 * multi-frame alternation. One gentle edge-bloom that fades in and out over
 * ~260ms at low opacity, plus an optional micro camera nudge. This keeps the
 * effect well under WCAG 2.3.1 flash thresholds (no >3 flashes/sec, no high
 * luminance-contrast flashing). Disabled entirely under reduced motion.
 */
export type ImpactVariant = 'viewport' | 'element' | 'micro' | 'gold' | 'red-glitch';

// Each variant resolves to a tint only. The shape (soft radial edge-bloom)
// and timing are identical and gentle for all of them.
const TINTS: Record<ImpactVariant, string> = {
  viewport: 'oklch(0.66 0.17 256)',
  element: 'oklch(0.66 0.17 256)',
  micro: 'oklch(0.66 0.17 256)',
  gold: 'oklch(0.84 0.142 85)',
  'red-glitch': 'oklch(0.7 0.14 28)',
};

const COOLDOWN_MS = 900;
const PEAK_OPACITY = 0.18; // low-luminance ceiling

type ImpactContextValue = { fire: (variant?: ImpactVariant) => void };
const ImpactContext = createContext<ImpactContextValue>({ fire: () => {} });

export function useImpact() {
  return useContext(ImpactContext);
}

export function ImpactProvider({ children }: { children: React.ReactNode }) {
  const [tint, setTint] = useState<string | null>(null);
  const [on, setOn] = useState(false);
  const lastFired = useRef(0);
  const reduced = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const fire = useCallback((variant: ImpactVariant = 'element') => {
    const now = performance.now();
    if (now - lastFired.current < COOLDOWN_MS) return;
    if (reduced.current) return;
    lastFired.current = now;

    timers.current.forEach(clearTimeout);
    timers.current = [];

    // a single, subtle camera nudge — not a shake
    const root = document.documentElement;
    root.classList.add('impact-shake');
    timers.current.push(setTimeout(() => root.classList.remove('impact-shake'), 180));

    setTint(variant === 'red-glitch' || variant === 'gold' ? TINTS[variant] : TINTS[variant]);
    setOn(true);
    timers.current.push(setTimeout(() => setOn(false), 130));
  }, []);

  return (
    <ImpactContext.Provider value={{ fire }}>
      {children}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-70"
        style={{
          opacity: on ? PEAK_OPACITY : 0,
          // edge-weighted bloom: brightest at the rim, transparent in the
          // centre, so the screen never goes to a flat bright field.
          background: tint
            ? `radial-gradient(ellipse 120% 120% at 50% 50%, transparent 35%, ${tint} 100%)`
            : 'transparent',
          transition: 'opacity 130ms ease-out',
        }}
      />
    </ImpactContext.Provider>
  );
}

/**
 * Fires a burst once when the wrapped element scrolls into view.
 * Use for section cuts and headline-word reveals.
 */
export function ImpactOnView({
  variant = 'viewport',
  amount = 0.55,
  children,
  className,
}: {
  variant?: ImpactVariant;
  amount?: number;
  children?: React.ReactNode;
  className?: string;
}) {
  const { fire } = useImpact();
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !done.current) {
            done.current = true;
            fire(variant);
            io.disconnect();
          }
        }
      },
      { threshold: amount },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [fire, variant, amount]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
