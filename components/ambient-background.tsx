'use client';

import { useEffect, useRef } from 'react';

export function AmbientScrollBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let frame = 0;

    const update = () => {
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = window.scrollY / maxScroll;
      root.style.setProperty('--scroll-progress', progress.toFixed(4));
      root.style.setProperty('--scroll-y', `${window.scrollY}px`);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ '--scroll-progress': 0, '--scroll-y': '0px' } as React.CSSProperties}
    >
      <div
        className="ambient-scroll-layer absolute -left-[20%] top-[-10%] h-[70vh] w-[70vw] rounded-full bg-[radial-gradient(circle,oklch(0.2_0.01_264/0.22)_0%,transparent_70%)] blur-3xl"
        style={{ transform: 'translate3d(0, calc(var(--scroll-y) * 0.18), 0)' }}
      />
      <div
        className="ambient-scroll-layer absolute -right-[15%] top-[20%] h-[60vh] w-[55vw] rounded-full bg-[radial-gradient(circle,oklch(0.16_0.008_264/0.18)_0%,transparent_72%)] blur-3xl"
        style={{ transform: 'translate3d(0, calc(var(--scroll-y) * -0.12), 0)' }}
      />
      <div
        className="ambient-scroll-layer absolute bottom-[-15%] left-[10%] h-[65vh] w-[60vw] rounded-full bg-[radial-gradient(circle,oklch(0.14_0.007_264/0.16)_0%,transparent_70%)] blur-3xl"
        style={{ transform: 'translate3d(0, calc(var(--scroll-y) * 0.22), 0)' }}
      />
      <div
        className="ambient-scroll-layer absolute left-1/2 top-1/2 h-[50vh] w-[80vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,oklch(0.22_0.01_264/0.1)_0%,transparent_65%)] blur-[80px] opacity-[calc(0.35+var(--scroll-progress)*0.45)]"
        style={{ transform: 'translate3d(-50%, calc(-50% + var(--scroll-y) * 0.08), 0)' }}
      />
      <div
        className="ambient-scroll-layer absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,oklch(0.08_0.004_264/0.45)_50%,transparent_100%)] opacity-[calc(0.2+var(--scroll-progress)*0.3)]"
        style={{ transform: 'translate3d(0, calc(var(--scroll-y) * -0.05), 0)' }}
      />
    </div>
  );
}
