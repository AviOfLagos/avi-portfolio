import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbLd, FaqLd } from '@/components/StructuredData'
import { Reveal, FadeUp } from '@/components/motion-primitives'
import { HoverLetters } from '@/components/HoverLetters'
import { PERSON } from '@/lib/content'
import { FAQS } from '@/lib/faq'

export const metadata: Metadata = {
  title: 'FAQ',
  description: `Answers to what people ask ${PERSON.name} most: the kind of work he takes on, how engagements are structured, process, rates, timezones and whether he writes code.`,
  alternates: { canonical: '/faq' },
  openGraph: {
    title: `FAQ, ${PERSON.name}`,
    description: 'What I work on, how engagements are structured, and how I actually work.',
    url: '/faq',
    images: ['/opengraph-image.png'],
  },
}

export default function FaqPage() {
  return (
    <>
      <FaqLd />
      <BreadcrumbLd trail={[{ name: 'Home', path: '/' }, { name: 'FAQ', path: '/faq' }]} />

      <section className="container page-head">
        <h1 className="page-head__title">
          <Reveal>
            <HoverLetters text="FAQ" />
          </Reveal>
        </h1>
        <p className="page-head__lede">
          The questions that come up before anyone books a call. If yours is not here,{' '}
          <Link href="/contact">ask it directly</Link> — the answer usually ends up on this page.
        </p>
      </section>

      <section className="section--tight container">
        {/* <details> on purpose: every answer is in the DOM on load, so it works
            with JavaScript off, is keyboard operable for free, and the FAQPage
            schema describes content a crawler can actually see. */}
        <div className="faq">
          {FAQS.map((f, i) => (
            <FadeUp key={f.id} delay={Math.min(i * 0.04, 0.2)}>
              <details className="faq__item" id={f.id} name="faq">
                <summary className="faq__q">
                  <span>{f.question}</span>
                  <span className="faq__marker" aria-hidden="true" />
                </summary>
                <div className="faq__a">
                  <p>{f.answer}</p>
                </div>
              </details>
            </FadeUp>
          ))}
        </div>
      </section>

      <section className="section container contact-hero">
        <h2 className="contact__title">
          <Reveal>Still wondering</Reveal>
        </h2>
        <p className="page-head__lede" style={{ marginInline: 'auto', textAlign: 'center' }}>
          Ask me the thing you actually want to know. I read everything.
        </p>
        <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a className="cta-solid" href={PERSON.booking.intro.url} target="_blank" rel="noreferrer">
            {PERSON.booking.intro.label} · {PERSON.booking.intro.duration}
          </a>
          <Link className="cta-ghost" href="/contact">
            Send a message
          </Link>
        </div>
      </section>
    </>
  )
}
