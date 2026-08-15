import type { Metadata } from 'next'
import { ProfilePageLd, BreadcrumbLd } from '@/components/StructuredData'
import Link from 'next/link'
import Image from 'next/image'
import { PERSON, EXPERIENCE, STATS } from '@/lib/content'
import { Reveal, FadeUp, StatValue, Magnetic } from '@/components/motion-primitives'
import { HoverLetters } from '@/components/HoverLetters'
import { Toolkit } from '@/components/Toolkit'
import { CertificationList } from '@/components/CertificationList'

/** How I work, in the terms I would defend in a review. */
const PHILOSOPHY = [
  {
    title: 'Settle it with something clickable',
    body: 'A prototype ends an argument that a third document would only extend. If two people read the same spec two ways, I build the smallest version of both and we look at them.',
  },
  {
    title: 'The backlog is the strategy',
    body: 'Everyone agrees with the roadmap deck. What you actually chose is whatever sits at the top of the backlog on Monday, so that is the artefact I guard.',
  },
  {
    title: 'Write the acceptance criteria first',
    body: 'If I cannot say what "done" looks like before work starts, the requirement is not ready. Most scope arguments are really an unwritten criterion surfacing late.',
  },
  {
    title: 'Ship, then look',
    body: 'Research before a release tells you what people say. The week after tells you what they do. I plan for both and weight the second more heavily.',
  },
]

/** Three roles worth the space on a narrative page. The full record is /resume. */
const HIGHLIGHT_COMPANIES = ['Ellum AI', 'Nexprove Agency', 'HNG']
const HIGHLIGHTS = HIGHLIGHT_COMPANIES.map(
  (name) => EXPERIENCE.find((r) => r.company === name)!,
).filter(Boolean)

export const metadata: Metadata = {
  title: 'About',
  description: PERSON.summary,
  alternates: { canonical: '/about' },
  openGraph: { title: `About ${PERSON.name}`, description: PERSON.summary, url: '/about', type: 'profile', images: ['/opengraph-image.png'] },
}

export default function AboutPage() {
  return (
    <>
      <ProfilePageLd />
      <BreadcrumbLd trail={[{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }]} />
      <section className="container page-head">
        <h1 className="page-head__title">
          <Reveal><HoverLetters text="About" /></Reveal>
        </h1>
        <p className="page-head__lede">{PERSON.summary}</p>
      </section>

      <section className="section--tight container about-grid">
        <figure className="portrait">
          <Image
            src={PERSON.portrait}
            alt={`${PERSON.name}, photographed in Lagos`}
            width={682}
            height={1024}
            sizes="(max-width: 900px) 100vw, 340px"
            priority
          />
          <figcaption className="mono">{PERSON.location}</figcaption>
        </figure>

        <div className="prose" style={{ maxWidth: '68ch' }}>
          <FadeUp>
            <p>
              I&rsquo;m David Olatunji, though almost everyone calls me Avi — online I&rsquo;m
              AviOfLagos. Product owner and technical product manager based in Lagos, working with
              teams across Toronto, New York and Berlin. My background is split down the middle:
              electrical engineering, then computer science, then four years of shipping products.
              That split is basically the job description.
            </p>
          </FadeUp>
          <FadeUp delay={0.06}>
            <p>
              In practice that means I can sit in a technical design review and a pricing
              conversation on the same afternoon, and translate faithfully in both directions. I
              write the roadmap and the acceptance criteria. I also open Figma and the codebase when
              a spec is faster to settle with a prototype than a paragraph.
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p>
              Most of my recent work is AI products: an orchestration platform for marketing teams, a
              registry that lets agents install new capabilities, a voice AI that runs first-round
              interviews. Before that, marketplaces, real estate, then solar. The thread is the
              same: take something people currently do with spreadsheets, phone calls and hope, and
              make it a product.
            </p>
          </FadeUp>
          <FadeUp delay={0.14}>
            <p>
              Alongside client and venture work I mentor product managers at HNG, Africa&rsquo;s
              largest tech internship programme, where I&rsquo;ve helped shape curriculum and success
              metrics for thousands of participants and run the community events that go with it.
              Teaching the fundamentals is the fastest way I know to keep re-checking my own.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="section--tight container">
        <FadeUp>
          <div className="stats">
            {STATS.map((s) => (
              <div className="stat" key={s.label}>
                <StatValue value={s.value} suffix={s.suffix} />
                <div className="mono stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </FadeUp>
      </section>

      <section className="section container">
        <div className="section__head">
          <h2 className="section__title">
            <Reveal>
              How I work<span className="accent">.</span>
            </Reveal>
          </h2>
        </div>
        <div className="card-grid">
          {PHILOSOPHY.map((p, i) => (
            <FadeUp key={p.title} delay={i * 0.05}>
              <div className="card" style={{ height: '100%' }}>
                <h3>{p.title}</h3>
                <p style={{ marginTop: '0.7rem' }}>{p.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section__head">
          <h2 className="section__title">
            <Reveal>
              Where I&rsquo;ve been<span className="accent">.</span>
            </Reveal>
          </h2>
          <p className="mono">Three of them. The full record lives on the résumé.</p>
        </div>
        <div className="timeline">
          {HIGHLIGHTS.map((r, i) => (
            <FadeUp key={r.company} delay={i * 0.04}>
              <div className="timeline__item">
                <div>
                  <div className="timeline__company">{r.company}</div>
                  <div className="mono" style={{ marginTop: '0.5rem' }}>{r.period}</div>
                  <div className="mono" style={{ marginTop: '0.3rem' }}>{r.meta}</div>
                </div>
                <div>
                  <div className="timeline__title">{r.title}</div>
                  <ul className="timeline__points">
                    <li>{r.points[0]}</li>
                  </ul>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
        <div style={{ marginTop: '2rem' }}>
          <Link className="cta-ghost" href="/resume">
            Read the full résumé →
          </Link>
        </div>
      </section>

      <section className="section container">
        <div className="section__head">
          <h2 className="section__title">
            <Reveal>
              Toolkit<span className="accent">.</span>
            </Reveal>
          </h2>
        </div>
        <Toolkit />
      </section>

      <section className="section container">
        <div className="section__head">
          <h2 className="section__title">
            <Reveal>
              Certifications<span className="accent">.</span>
            </Reveal>
          </h2>
          <p className="mono">Click one to see the certificate.</p>
        </div>
        <FadeUp>
          <div className="card">
            <CertificationList />
          </div>
        </FadeUp>
      </section>

      <section className="section container contact-hero">
        <h2 className="contact__title">
          <Reveal><HoverLetters text="Work with me" /></Reveal>
        </h2>
        <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Magnetic strength={0.45}>
            <Link className="magnetic-cta" href="/contact">
              Get in touch
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14m0 0l-6-6m6 6l-6 6" />
              </svg>
            </Link>
          </Magnetic>
          <Link className="cta-ghost" href="/work">See the work</Link>
        </div>
      </section>
    </>
  )
}
