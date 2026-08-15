/**
 * Canonical origin, in one place. Sitemap, robots, llms.txt and metadataBase
 * must all agree or search engines get conflicting signals about which host
 * owns the content.
 */
export const SITE_URL = 'https://avi.nexprove.com'

export const url = (path = '/') => new URL(path, SITE_URL).toString()
