# David "Avi" Olatunji — Portfolio

Next.js App Router, TypeScript, no UI or animation libraries. Deployed on Vercel at
**[avi.nexprove.com](https://avi.nexprove.com)**.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Content lives in data files, not in pages

Editing `lib/` is how you change the site. The routes, homepage rows, command palette,
sitemap, `llms.txt` and JSON-LD all read from these, so adding a case study in one place
makes it appear everywhere.

| File | What |
| --- | --- |
| `lib/content.ts` | Name, title, contact, availability, booking links, socials, case studies (`VENTURES`), older work (`ARCHIVE`), `EXPERIENCE`, `SKILLS`, `EDUCATION`, `CERTIFICATIONS`, `STATS`. **Start here.** |
| `lib/posts.ts` | `POSTS` are articles hosted here; `EXTERNAL_POSTS` are Medium/dev.to pieces we link rather than copy. |
| `lib/open-source.ts` | Curated GitHub projects shown on the resources hub. |
| `lib/figma-resources.ts` | Figma Community files. Hand-maintained — Figma has no public API for Community profiles. |
| `lib/faq.ts` | FAQ entries, also emitted as `FAQPage` structured data. |
| `lib/site.ts` | `SITE_URL`. The canonical origin, in one place. |
| `data/*.json` | Generated — see below. Committed on purpose. |

## Routes

`/` · `/work` + `/work/[slug]` · `/about` · `/resume` · `/faq` · `/contact`
`/resources` with three tabs: `/resources` (writing), `/resources/open-source`,
`/resources/design-dev`. Articles stay at `/writing/[slug]`; `/writing` redirects to
`/resources`.

Machine-facing: `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/ai.txt`,
`/manifest.webmanifest`, per-route OG images.

## Refreshing external data

```bash
node scripts/fetch-medium.mjs      # article thumbnails  -> data/medium-images.json
node scripts/fetch-pinterest.mjs   # 11 boards, ~239 pins -> data/pinterest.json
```

Run them by hand and commit the result. They are **not** part of `next build` — a build
should not depend on a third-party feed being up.

Both fail closed: any fetch error, an empty feed, or a suspiciously small result exits
non-zero *before* writing, so a bad run can never blank good committed data.

Two quirks worth knowing, both handled in the scripts:
- Medium's RSS lists a tracking pixel (`medium.com/_/stat`) as the first image on some
  posts. Real images are on `cdn-images-1.medium.com`.
- Every Pinterest board feed carries one junk short-code item with no image or date.

Figma covers are self-hosted in `public/shots/figma/` because Figma's CDN returns 403 to
any request that is not from figma.com. Replacing one means saving the image as
`<slug>.webp`, matching the `slug` in `lib/figma-resources.ts`.

## Design system

Everything is in `app/globals.css`, which opens with the token block and a section index.
There are no per-component stylesheets; they were consolidated deliberately.

- **Colour** — `--bg`, `--bg-soft`, `--ink`, `--ink-dim`, `--muted`, `--accent`. Change
  `--accent` to re-skin the site.
- **Measure** — `--measure` (68ch), `--measure-tight` (52ch), `--measure-wide` (78ch).
  Any run of prose longer than a few words caps its line length. Comfortable reading is
  45–75 characters; a wide container should produce whitespace, not a 160-character line.
- **Motion** — `--ease-out`, `--ease-spring`, `--dur-fast`, `--dur`, `--dur-slow`.

**No animation library.** Motion/Framer was removed; everything is CSS transitions plus
small `requestAnimationFrame` loops. Please keep it that way — removing it cut ~51KB
gzipped. Any rAF loop must stop when off-screen or when the tab is hidden.

Accessibility rules that are easy to undo by accident:
- Anything dimmed with `opacity` still has to pass contrast. `--muted` cannot be dimmed at
  all; it needs 0.88 to stay legible.
- `prefers-reduced-motion` and `prefers-contrast: more` are both honoured. Check both.
- `components/Modal.tsx` portals to `document.body` on purpose: `.section` sets
  `content-visibility`, which makes a paint-contained ancestor the containing block for
  `position: fixed`, so an in-place overlay gets trapped inside the section.

## Environment

Copy `.env.example`. Nothing is required to run the site — the newsletter route answers
503 and the form shows its unavailable state until `RESEND_API_KEY`,
`RESEND_AUDIENCE_ID` and `NEWSLETTER_SECRET` exist.

Set real values in Vercel → Project → Settings → Environment Variables, never in a
committed file.

## Security

`next.config.ts` sets the CSP and security headers. Notes for anyone changing them:

- `script-src` keeps `'unsafe-inline'` because Next inlines its bootstrap and the RSC
  payload. Cross-origin script sources are still blocked.
- `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`.
- `'unsafe-eval'` and websockets are **development only**, for React tooling and HMR.
- Analytics needs `va.vercel-scripts.com` in `script-src`/`connect-src`. Without it the
  CSP blocks it silently and no data is reported.

`/api/subscribe` is rate limited via `lib/rate-limit.ts` (5/hour per client). Without it,
anyone could make the domain send confirmation mail to arbitrary addresses, which is how
a sending domain gets blocklisted. Apply the same limiter to any new route.

## Deploying

`main` is protected: changes land through a PR. Merging to `main` deploys to production
automatically. Branch pushes get a preview URL.

## Planned work

Tracked in [GitHub issues](https://github.com/AviOfLagos/avi-portfolio/issues). The next
substantial piece is an AI drawer (#34) with three intents: scheduling, JD fit check and
general questions. Shared constraints and open decisions are on #16 and #33 — read those
before starting.
