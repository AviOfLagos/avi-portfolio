import mediumImages from '@/data/medium-images.json'
import pinterest from '@/data/pinterest.json'
import { FIGMA_RESOURCES } from '@/lib/figma-resources'
import openSourceProjects, { type OpenSourceProject } from '@/lib/open-source'
import type { ExternalPost } from '@/lib/posts'

/* ---------------- Open source ---------------- */

/**
 * local-media-router is excluded: its GitHub description advertises an RTMP
 * relay that is not in the repository. Listing it would send people to
 * something that does not do what the card says.
 */
export const OPEN_SOURCE: OpenSourceProject[] = openSourceProjects.filter(
  (p) => p.slug !== 'local-media-router',
)

/* ---------------- Medium thumbnails ---------------- */

const MEDIUM_IMAGES = mediumImages as Record<string, string>

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Thumbnails are keyed by the canonical Medium URL. Three of the eight
 * external posts do not match by URL — either they are dev.to originals that
 * were also syndicated to Medium, or Medium renamed the slug — so fall back to
 * matching the article slug inside the key. Anything still unmatched renders
 * the generated <Cover>.
 */
export function mediumImageFor(post: Pick<ExternalPost, 'url' | 'title'>): string | undefined {
  const exact = MEDIUM_IMAGES[post.url]
  if (exact) return exact

  const wanted = slugify(post.title)
  if (!wanted) return undefined

  for (const [key, image] of Object.entries(MEDIUM_IMAGES)) {
    if (key.includes(wanted)) return image
  }
  return undefined
}

/* ---------------- Design & dev resources ---------------- */

export type ResourceKind = 'figma' | 'dev-tool'

export type Resource = {
  id: string
  kind: ResourceKind
  title: string
  blurb?: string
  href: string
  image?: string
  imageLarge?: string
  meta: string
  tags: string[]
  /** Extra label/value rows in the detail panel. */
  facts: { label: string; value: string }[]
  linkLabel: string
  secondary?: { href: string; label: string }
}

export const KIND_LABELS: Record<ResourceKind, string> = {
  figma: 'Figma file',
  'dev-tool': 'Dev tool',
}

/* ---------------- Pinterest boards ---------------- */

export type Pin = {
  url: string
  /** Absent on most pins; those render image-only, with no caption. */
  title?: string
  /** 236x thumbnail. */
  image: string
  /** Undocumented 564x variant of the same image; falls back to `image`. */
  imageLarge: string | null
  pubDate: string | null
}

export type PinBoard = {
  slug: string
  title: string
  url: string
  count: number
  pins: Pin[]
}

/** How many real pins a board slider shows before the "see all" card. */
export const BOARD_PIN_LIMIT = 8

/**
 * Board-level Pinterest data, scraped at build time by
 * `scripts/fetch-pinterest.mjs` and committed as the fallback. Boards are shown
 * largest first so the sparse ones (charts, interactions) sink to the bottom.
 */
export const PIN_BOARDS: PinBoard[] = [...(pinterest as { boards: PinBoard[] }).boards].sort(
  (a, b) => b.count - a.count,
)

export const PIN_TOTAL = PIN_BOARDS.reduce((n, b) => n + b.count, 0)

const figmaResources: Resource[] = FIGMA_RESOURCES.map((f) => ({
  id: `figma-${f.slug}`,
  kind: 'figma',
  title: f.title,
  blurb: f.blurb,
  href: f.url,
  // f.cover is deliberately not used. The s3-alpha.figma.com and
  // s3-figma-hubfile-images CDNs answer 403 to everything that is not
  // figma.com — the image optimiser and the browser both fail — so the URLs
  // render a broken image rather than a thumbnail. These fall through to the
  // generated <Cover> until the covers are downloaded and self-hosted.
  meta: f.category,
  tags: f.tags,
  facts: [
    { label: 'Category', value: f.category },
    { label: 'Updated', value: f.year },
    { label: 'Likes', value: String(f.likes) },
    { label: 'Duplicates', value: f.duplicates.toLocaleString('en-GB') },
    { label: 'Licence', value: f.license },
    ...(f.devResource ? [{ label: 'Built for', value: 'Developers to clone and build against' }] : []),
  ],
  linkLabel: 'Open in Figma Community',
}))

const devTools: Resource[] = OPEN_SOURCE.filter((p) => p.category === 'Developer tool').map((p) => ({
  id: `dev-${p.slug}`,
  kind: 'dev-tool',
  title: p.name,
  blurb: p.tagline,
  href: p.repo,
  meta: p.language,
  tags: p.stack,
  facts: [
    { label: 'Language', value: p.language },
    { label: 'Stars', value: String(p.stars) },
    { label: 'Licence', value: p.license ?? 'None yet' },
  ],
  linkLabel: 'View repository',
  ...(p.live ? { secondary: { href: p.live, label: 'Live demo' } } : {}),
}))

/** Figma first, then dev tools. Pinterest lives in its own board sliders. */
export const RESOURCES: Resource[] = [...figmaResources, ...devTools]

export const KIND_COUNTS: Record<ResourceKind, number> = {
  figma: figmaResources.length,
  'dev-tool': devTools.length,
}
