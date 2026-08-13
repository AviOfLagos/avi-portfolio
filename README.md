# David "Avi" Olatunji — Portfolio

Personal portfolio site. Next.js App Router, TypeScript, Motion, Lenis.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Where things live

| Path | What |
| --- | --- |
| `lib/content.ts` | **Everything about you** — name, title, email, socials, Calendly, case studies, archive projects, experience, skills, education, stats. Edit here first. |
| `lib/posts.ts` | Blog posts. Each post is an object with a `body` array of paragraphs. Set `draft: false` when a post is ready. |
| `app/page.tsx` | Home |
| `app/work/` | Work index + `[slug]` case study template |
| `app/about/page.tsx` | About |
| `app/writing/` | Writing index + `[slug]` article template |
| `app/contact/page.tsx` | Contact |
| `app/globals.css` | The whole design system. Change `--accent` in `:root` to re-skin the site. |
| `components/Chrome.tsx` | Nav, cursor, command palette, smooth scroll, local clock |
| `components/motion-primitives.tsx` | Reveal, FadeUp, Magnetic, Marquee, StatValue, ScrollProgress |

## TODO before launch

- [ ] `lib/content.ts` → `PERSON.calendly` — paste your Calendly link (the "Book a session" button only renders once this is set)
- [ ] `lib/content.ts` → `PERSON.socials.linkedin` and `.x`
- [ ] `lib/content.ts` → `ARCHIVE[].url` — live URLs for the older projects (rows become clickable once set)
- [ ] `lib/posts.ts` → edit the three drafts into your own voice, then set `draft: false`
- [ ] `app/layout.tsx` → update `metadataBase` to the final domain

## Adding a case study

Append an object to `VENTURES` in `lib/content.ts`. The route, the homepage row, the hover preview, the command palette entry and the "next project" link all follow automatically.

## Notes

- Motion respects `prefers-reduced-motion`; smooth scroll disables itself entirely for those users.
- The intro counter only runs once per browser session (`sessionStorage`), so internal navigation never replays it.
- `⌘K` / `Ctrl+K` opens the command palette.
