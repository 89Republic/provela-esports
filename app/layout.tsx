import type { Metadata } from 'next'
import { Chakra_Petch, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AmbientScrollBackground } from '@/components/ambient-background'
import { ThemeProvider } from '@/components/theme-provider'
import { SmoothScroll } from '@/components/motion/smooth-scroll'
import { CustomCursor } from '@/components/motion/custom-cursor'
import { ImpactProvider } from '@/components/motion/impact-frame'
import { BootSequence } from '@/components/boot-sequence'
import './globals.css'

const provelaSans = Chakra_Petch({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-provela-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'Provela Esports | Premier Gaming Organization',
  description: 'Join Provela Esports - your premier esports organization with multiple divisions, tournaments, and professional streamers.',
  generator: 'v0.app',
  icons: {
    icon: '/images/LOGOS-03.png',
    apple: '/images/LOGOS-03.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`font-sans antialiased bg-background text-foreground ${provelaSans.variable} ${geistMono.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
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
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
