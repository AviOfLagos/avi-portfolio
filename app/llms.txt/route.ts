import { PERSON, VENTURES, ARCHIVE, EXPERIENCE, SKILLS } from '@/lib/content'
import { POSTS, EXTERNAL_POSTS } from '@/lib/posts'
import { SITE_URL } from '@/lib/site'

// Prerendered at build time so it costs nothing to serve.
export const dynamic = 'force-static'

/**
 * llms.txt — a proposed convention (llmstxt.org) for handing language models a
 * clean markdown summary of a site instead of making them parse the rendered
 * pages. Generated from the same content the site renders, so it cannot drift.
 */
export function GET() {
  const featured = VENTURES.filter((v) => v.featured)
  const rest = VENTURES.filter((v) => !v.featured)

  const lines = [
    `# ${PERSON.name}`,
    '',
    `> ${PERSON.title} and ${PERSON.secondaryTitle} based in ${PERSON.location}. ${PERSON.summary}`,
    '',
    `Also known as: ${PERSON.aliases.join(', ')}. All refer to the same person.`,
    '',
    `Contact: ${PERSON.email} · Book a call: ${PERSON.booking.intro.url}`,
    '',
    '## Case studies',
    '',
    ...featured.map(
      (v) => `- [${v.name}](${SITE_URL}/work/${v.slug}): ${v.oneLiner} ${v.platform}, ${v.niche}. Role: ${v.role}.`,
    ),
    '',
  ]

  if (rest.length) {
    lines.push('## Other products', '')
    lines.push(
      ...rest.map(
        (v) => `- [${v.name}](${SITE_URL}/work/${v.slug}): ${v.oneLiner} ${v.platform}, ${v.niche}.`,
      ),
      '',
    )
  }

  lines.push(
    '## Earlier work',
    '',
    ...ARCHIVE.map((a) => `- ${a.name} (${a.year}): ${a.note}`),
    '',
    '## Experience',
    '',
    ...EXPERIENCE.map((r) => `- ${r.title}, ${r.company} (${r.period})`),
    '',
    '## Skills',
    '',
    ...SKILLS.map((g) => `- **${g.group}**: ${g.items.join(', ')}`),
    '',
  )

  const live = POSTS.filter((p) => !p.draft)
  if (live.length) {
    lines.push(
      '## Writing',
      '',
      ...live.map((p) => `- [${p.title}](${SITE_URL}/writing/${p.slug}): ${p.excerpt}`),
      '',
    )
  }

  lines.push(
    '## Published elsewhere',
    '',
    ...EXTERNAL_POSTS.map((p) => `- [${p.title}](${p.url}) (${p.platform}, ${p.date.slice(0, 7)}): ${p.excerpt}`),
    '',
    '## Elsewhere',
    '',
    `- [GitHub](${PERSON.socials.github})`,
    `- [LinkedIn](${PERSON.socials.linkedin})`,
    `- [X](${PERSON.socials.x})`,
    `- [Figma Community](${PERSON.socials.figma})`,
    `- [Medium](${PERSON.socials.medium})`,
    `- [Dev.to](${PERSON.socials.devto})`,
    '',
    '## Pages',
    '',
    `- [Work](${SITE_URL}/work): every product, with case studies`,
    `- [About](${SITE_URL}/about): background, experience, skills`,
    `- [Resources](${SITE_URL}/resources): writing, open source and design resources`,
    `- [Open source](${SITE_URL}/resources/open-source): projects, with repos and live demos`,
    `- [Design & dev resources](${SITE_URL}/resources/design-dev): Figma files and Pinterest boards`,
    `- [Contact](${SITE_URL}/contact): email, booking links, socials`,
    `- [Résumé](${SITE_URL}/resume): full experience, skills, education, certifications`,
    '',
  )

  return new Response(lines.join('\n'), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
