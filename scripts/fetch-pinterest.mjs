#!/usr/bin/env node
/**
 * Build-time fetcher for Pinterest pins.
 *
 * WARNING: https://www.pinterest.com/<user>/feed.rss is an UNDOCUMENTED endpoint.
 * Pinterest can change or remove it without notice. Because of that,
 * `data/pinterest.json` is COMMITTED to the repo and acts as the fallback the UI
 * reads. This script only ever replaces that file when it has successfully parsed
 * a non-empty set of pins; on any failure it exits non-zero and leaves the
 * existing committed JSON untouched.
 *
 * Usage: node scripts/fetch-pinterest.mjs
 */

import { writeFile, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_FILE = resolve(__dirname, '..', 'data', 'pinterest.json');

const USERNAME = process.env.PINTEREST_USERNAME || 'avioflagos';
const FEED_URL = `https://www.pinterest.com/${USERNAME}/feed.rss`;

/** Decode the handful of XML/HTML entities that show up in this feed. */
function unescapeHtml(str) {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&'); // must be last
}

function stripCdata(str) {
  const m = str.match(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/);
  return m ? m[1] : str;
}

function tag(itemXml, name) {
  const m = itemXml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? stripCdata(m[1]).trim() : '';
}

function toIso(pubDate) {
  if (!pubDate) return null;
  const d = new Date(pubDate);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/**
 * Pinterest serves thumbnails under a size segment in the path, e.g.
 *   https://i.pinimg.com/236x/16/ca/c1/<hash>.jpg
 * Swapping `236x` for `564x` yields a larger render of the same image.
 * NOTE: this substitution is UNDOCUMENTED Pinterest behaviour and may break at
 * any time — consumers should treat `imageLarge` as best-effort and be ready to
 * fall back to `image`.
 */
function largerVariant(url) {
  if (!url) return null;
  const bigger = url.replace(/\/\d+x\//, '/564x/');
  return bigger === url ? null : bigger;
}

function parseItems(xml) {
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  const pins = [];

  for (const raw of items) {
    const link = tag(raw, 'link');
    if (!link) continue;

    const descriptionHtml = unescapeHtml(tag(raw, 'description'));

    const imgMatch = descriptionHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
    const image = imgMatch ? imgMatch[1] : null;

    // Caption text is whatever trails the closing anchor in the description.
    const afterAnchor = descriptionHtml.split(/<\/a>/i).slice(1).join('</a>');
    const caption = afterAnchor.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

    const title = (tag(raw, 'title') || caption).trim();

    const pin = { url: link };
    if (title) pin.title = title; // omit rather than emit an empty string
    pin.image = image;
    pin.imageLarge = largerVariant(image);
    pin.pubDate = toIso(tag(raw, 'pubDate'));

    pins.push(pin);
  }

  return pins;
}

async function main() {
  let xml;
  try {
    const res = await fetch(FEED_URL, {
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; portfolio-build/1.0)' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    xml = await res.text();
  } catch (err) {
    throw new Error(`Failed to fetch ${FEED_URL}: ${err.message}`);
  }

  if (!xml || !/<item\b/i.test(xml)) {
    throw new Error('Feed returned no <item> elements — endpoint may have changed.');
  }

  const pins = parseItems(xml);

  // Hard guard: never clobber the committed fallback with nothing.
  if (!Array.isArray(pins) || pins.length === 0) {
    throw new Error('Parsed 0 pins — refusing to overwrite data/pinterest.json.');
  }

  // Also refuse a suspiciously partial result relative to what we already have.
  try {
    const existing = JSON.parse(await readFile(OUT_FILE, 'utf8'));
    const prevCount = Array.isArray(existing?.pins) ? existing.pins.length : 0;
    if (prevCount > 0 && pins.length < Math.ceil(prevCount / 2)) {
      throw new Error(
        `Parsed only ${pins.length} pins vs ${prevCount} previously — refusing to overwrite.`
      );
    }
  } catch (err) {
    if (err instanceof SyntaxError || err.code === 'ENOENT') {
      // No usable previous file; nothing to compare against.
    } else {
      throw err;
    }
  }

  const payload = {
    source: FEED_URL,
    fetchedAt: new Date().toISOString(),
    count: pins.length,
    pins,
  };

  await writeFile(OUT_FILE, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  const withImages = pins.filter((p) => p.image).length;
  console.log(
    `Wrote ${pins.length} pins to ${OUT_FILE} (${withImages} with images, ${pins.length - withImages} without).`
  );
}

main().catch((err) => {
  console.error(`[fetch-pinterest] ${err.message}`);
  console.error('Existing data/pinterest.json left unchanged.');
  process.exit(1);
});
