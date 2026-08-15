/**
 * URL scheme: path segments, not a query string.
 *
 * `/resources`, `/resources/open-source`, `/resources/design-dev` are real
 * routes, statically generated, each with its own <title>, description and
 * canonical, so every tab is crawlable and indexable on its own. A query
 * string (`?tab=open-source`) would have collapsed all three into one indexed
 * URL and forced a client boundary around useSearchParams. Switching tabs in
 * the browser never runs a Next navigation — it calls window.history.pushState
 * (a documented Next.js integration) so the panels stay mounted and scroll
 * position is untouched, while the address bar stays shareable.
 */

export const TABS = [
  { slug: 'writing', label: 'Writing', short: 'Writing' },
  { slug: 'open-source', label: 'Open source', short: 'Open source' },
  { slug: 'design-dev', label: 'Design & dev resources', short: 'Design & dev' },
] as const

export type TabSlug = (typeof TABS)[number]['slug']

export const DEFAULT_TAB: TabSlug = 'writing'

export function isTabSlug(value: string): value is TabSlug {
  return TABS.some((t) => t.slug === value)
}

/** The first tab lives at the bare `/resources` URL, not `/resources/writing`. */
export function pathForTab(tab: TabSlug) {
  return tab === DEFAULT_TAB ? '/resources' : `/resources/${tab}`
}

export function tabForPath(pathname: string): TabSlug {
  const last = pathname.replace(/\/+$/, '').split('/').pop() ?? ''
  return isTabSlug(last) ? last : DEFAULT_TAB
}

export const TAB_META: Record<TabSlug, { title: string; description: string }> = {
  writing: {
    title: 'Resources',
    description:
      'Articles, open-source projects and design resources in one place. Notes on product, AI and running distributed teams, plus everything published elsewhere.',
  },
  'open-source': {
    title: 'Open source',
    description:
      'Curated AI and developer-tooling repositories, each with what it does, the stack behind it and where a first contribution fits.',
  },
  'design-dev': {
    title: 'Design & dev resources',
    description:
      'Figma Community files, developer tools and a visual reference library, filterable by kind.',
  },
}
