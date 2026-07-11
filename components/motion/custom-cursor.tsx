'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useMotionValue, useSpring } from 'motion/react';

/**
 * Mono crosshair dot that expands into a bracket-cornered reticle over
 * interactive elements. Desktop pointers only.
 */
export function CustomCursor() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 34, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 500, damping: 34, mass: 0.3 });

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (coarse || reduced) return; // touch devices keep the native pointer
    setEnabled(true);
    document.documentElement.classList.add('has-custom-cursor');

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement;
      setActive(!!t.closest('a, button, [data-cursor="target"], input, [role="button"]'));
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    return () => {
      setEnabled(false);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [pathname, x, y]);

  if (!enabled) return null;

  const size = active ? 38 : 8;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-90 hidden md:block"
      style={{ x: sx, y: sy, mixBlendMode: 'difference' }}
    >
      <motion.div
        className="relative -translate-x-1/2 -translate-y-1/2 text-white"
        animate={{ width: size, height: size, scale: down ? 0.8 : 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      >
        {active ? (
          <>
            <span className="absolute left-0 top-0 h-2 w-2 border-l border-t border-white" />
            <span className="absolute right-0 top-0 h-2 w-2 border-r border-t border-white" />
            <span className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-white" />
            <span className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-white" />
            <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
          </>
        ) : (
          <span className="block h-full w-full rounded-full bg-white" />
        )}
      </motion.div>
    </motion.div>
  );
}
