import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { PERSON } from '@/lib/content'
import { SITE_URL } from '@/lib/site'
import { PersonAndSiteLd } from '@/components/StructuredData'
import { Nav } from '@/components/Chrome'
import { Decorations } from '@/components/Decorations'
import { ScrollProgress } from '@/components/motion-primitives'
import { Footer } from '@/components/Footer'
import { Field } from '@/components/Field'

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
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  title: {
    default: `${PERSON.name} (${PERSON.shortName}), ${PERSON.title}`,
    template: `%s, ${PERSON.name}`,
  },
  description: PERSON.summary,
  openGraph: {
    title: `${PERSON.name} (${PERSON.shortName}), ${PERSON.title}`,
    description: PERSON.tagline,
    type: 'website',
    url: SITE_URL,
    images: ['/opengraph-image.png'],
    siteName: PERSON.name,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', creator: '@avioflagos' },
  authors: [{ name: PERSON.name, url: SITE_URL }],
  creator: PERSON.name,
  publisher: PERSON.name,
  keywords: [
    'Technical Product Manager',
    'Product Owner',
    'AI products',
    'Lagos',
    'Nigeria',
    'PRD',
    'Next.js',
    PERSON.name,
    ...PERSON.aliases,
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
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
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <PersonAndSiteLd />
        {/* One persistent ambient field for every route: mounted here so it never
            unmounts and restarts on a client-side navigation. */}
        <Field />
        <Decorations />
        <ScrollProgress />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
