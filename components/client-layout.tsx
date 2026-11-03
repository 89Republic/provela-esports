'use client';

import { SmoothScroll } from '@/components/motion/smooth-scroll'
import { CustomCursor } from '@/components/motion/custom-cursor'
import { ImpactProvider } from '@/components/motion/impact-frame'
import { BootSequence } from '@/components/boot-sequence'
import { AmbientScrollBackground } from '@/components/ambient-background'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ImpactProvider>
      <SmoothScroll />
      <BootSequence />
      <AmbientScrollBackground />
      <div className="relative z-10">{children}</div>
      {/* broadcast chrome */}
      <div className="grain-overlay" aria-hidden />
      <span className="hud-bracket tl" aria-hidden />
      <span className="hud-bracket tr" aria-hidden />
      <span className="hud-bracket bl" aria-hidden />
      <span className="hud-bracket br" aria-hidden />
      <CustomCursor />
    </ImpactProvider>
  )
}
