import type { MetadataRoute } from 'next'
import { PERSON } from '@/lib/content'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${PERSON.name} — ${PERSON.title}`,
    short_name: 'Avi',
    description: PERSON.summary,
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0c',
    theme_color: '#0a0a0c',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
    ],
  }
}
