'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Certification } from '@/lib/content'
import { CERTIFICATIONS } from '@/lib/content'
import { Modal } from './Modal'

/**
 * Certifications, each one a real button that opens the shared Modal with the
 * certificate itself. No scans are uploaded yet, so every entry currently lands
 * on the placeholder — which says so plainly rather than showing a broken frame.
 */

const PLACEHOLDER =
  'The certificate is real, the scan is not uploaded yet. Ask and I will send it over.'

export function CertificationList({
  variant = 'stack',
}: {
  /** `stack` for the /about card, `list` for the dense résumé column. */
  variant?: 'stack' | 'list'
}) {
  const [active, setActive] = useState<Certification | null>(null)

  return (
    <>
      <ul className={`certs certs--${variant}`}>
        {CERTIFICATIONS.map((c) => (
          <li key={c.name}>
            <button
              type="button"
              className="cert"
              onClick={() => setActive(c)}
              aria-haspopup="dialog"
            >
              <span className="cert__name">{c.name}</span>
              <span className="cert__issuer mono">{c.issuer}</span>
              <span className="cert__hint mono" aria-hidden="true">
                View
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Modal
        open={active !== null}
        onClose={() => setActive(null)}
        title={active?.name ?? ''}
      >
        {active?.image ? (
          <Image
            className="cert__image"
            src={active.image}
            alt={`${active.name} certificate, issued by ${active.issuer}`}
            width={1200}
            height={900}
            sizes="(max-width: 640px) 90vw, 560px"
          />
        ) : (
          <p>{PLACEHOLDER}</p>
        )}
        <p className="modal__meta mono">{active?.issuer}</p>
      </Modal>
    </>
  )
}
