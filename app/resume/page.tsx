import type { Metadata } from 'next'
import { PERSON, EXPERIENCE, SKILLS, EDUCATION, VENTURES } from '@/lib/content'
import { BreadcrumbLd } from '@/components/StructuredData'
import { Reveal, FadeUp } from '@/components/motion-primitives'
import { HoverLetters } from '@/components/HoverLetters'
import { CertificationList } from '@/components/CertificationList'
import './resume-print.css'

const RESUME_PDF = '/David-Olatunji-Resume.pdf'

export const metadata: Metadata = {
  title: 'Résumé',
  description: `Full résumé for ${PERSON.name}, ${PERSON.title} and ${PERSON.secondaryTitle} in ${PERSON.location}. Experience, skills, education and certifications.`,
  alternates: { canonical: '/resume' },
  openGraph: {
    title: `Résumé, ${PERSON.name}`,
    description: `${PERSON.title} and ${PERSON.secondaryTitle}. ${PERSON.location}.`,
    url: '/resume',
    type: 'profile',
  },
}

export default function ResumePage() {
  return (
    <>
      <BreadcrumbLd trail={[{ name: 'Home', path: '/' }, { name: 'Résumé', path: '/resume' }]} />

      {/* The print stylesheet keys off this class, so the @media print rules
          only fire for this route even though the CSS import is global. */}
      <div className="resume-page" />

      <section className="container page-head">
        <h1 className="page-head__title">
          <Reveal><HoverLetters text="Résumé" /></Reveal>
        </h1>
        <p className="mono resume__contact">
          {PERSON.name} · {PERSON.email} · {PERSON.phone} · {PERSON.location} · {PERSON.site}
        </p>
        <p className="page-head__lede">
          {PERSON.title} and {PERSON.secondaryTitle} in {PERSON.location}. The full version, on the
          page so you don&rsquo;t have to download anything, and as a PDF if your process needs one.
        </p>
        <div className="resume__actions">
          <a className="cta-ghost" href={RESUME_PDF} download>
            Download PDF ↓
          </a>
          <a className="cta-ghost" href={`mailto:${PERSON.email}`}>
            {PERSON.email}
          </a>
          <a className="cta-ghost" href={PERSON.booking.intro.url} target="_blank" rel="noreferrer">
            {PERSON.booking.intro.label} ↗
          </a>
        </div>
      </section>

      <section className="section--tight container resume">
        <FadeUp>
          <div className="resume__block">
            <h2 className="resume__heading mono">Experience</h2>
            <div className="resume__roles">
              {EXPERIENCE.map((r) => (
                <article key={`${r.company}-${r.period}`} className="resume__role">
                  <header className="resume__role-head">
                    <h3 className="resume__role-title">{r.title}</h3>
                    <span className="mono resume__role-period">{r.period}</span>
                  </header>
                  <p className="mono resume__role-meta">
                    {r.company} · {r.meta}
                  </p>
                  <ul className="resume__points">
                    {r.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </FadeUp>

        <FadeUp>
          <div className="resume__block">
            <h2 className="resume__heading mono">Selected products</h2>
            <ul className="resume__list">
              {VENTURES.map((v) => (
                <li key={v.slug}>
                  <a href={`/work/${v.slug}`}>
                    <strong>{v.name}</strong>
                  </a>{' '}
                  — {v.oneLiner} <span className="dim">({v.niche})</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeUp>

        <FadeUp>
          <div className="resume__block">
            <h2 className="resume__heading mono">Skills</h2>
            <dl className="resume__skills">
              {SKILLS.map((g) => (
                <div key={g.group}>
                  <dt className="mono">{g.group}</dt>
                  <dd>{g.items.join(' · ')}</dd>
                </div>
              ))}
            </dl>
          </div>
        </FadeUp>

        <FadeUp>
          <div className="resume__block resume__block--split">
            <div>
              <h2 className="resume__heading mono">Education</h2>
              <ul className="resume__list">
                {EDUCATION.map((e) => (
                  <li key={e.school}>
                    <strong>{e.school}</strong> — {e.detail}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="resume__heading mono">Certifications</h2>
              <CertificationList variant="list" />
            </div>
          </div>
        </FadeUp>
      </section>
    </>
  )
}
