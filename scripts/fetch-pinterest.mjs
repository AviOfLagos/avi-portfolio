#!/usr/bin/env node
/**
 * Build-time fetcher for Pinterest BOARDS.
 *
 * WARNING: https://www.pinterest.com/<user>/<board-slug>.rss is an UNDOCUMENTED
 * endpoint. Pinterest can change or remove it without notice. Because of that,
 * `data/pinterest.json` is COMMITTED to the repo and acts as the fallback the UI
 * reads. This script only ever replaces that file when it has successfully
 * parsed a non-empty set of boards; on any failure it exits non-zero and leaves
 * the existing committed JSON untouched.
 *
 * There is no working endpoint that ENUMERATES a user's boards — `boards.rss`
 * 404s and every `/feed.rss` variant under `_saved` returns the SPA shell — so
 * the slug list below is maintained by hand. Adding a board means adding a slug.
 *
 * Usage: node scripts/fetch-pinterest.mjs
 */

import { writeFile, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_FILE = resolve(__dirname, '..', 'data', 'pinterest.json');

// Capital A is significant: the RSS handler is case-sensitive about the profile
// segment even though the HTML site is not.
const USERNAME = process.env.PINTEREST_USERNAME || 'Avioflagos';

const BOARD_SLUGS = [
  'design-assets',
  'webapps',
  'ai-webapp',
  'widgets',
  'charts',
  'bitsaac-website',
  'patterns',
  'components',
  'twenti5th',
  'interactions',
  'zero-hero-valued-tips',
];

const boardUrl = (slug) => `https://www.pinterest.com/${USERNAME}/${slug}/`;
const feedUrl = (slug) => `https://www.pinterest.com/${USERNAME}/${slug}.rss`;

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

function tag(xml, name) {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? stripCdata(m[1]).trim() : '';
}

/** The channel header is everything before the first <item>. */
function channelHead(xml) {
  const i = xml.search(/<item\b/i);
  return i === -1 ? xml : xml.slice(0, i);
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

    // The description is HTML-escaped markup; unescape before regexing the img.
    const descriptionHtml = unescapeHtml(tag(raw, 'description'));

    const imgMatch = descriptionHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
    const image = imgMatch ? imgMatch[1] : null;

    // Caption text is whatever trails the closing anchor in the description.
    const afterAnchor = descriptionHtml.split(/<\/a>/i).slice(1).join('</a>');
    const caption = afterAnchor.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

    // <title> is frequently empty on board feeds; fall back to the caption.
    const title = (tag(raw, 'title') || caption).trim();

    // Every board feed carries one short-code item (/pin/8RM5AePh/) with an
    // empty description and no pubDate — a promo/section link, not a pin. It
    // has nothing to render, so it is dropped rather than shown as a blank tile.
    if (!image) continue;

    const pin = { url: link };
    if (title) pin.title = title; // omit rather than emit an empty string
    pin.image = image;
    pin.imageLarge = largerVariant(image);
    pin.pubDate = toIso(tag(raw, 'pubDate'));

    pins.push(pin);
  }

  return pins;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Pinterest intermittently refuses the TCP connect (UND_ERR_CONNECT_TIMEOUT),
 * so a single failed attempt is not evidence the endpoint is gone. Only a run
 * of failures is allowed to fail the build.
 */
async function fetchText(url, attempts = 4) {
  let last;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: { 'user-agent': 'Mozilla/5.0 (compatible; portfolio-build/1.0)' },
        signal: AbortSignal.timeout(30_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      return await res.text();
    } catch (err) {
      last = err;
      if (i < attempts - 1) await sleep(1000 * 2 ** i);
    }
  }
  throw new Error(`Failed to fetch ${url} after ${attempts} attempts: ${last.message}`);
}

async function fetchBoard(slug) {
  const url = feedUrl(slug);
  const xml = await fetchText(url);

  if (!xml || !/<item\b/i.test(xml)) {
    throw new Error(`${url} returned no <item> elements — endpoint may have changed.`);
  }

  const head = channelHead(xml);
  const pins = parseItems(xml);
  if (pins.length === 0) throw new Error(`Parsed 0 pins from ${url}.`);

  return {
    slug,
    // Channel <title> is the human board name; <description> is always empty.
    title: unescapeHtml(tag(head, 'title')) || slug,
    url: tag(head, 'link') || boardUrl(slug),
    count: pins.length,
    pins,
  };
}

async function main() {
  // Sequential on purpose: eleven parallel requests to an undocumented endpoint
  // is the fastest way to get rate-limited.
  const boards = [];
  for (const slug of BOARD_SLUGS) {
    const board = await fetchBoard(slug);
    boards.push(board);
    console.log(`  ${slug.padEnd(24)} ${String(board.count).padStart(3)} pins  "${board.title}"`);
  }

  // Hard guard: never clobber the committed fallback with nothing.
  if (boards.length === 0) {
    throw new Error('Parsed 0 boards — refusing to overwrite data/pinterest.json.');
  }

  const totalPins = boards.reduce((n, b) => n + b.count, 0);

  // Also refuse a suspiciously partial result relative to what we already have.
  try {
    const existing = JSON.parse(await readFile(OUT_FILE, 'utf8'));
    const prevBoards = Array.isArray(existing?.boards) ? existing.boards.length : 0;
    const prevPins = Array.isArray(existing?.boards)
      ? existing.boards.reduce((n, b) => n + (Array.isArray(b?.pins) ? b.pins.length : 0), 0)
      : 0;
    if (prevBoards > boards.length) {
      throw new Error(
        `Parsed ${boards.length} boards vs ${prevBoards} previously — refusing to overwrite.`
      );
    }
    if (prevPins > 0 && totalPins < Math.ceil(prevPins / 2)) {
      throw new Error(
        `Parsed only ${totalPins} pins vs ${prevPins} previously — refusing to overwrite.`
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
    source: `https://www.pinterest.com/${USERNAME}/<board>.rss`,
    fetchedAt: new Date().toISOString(),
    boardCount: boards.length,
    pinCount: totalPins,
    boards,
  };

  await writeFile(OUT_FILE, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  const withImages = boards.reduce((n, b) => n + b.pins.filter((p) => p.image).length, 0);
  console.log(
    `Wrote ${boards.length} boards / ${totalPins} pins to ${OUT_FILE} ` +
      `(${withImages} with images, ${totalPins - withImages} without).`
  );
}

main().catch((err) => {
  console.error(`[fetch-pinterest] ${err.message}`);
  console.error('Existing data/pinterest.json left unchanged.');
  process.exit(1);
});
