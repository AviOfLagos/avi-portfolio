import type { MetadataRoute } from 'next'
import { VENTURES } from '@/lib/content'
import { TABS, DEFAULT_TAB } from '@/app/resources/tabs'
import { POSTS } from '@/lib/posts'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/work`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/resume`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/resources`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
  ]

  // Each tab is its own indexable route, so each one belongs here.
  const resources: MetadataRoute.Sitemap = TABS.filter((t) => t.slug !== DEFAULT_TAB).map((t) => ({
    url: `${SITE_URL}/resources/${t.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const work: MetadataRoute.Sitemap = VENTURES.map((v) => ({
    url: `${SITE_URL}/work/${v.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: v.featured ? 0.9 : 0.7,
  }))

  // Drafts render with a badge and stay crawlable, but asking Google to index
  // unfinished writing costs more than it earns. Drop `.filter` to include them.
  const writing: MetadataRoute.Sitemap = POSTS.filter((p) => !p.draft).map((p) => ({
    url: `${SITE_URL}/writing/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [...pages, ...resources, ...work, ...writing]
}
