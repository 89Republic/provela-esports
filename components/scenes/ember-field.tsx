'use client';

import { useEffect, useRef } from 'react';

type Ember = { x: number; y: number; r: number; vy: number; vx: number; a: number };

/**
 * Drifting blue embers. The scene's one always-on ambient motion layer.
 * Mouse position nudges drift. Skipped under reduced motion.
 */
export function EmberField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coarse = window.matchMedia('(pointer: coarse)').matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    const count = coarse ? 26 : 56;
    let embers: Ember[] = [];
    const mouse = { x: 0.5, y: 0.5 };

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      w = rect?.width ?? window.innerWidth;
      h = rect?.height ?? window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      embers = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.4,
        vy: -(Math.random() * 0.35 + 0.08),
        vx: (Math.random() - 0.5) * 0.18,
        a: Math.random() * 0.5 + 0.25,
      }));
    };

    resize();
    seed();

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const e of embers) {
        e.y += e.vy;
        e.x += e.vx + (mouse.x - 0.5) * 0.25;
        if (e.y < -10) {
          e.y = h + 10;
          e.x = Math.random() * w;
        }
        if (e.x < -10) e.x = w + 10;
        if (e.x > w + 10) e.x = -10;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(86, 216, 255, ${e.a})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(47, 140, 255, 0.7)';
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onMove = (ev: MouseEvent) => {
      mouse.x = ev.clientX / window.innerWidth;
      mouse.y = ev.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
