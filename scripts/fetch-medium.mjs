#!/usr/bin/env node
/**
 * Build-time fetcher for Medium article thumbnails.
 *
 * Reads https://medium.com/feed/@avioflagos and writes data/medium-images.json
 * as a flat map of { "<canonical post url>": "<image url>" }.
 *
 * GOTCHA — TRACKING PIXEL:
 * Some feed items open their <content:encoded> block with a 1x1 transparent
 * tracking pixel hosted at https://medium.com/_/stat?event=post.clientViewed...
 * If you naively take the FIRST <img> in the body you get that pixel, and the
 * site renders an invisible 1px image instead of the article thumbnail.
 * Real images always live on cdn-images-1.medium.com — so we skip anything
 * matching medium.com/_/stat and prefer cdn-images-1.medium.com. Do not
 * "simplify" this back to a first-image grab.
 *
 * Post URLs in the feed carry ?source=rss---- query junk. We strip the query
 * string so keys match the `url` values in lib/posts.ts EXTERNAL_POSTS exactly.
 *
 * Resilience: on any fetch/parse failure the script exits non-zero WITHOUT
 * touching an existing data/medium-images.json. A failed build-time fetch must
 * never blank good committed data.
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const FEED_URL = 'https://medium.com/feed/@avioflagos'
const OUT_PATH = resolve(dirname(fileURLToPath(import.meta.url)), '../data/medium-images.json')

const fail = (msg) => {
  console.error(`[fetch-medium] FAILED: ${msg}`)
  console.error('[fetch-medium] Existing data/medium-images.json left untouched.')
  process.exit(1)
}

function decodeEntities(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
}

function unwrap(raw) {
  if (raw == null) return ''
  const cdata = raw.match(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/)
  return (cdata ? cdata[1] : raw).trim()
}

function tag(itemXml, name) {
  const m = itemXml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`))
  return m ? unwrap(m[1]) : null
}

function canonical(url) {
  const clean = decodeEntities(url).split('?')[0].split('#')[0]
  return clean.replace(/\/$/, '')
}

function pickImage(html) {
  const decoded = decodeEntities(html)
  const srcs = [...decoded.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map((m) =>
    decodeEntities(m[1])
  )
  // Drop the Medium tracking pixel (medium.com/_/stat) and other non-images.
  const usable = srcs.filter((s) => !/medium\.com\/_\/stat/i.test(s) && /^https?:\/\//i.test(s))
  return usable.find((s) => /cdn-images-1\.medium\.com/i.test(s)) ?? usable[0] ?? null
}

let xml
try {
  const res = await fetch(FEED_URL, {
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; portfolio-build/1.0)' },
  })
  if (!res.ok) fail(`feed responded ${res.status} ${res.statusText}`)
  xml = await res.text()
} catch (err) {
  fail(`could not fetch ${FEED_URL} — ${err.message}`)
}

const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1])
if (items.length === 0) fail('feed contained no <item> elements (layout changed?)')

const out = {}
let withImage = 0
for (const item of items) {
  const link = tag(item, 'link')
  if (!link) continue
  const url = canonical(link)
  const title = tag(item, 'title') ?? '(untitled)'
  const content = tag(item, 'content:encoded') ?? tag(item, 'description') ?? ''
  const image = pickImage(content)
  if (image) {
    out[url] = image
    withImage++
    console.log(`[fetch-medium] ok   ${title}`)
  } else {
    console.warn(`[fetch-medium] skip ${title} — no usable image`)
  }
}

if (withImage === 0) fail('parsed the feed but found zero usable images — refusing to write')

mkdirSync(dirname(OUT_PATH), { recursive: true })
writeFileSync(OUT_PATH, `${JSON.stringify(out, null, 2)}\n`)
console.log(`[fetch-medium] wrote ${withImage} image(s) from ${items.length} item(s) -> ${OUT_PATH}`)
