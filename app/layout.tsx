import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased bg-background text-foreground ${geistMono.variable}`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
