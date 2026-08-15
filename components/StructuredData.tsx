import { PERSON, VENTURES, EXPERIENCE, SKILLS, EDUCATION } from '@/lib/content'
import { SITE_URL } from '@/lib/site'

/**
 * JSON-LD blocks. Search engines and AI answer engines read these to decide
 * *what* a page is about rather than inferring it from prose, so every page
 * gets an explicit type plus a breadcrumb trail.
 */

function Ld({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Content is authored by us, not user input; JSON.stringify escapes the rest.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

const PERSON_ID = `${SITE_URL}/#person`
const SITE_ID = `${SITE_URL}/#website`

export function PersonAndSiteLd() {
  const sameAs = [
    PERSON.socials.github,
    PERSON.socials.linkedin,
    PERSON.socials.x,
    PERSON.socials.figma,
    PERSON.socials.medium,
    PERSON.socials.devto,
  ].filter(Boolean)

  return (
    <>
      <Ld
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          '@id': PERSON_ID,
          name: PERSON.name,
          alternateName: PERSON.aliases,
          url: SITE_URL,
          image: `${SITE_URL}${PERSON.portrait}`,
          email: `mailto:${PERSON.email}`,
          jobTitle: PERSON.title,
          description: PERSON.summary,
          address: { '@type': 'PostalAddress', addressLocality: 'Lagos', addressCountry: 'NG' },
          sameAs,
          knowsAbout: SKILLS.flatMap((g) => g.items),
          alumniOf: EDUCATION.map((e) => ({ '@type': 'EducationalOrganization', name: e.school })),
          worksFor: EXPERIENCE.slice(0, 1).map((r) => ({
            '@type': 'Organization',
            name: r.company,
          })),
          hasOccupation: {
            '@type': 'Occupation',
            name: PERSON.title,
            occupationLocation: { '@type': 'City', name: 'Lagos' },
          },
        }}
      />
      <Ld
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': SITE_ID,
          url: SITE_URL,
          name: `${PERSON.name}, ${PERSON.title}`,
          description: PERSON.summary,
          inLanguage: 'en',
          publisher: { '@id': PERSON_ID },
        }}
      />
    </>
  )
}

/** Trail so a case study reads as Home > Work > Name rather than an orphan. */
export function BreadcrumbLd({ trail }: { trail: { name: string; path: string }[] }) {
  return (
    <Ld
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: trail.map((t, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: t.name,
          item: `${SITE_URL}${t.path}`,
        })),
      }}
    />
  )
}

export function WorkCollectionLd() {
  return (
    <Ld
      data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Work',
        url: `${SITE_URL}/work`,
        about: { '@id': PERSON_ID },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: VENTURES.map((v, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: v.name,
            description: v.oneLiner,
            url: `${SITE_URL}/work/${v.slug}`,
          })),
        },
      }}
    />
  )
}

export function CaseStudyLd({
  slug,
}: {
  slug: string
}) {
  const v = VENTURES.find((x) => x.slug === slug)
  if (!v) return null

  // A marketplace or platform is a CreativeWork; a thing you install or log
  // into is a SoftwareApplication, which is both accurate and eligible for
  // richer treatment.
  const isApp = v.platform !== 'Marketplace' && v.platform !== 'Platform'
  const operatingSystem = v.platform.includes('Mobile')
    ? 'iOS, Android'
    : v.platform.includes('PWA')
      ? 'Web, iOS, Android'
      : 'Web'

  return (
    <Ld
      data={{
        '@context': 'https://schema.org',
        '@type': isApp ? 'SoftwareApplication' : 'CreativeWork',
        ...(isApp
          ? {
              applicationCategory: 'BusinessApplication',
              operatingSystem,
            }
          : {}),
        name: v.name,
        headline: v.oneLiner,
        description: v.desc,
        url: `${SITE_URL}/work/${v.slug}`,
        about: v.niche,
        author: { '@id': PERSON_ID },
        creator: { '@id': PERSON_ID },
        keywords: v.stack.join(', '),
        ...(v.cover ? { image: `${SITE_URL}${v.cover}` } : {}),
      }}
    />
  )
}

export function ArticleLd({
  title,
  description,
  slug,
  date,
}: {
  title: string
  description: string
  slug: string
  date: string
}) {
  return (
    <Ld
      data={{
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description,
        url: `${SITE_URL}/writing/${slug}`,
        datePublished: date,
        dateModified: date,
        author: { '@id': PERSON_ID },
        publisher: { '@id': PERSON_ID },
        mainEntityOfPage: `${SITE_URL}/writing/${slug}`,
        // The generated route has no extension; /opengraph-image.png is a 404.
        image: [`${SITE_URL}/writing/${slug}/opengraph-image`],
      }}
    />
  )
}

export function ProfilePageLd() {
  return (
    <Ld
      data={{
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        url: `${SITE_URL}/about`,
        mainEntity: { '@id': PERSON_ID },
      }}
    />
  )
}

export function ContactPageLd() {
  return (
    <Ld
      data={{
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        url: `${SITE_URL}/contact`,
        mainEntity: { '@id': PERSON_ID },
      }}
    />
  )
}
