'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';

const KEY = 'provela-signal-acquired';
const BOOTLINE = 'SIGNAL ACQUIRED — PROVELA ESPORTS NETWORK';

type Phase = 'boot' | 'flash' | 'done';

export function BootSequence() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<Phase>('boot');
  const [typed, setTyped] = useState('');

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (sessionStorage.getItem(KEY)) return;

    setShow(true);
    document.body.style.overflow = 'hidden';

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let typer: ReturnType<typeof setInterval> | undefined;

    const finish = () => {
      if (cancelled) return;
      cancelled = true;
      if (typer) clearInterval(typer);
      timers.forEach(clearTimeout);
      sessionStorage.setItem(KEY, '1');
      document.body.style.overflow = '';
      setShow(false);
    };

    const cleanup = () => {
      cancelled = true;
      if (typer) clearInterval(typer);
      timers.forEach(clearTimeout);
      document.body.style.overflow = '';
    };

    if (reduced) {
      timers.push(setTimeout(finish, 300));
      return cleanup;
    }

    // type the bootline
    let i = 0;
    typer = setInterval(() => {
      if (cancelled) return;
      i += 1;
      setTyped(BOOTLINE.slice(0, i));
      if (i >= BOOTLINE.length && typer) clearInterval(typer);
    }, 18);

    timers.push(setTimeout(() => {
      if (!cancelled) setPhase('flash');
    }, 760));
    timers.push(setTimeout(() => {
      if (!cancelled) setPhase('done');
    }, 900));
    timers.push(setTimeout(finish, 1250));

    const skip = () => finish();
    window.addEventListener('keydown', skip);
    window.addEventListener('wheel', skip, { passive: true });
    window.addEventListener('touchstart', skip, { passive: true });
    window.addEventListener('pointerdown', skip);

    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('wheel', skip);
      window.removeEventListener('touchstart', skip);
      window.removeEventListener('pointerdown', skip);
      cleanup();
    };
  }, [pathname]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="boot"
          className="scanlines fixed inset-0 z-100 flex items-center justify-center overflow-hidden bg-void"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* soft diagonal light sweep — arena doors open (no full-screen flash) */}
          {phase !== 'boot' && (
            <motion.div
              className="absolute inset-0"
              initial={{ x: '-120%' }}
              animate={{ x: '120%' }}
              transition={{ duration: 0.5, ease: [0.7, 0, 0.3, 1] }}
              style={{
                background:
                  'linear-gradient(105deg, transparent 42%, oklch(0.66 0.17 256 / 0.35) 50%, transparent 58%)',
              }}
            />
          )}

          {phase === 'boot' && (
            <div className="flex flex-col items-center gap-6 px-6">
              <motion.div
                animate={{ opacity: [0.2, 1, 0.4, 1, 0.7, 1] }}
                transition={{ duration: 0.7, times: [0, 0.2, 0.35, 0.5, 0.7, 1] }}
              >
                <Image
                  src="/images/LOGOS-03.png"
                  alt="Provela Esports"
                  width={320}
                  height={100}
                  priority
                  className="h-auto w-56 drop-shadow-[0_0_40px_oklch(0.66_0.17_256/0.45)] md:w-72"
                />
              </motion.div>
              <p className="max-w-xs text-center font-mono text-[0.55rem] tracking-[0.18em] text-ion sm:max-w-none sm:text-[0.65rem] sm:tracking-[0.32em] md:text-xs">
                {typed}
                <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-ion align-middle" />
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
