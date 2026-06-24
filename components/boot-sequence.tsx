'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';

const KEY = 'provela-signal-acquired';
const BOOTLINE = 'SIGNAL ACQUIRED — PROVELA ESPORTS NETWORK';

type Phase = 'boot' | 'flash' | 'done';

export function BootSequence() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<Phase>('boot');
  const [typed, setTyped] = useState('');

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (sessionStorage.getItem(KEY)) return;

    setShow(true);
    document.body.style.overflow = 'hidden';

    const finish = () => {
      sessionStorage.setItem(KEY, '1');
      document.body.style.overflow = '';
      setShow(false);
    };

    if (reduced) {
      const t = setTimeout(finish, 300);
      return () => clearTimeout(t);
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    // type the bootline
    let i = 0;
    const typer = setInterval(() => {
      i += 1;
      setTyped(BOOTLINE.slice(0, i));
      if (i >= BOOTLINE.length) clearInterval(typer);
    }, 18);

    timers.push(setTimeout(() => setPhase('flash'), 760));
    timers.push(setTimeout(() => setPhase('done'), 900));
    timers.push(setTimeout(finish, 1250));

    const skip = () => finish();
    window.addEventListener('keydown', skip);
    window.addEventListener('wheel', skip, { passive: true });
    window.addEventListener('touchstart', skip, { passive: true });
    window.addEventListener('pointerdown', skip);

    return () => {
      clearInterval(typer);
      timers.forEach(clearTimeout);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('wheel', skip);
      window.removeEventListener('touchstart', skip);
      window.removeEventListener('pointerdown', skip);
      document.body.style.overflow = '';
    };
  }, []);

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
              <p className="font-mono text-[0.65rem] tracking-[0.32em] text-ion sm:text-xs">
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
