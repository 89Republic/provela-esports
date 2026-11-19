'use client';

import { createContext, useContext } from 'react';
import { motion } from 'motion/react';
import { useEntrance } from './use-entrance';

/** Desktop offsets: sideways slides read as columns arriving in multi-column layouts. */
const DESKTOP: Record<string, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
};

/** Touch: every entrance is a short rise from below, whatever its desktop direction. */
const TOUCH_RISE = 12;

const RevealSettledContext = createContext(true);

/** True once the nearest enclosing Reveal has finished its entrance (true when there is none). */
export function useRevealSettled() {
  return useContext(RevealSettledContext);
}

/**
 * Generic in-view entrance. Cinematic ease, transform + opacity only.
 */
export function Reveal({
  children,
  from = 'up',
  delay = 0,
  className,
  amount = 0.3,
  once = true,
}: {
  children: React.ReactNode;
  from?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  className?: string;
  amount?: number;
  once?: boolean;
}) {
  const { ref, controls, initial, settled } = useEntrance<HTMLDivElement>({
    touch: { opacity: 0, x: 0, y: from === 'none' ? 0 : TOUCH_RISE },
    desktop: { opacity: 0, ...DESKTOP[from] },
    show: { opacity: 1, x: 0, y: 0 },
    transition: { duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] },
    amount,
    once,
  });

  return (
    <motion.div ref={ref} className={className} initial={initial} animate={controls}>
      <RevealSettledContext.Provider value={settled}>{children}</RevealSettledContext.Provider>
    </motion.div>
  );
}
