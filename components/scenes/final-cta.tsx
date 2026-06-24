'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { KineticHeading } from '@/components/motion/kinetic-heading';
import { Magnetic } from '@/components/motion/magnetic-button';
import { ImpactOnView } from '@/components/motion/impact-frame';

export function FinalCta() {
  return (
    <ImpactOnView variant="viewport" amount={0.7}>
      <section className="scanlines relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-void py-24">
        {/* ghosted emblem */}
        <Image
          src="/images/LOGOS-03.png"
          alt=""
          aria-hidden
          width={900}
          height={280}
          className="pointer-events-none absolute left-1/2 top-1/2 w-[80%] max-w-3xl -translate-x-1/2 -translate-y-1/2 opacity-[0.05]"
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-provela/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,oklch(0.2_0.1_256/0.4),transparent_70%)]" />

        {/* blue light line bottom-left → top-right */}
        <motion.div
          aria-hidden
          className="absolute -left-1/4 bottom-0 h-px w-[150%] origin-left"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: [0, 1, 0.3] }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.7, 0, 0.3, 1] }}
          style={{
            rotate: '-32deg',
            background: 'linear-gradient(90deg, transparent, oklch(0.66 0.17 256), transparent)',
          }}
        />

        <div className="relative z-10 px-6 text-center">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.4em] text-provela">
            Lock In
          </p>
          <KineticHeading
            as="h2"
            lines={['Your Next Match', 'Starts Here']}
            flickerWords={['Match']}
            className="font-gaming text-4xl font-bold uppercase leading-[0.95] tracking-tight text-cold sm:text-6xl md:text-7xl"
          />
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Magnetic>
              <Link
                href="/divisions"
                className="cta-sweep relative inline-flex overflow-hidden bg-provela px-8 py-3.5 font-gaming text-sm font-semibold uppercase tracking-[0.2em] text-void shadow-[0_0_30px_oklch(0.66_0.17_256/0.45)]"
              >
                Explore Divisions
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Link
                href="/tournaments"
                className="inline-flex border border-cold/25 bg-cold/5 px-8 py-3.5 font-gaming text-sm font-semibold uppercase tracking-[0.2em] text-cold backdrop-blur-sm transition-colors hover:border-provela/60 hover:bg-provela/10"
              >
                Register For FCX
              </Link>
            </Magnetic>
          </div>
          <p className="mt-12 text-[0.7rem] uppercase tracking-[0.3em] text-steel">
            See You In The Arena
          </p>
        </div>
      </section>
    </ImpactOnView>
  );
}
