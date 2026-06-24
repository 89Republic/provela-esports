'use client';

import { motion, type Variants } from 'motion/react';

const DIRECTIONS: Record<string, { x?: number; y?: number }> = {
  up: { y: 28 },
  down: { y: -28 },
  left: { x: 40 },
  right: { x: -40 },
  none: {},
};

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
  const offset = DIRECTIONS[from];
  const variants: Variants = {
    hidden: { opacity: 0, ...offset },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  );
}
