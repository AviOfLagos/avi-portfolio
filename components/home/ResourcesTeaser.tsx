import { POSTS, EXTERNAL_POSTS } from '@/lib/posts'
import { openSourceProjects } from '@/lib/open-source'
import { FIGMA_RESOURCES } from '@/lib/figma-resources'
import { HomeTabs, type TeaserTab } from './HomeTabs'

/**
 * Server component. Reads every data source, cuts each list to three rows and
 * hands plain objects to the client tab strip, so none of lib/posts.ts,
 * lib/open-source.ts or lib/figma-resources.ts is pulled into the browser
 * bundle — only the ~9 rows actually shown.
 */

const MAX_ROWS = 3

const writingItems = [
  ...POSTS.filter((p) => !p.draft).map((p) => ({
    key: `post-${p.slug}`,
    title: p.title,
    sub: p.excerpt,
    meta: `${p.tag} · ${p.readingTime}`,
    href: `/writing/${p.slug}`,
    date: p.date,
  })),
  ...EXTERNAL_POSTS.map((p) => ({
    key: `ext-${p.url}`,
    title: p.title,
    sub: p.excerpt,
    meta: p.platform,
    href: p.url,
    external: true,
    date: p.date,
  })),
]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, MAX_ROWS)
  .map(({ date: _date, ...item }) => item)

const openSourceItems = [...openSourceProjects]
  .sort((a, b) => b.stars - a.stars)
  .slice(0, MAX_ROWS)
  .map((p) => ({
    key: p.slug,
    title: p.name,
    sub: p.tagline,
    meta: `${p.language} · ★ ${p.stars}`,
    href: `/resources/open-source#${p.slug}`,
  }))

const designItems = [...FIGMA_RESOURCES]
  .sort((a, b) => b.duplicates - a.duplicates)
  .slice(0, MAX_ROWS)
  .map((r) => ({
    key: r.slug,
    title: r.title,
    sub: r.blurb,
    meta: `Figma · ${r.duplicates.toLocaleString('en-US')} copies`,
    href: `/resources/design-dev#${r.slug}`,
  }))

const TABS: TeaserTab[] = [
  {
    slug: 'writing',
    label: 'Writing',
    items: writingItems,
    more: { href: '/resources', label: 'All writing' },
  },
  {
    slug: 'open-source',
    label: 'Open source',
    items: openSourceItems,
    more: { href: '/resources/open-source', label: 'All repositories' },
  },
  {
    slug: 'design-dev',
    label: 'Design & dev',
    items: designItems,
    more: { href: '/resources/design-dev', label: 'All design & dev resources' },
  },
]

export function ResourcesTeaser() {
  return <HomeTabs tabs={TABS} label="Resources" />
}
