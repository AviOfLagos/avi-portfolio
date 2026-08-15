import { permanentRedirect } from 'next/navigation'

/**
 * The writing index moved into the Resources hub. Article routes at
 * /writing/[slug] are unchanged — only this index redirects, so old links,
 * feeds and the sitemap keep resolving instead of 404ing.
 */
export default function WritingIndexRedirect() {
  permanentRedirect('/resources')
}
