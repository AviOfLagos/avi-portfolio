import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { PERSON } from '@/lib/content'
import { Nav } from '@/components/Chrome'
import { Decorations } from '@/components/Decorations'
import { ScrollProgress } from '@/components/motion-primitives'
import { Footer } from '@/components/Footer'

const display = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display-face',
})

// Body copy never uses mono, so let it load without blocking first paint.
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  preload: false,
  variable: '--font-mono-face',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://avi-portfolio.vercel.app'),
  title: {
    default: `${PERSON.name} — ${PERSON.title}`,
    template: `%s — ${PERSON.name}`,
  },
  description: PERSON.summary,
  openGraph: {
    title: `${PERSON.name} — ${PERSON.title}`,
    description: PERSON.tagline,
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  applicationName: 'Avi.',
  manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#0a0a0c',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body>
        <Decorations />
        <ScrollProgress />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
