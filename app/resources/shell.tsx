import type { Metadata } from 'next'
import { BreadcrumbLd } from '@/components/StructuredData'
import { Reveal } from '@/components/motion-primitives'
import { HoverLetters } from '@/components/HoverLetters'
import { Subscribe } from '@/components/Subscribe'
import { PERSON } from '@/lib/content'
import { ResourcesTabs } from '@/components/resources/ResourcesTabs'
import { WritingPanel } from '@/components/resources/WritingPanel'
import { OpenSourcePanel } from '@/components/resources/OpenSourcePanel'
import { DesignDevPanel } from '@/components/resources/DesignDevPanel'
import { KIND_COUNTS, OPEN_SOURCE, RESOURCES } from './data'
import { TABS, TAB_META, pathForTab, type TabSlug } from './tabs'
import './resources.css'

export function metadataForTab(tab: TabSlug): Metadata {
  const meta = TAB_META[tab]
  // Every tab is its own indexable URL; /resources/writing is the one exception,
  // since it is the same content as the bare /resources landing.
  const canonical = pathForTab(tab)
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonical,
      images: ['/opengraph-image.png'],
    },
  }
}

export function ResourcesShell({ tab }: { tab: TabSlug }) {
  const label = TABS.find((t) => t.slug === tab)?.label ?? 'Resources'

  return (
    <>
      <BreadcrumbLd
        trail={
          tab === 'writing'
            ? [{ name: 'Home', path: '/' }, { name: 'Resources', path: '/resources' }]
            : [
                { name: 'Home', path: '/' },
                { name: 'Resources', path: '/resources' },
                { name: label, path: pathForTab(tab) },
              ]
        }
      />

      <section className="container page-head">
        <h1 className="page-head__title">
          <Reveal>
            <HoverLetters text="Resources" />
          </Reveal>
        </h1>
        <p className="page-head__lede">
          Everything I have published in one place: articles, the repositories behind them, and the
          design and development files other people can pick up and use.
        </p>
      </section>

      <section className="container resources">
        <ResourcesTabs
          initialTab={tab}
          siteName={PERSON.name}
          panels={{
            writing: <WritingPanel />,
            'open-source': <OpenSourcePanel projects={OPEN_SOURCE} />,
            'design-dev': <DesignDevPanel resources={RESOURCES} counts={KIND_COUNTS} />,
          }}
        />
      </section>

      <section className="section container">
        <Subscribe />
      </section>
    </>
  )
}
