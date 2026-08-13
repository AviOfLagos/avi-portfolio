import type { Metadata } from 'next'
import '@fontsource-variable/space-grotesk'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import './globals.css'
import { PERSON } from '@/lib/content'
import { Nav, SmoothScroll, Cursor } from '@/components/Chrome'
import { ScrollProgress } from '@/components/motion-primitives'
import { Footer } from '@/components/Footer'

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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll />
        <ScrollProgress />
        <Cursor />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
