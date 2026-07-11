'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

/**
 * Inertial smooth scroll. Parallax and scroll-scrubbed scenes feel cheap
 * without it. Disabled automatically when the user prefers reduced motion.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return; // native momentum on touch

    let lenis: Lenis | null = null;
    let raf = 0;
    let active = true;

    try {
      lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        smoothWheel: true,
      });

      const loop = (time: number) => {
        if (!active || !lenis) return;
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    } catch {
      return;
    }

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      try {
        lenis?.destroy();
      } catch {
        // Lenis can throw during HMR teardown; ignore.
      }
    };
  }, [pathname]);

  return null;
}
