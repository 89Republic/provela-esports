'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';
import { KineticHeading } from '@/components/motion/kinetic-heading';
import { Magnetic } from '@/components/motion/magnetic-button';
import { ImpactOnView } from '@/components/motion/impact-frame';
import { EmberField } from './ember-field';

export function HeroScene() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // pointer tilt
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spx = useSpring(px, { stiffness: 60, damping: 18 });
  const spy = useSpring(py, { stiffness: 60, damping: 18 });

  // Pointer parallax follows a mouse only; on touch it made the scene jump as a scroll began.
  // Phones keep the scroll dolly below.
  const onPointer = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== 'mouse') return;
    px.set((e.clientX / window.innerWidth - 0.5) * 2);
    py.set((e.clientY / window.innerHeight - 0.5) * 2);
  };

  // scroll dolly (start of page only)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.22]);
  const floorBright = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  // per-layer tilt amounts (deep = subtle, foreground = strong)
  const l1x = useTransform(spx, (v) => v * -6);
  const l1y = useTransform(spy, (v) => v * -4);
  const l2x = useTransform(spx, (v) => v * -14);
  const l2y = useTransform(spy, (v) => v * -10);
  const l4x = useTransform(spx, (v) => v * 16);
  const l5x = useTransform(spx, (v) => v * 34);
  const l5y = useTransform(spy, (v) => v * 22);

  return (
    <section
      ref={ref}
      onPointerMove={onPointer}
      className="scanlines relative min-h-[100dvh] overflow-hidden bg-void sm:min-h-screen"
    >
      {/* L1 — arena architecture (deepest) */}
      <motion.div className="absolute inset-0" style={{ scale: bgScale }}>
        <motion.div className="absolute inset-0" style={{ x: l1x, y: l1y }}>
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/provela-hero-bg.png')" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,oklch(0.04_0.01_255/0.78)_0%,oklch(0.05_0.012_255/0.55)_45%,oklch(0.045_0.012_255/0.92)_100%)]" />
        </motion.div>
      </motion.div>

      {/* L2 — holographic floor grid */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ x: l2x, y: l2y }}>
        <div
          className="absolute inset-x-0 bottom-0 top-1/3 opacity-[0.16]"
          style={{
            backgroundImage:
              'linear-gradient(oklch(0.84 0.12 218 / 0.6) 1px, transparent 1px), linear-gradient(90deg, oklch(0.84 0.12 218 / 0.6) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            transform: 'perspective(420px) rotateX(62deg)',
            transformOrigin: 'bottom',
            maskImage: 'linear-gradient(to top, black, transparent 75%)',
          }}
        />
      </motion.div>

      {/* L3 — embers / smoke */}
      <div className="pointer-events-none absolute inset-0">
        <EmberField className="absolute inset-0 h-full w-full" />
        <div className="absolute -left-1/4 bottom-0 h-[60%] w-[80%] rounded-full bg-[radial-gradient(ellipse,oklch(0.2_0.09_256/0.3),transparent_70%)] blur-3xl" />
      </div>

      {/* L4 — stage floor + emblem */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%]"
        style={{ x: l4x }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_100%_at_50%_100%,oklch(0.2_0.1_256/0.5),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-provela/70 to-transparent" />
        <motion.div
          className="absolute inset-x-0 -bottom-0.5 h-24 bg-[radial-gradient(ellipse_40%_100%_at_50%_100%,oklch(0.66_0.17_256/0.45),transparent_70%)] blur-md"
          style={{ opacity: floorBright }}
        />
      </motion.div>

      {/* L5 — foreground HUD glass + lens streak */}
      <motion.div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{ x: l5x, y: l5y }}
      >
        <div className="absolute left-6 top-28 h-24 w-40 -skew-y-3 rounded border border-cold/10 bg-cold/3 fine:backdrop-blur-[2px]" />
        <div className="absolute bottom-28 right-8 h-28 w-44 skew-y-3 rounded border border-cold/10 bg-cold/3 fine:backdrop-blur-[2px]" />
        <div className="absolute left-1/2 top-0 h-full w-0.5 translate-x-[-30vw] bg-linear-to-b from-transparent via-ion/20 to-transparent blur-sm" />
      </motion.div>

      {/* CONTENT */}
      <motion.div
        style={{ y: reduced ? 0 : contentY, opacity: reduced ? 1 : contentOpacity }}
        className="relative z-10 flex min-h-[100dvh] flex-col items-center px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-24 text-center sm:min-h-screen sm:justify-start sm:pb-16 sm:pt-36 md:pt-40"
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-6 sm:flex-none sm:justify-start sm:gap-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src="/images/LOGOS-03.png"
              alt="Provela Esports"
              width={640}
              height={200}
              priority
              className="mb-0 h-auto w-40 drop-shadow-[0_0_30px_oklch(0.66_0.17_256/0.4)] sm:mb-12 sm:w-40 md:w-48 lg:w-40"
            />
          </motion.div>

          <ImpactOnView variant="element" amount={0.6}>
            <KineticHeading
              as="h1"
              lines={['ARE YOU', 'COMPETITIVE?']}
              flickerWords={['COMPETITIVE']}
              className="font-gaming text-[2.75rem] font-bold uppercase leading-[0.92] tracking-tight text-cold sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl"
            />
          </ImpactOnView>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="mx-auto max-w-xl px-1 text-base leading-relaxed text-steel sm:mt-6 sm:px-0 sm:text-lg"
          >
            Elite tournaments, creator-led broadcasts, and competitive divisions across
            EA FC, CODM, eFootball, and beyond.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95 }}
          className="mt-auto flex w-full max-w-md shrink-0 flex-col items-stretch gap-3 pt-8 sm:mt-9 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4 sm:pt-0"
        >
          <Magnetic className="w-full sm:w-auto">
            <Link
              href="/divisions"
              className="cta-sweep group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-md bg-provela px-7 py-3.5 font-gaming text-sm font-semibold uppercase tracking-wider text-void shadow-[0_0_30px_oklch(0.66_0.17_256/0.45)] transition-shadow hover:shadow-[0_0_44px_oklch(0.66_0.17_256/0.65)] sm:w-auto"
            >
              Enter The Arena
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Magnetic>
          <Magnetic strength={0.2} className="w-full sm:w-auto">
            <Link
              href="/fcx"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-md border border-cold/25 bg-cold/5 px-7 py-3.5 font-gaming text-sm font-semibold uppercase tracking-wider text-cold transition-colors fine:backdrop-blur-sm hover:border-provela/60 hover:bg-provela/10 sm:w-auto"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              View Live Brackets
            </Link>
          </Magnetic>
        </motion.div>
      </motion.div>
    </section>
  );
}
