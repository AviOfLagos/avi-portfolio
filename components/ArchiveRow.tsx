'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Archive } from '@/lib/content'
import { Modal } from './Modal'

/**
 * An archive entry. Most link out; the ones with nowhere to go say why instead
 * of quietly doing nothing when you click them.
 */

const ExternalIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M7 17L17 7M17 7H8M17 7v9" />
  </svg>
)

// Keyed by name so a specific project can get a specific excuse.
const EXCUSES: Record<string, { title: string; body: string }> = {
  'Creo Builders': {
    title: 'This one is behind a client wall',
    body: 'Documentation and landing pages built for someone else, on their domain, under their terms. The work was real; the link is not mine to give out.',
  },
}

const DEFAULT_EXCUSE = {
  title: 'There is no link, and that is the honest answer',
  body: 'Some of this is gone — startups die, domains lapse, a rebuild wipes the old thing off the internet. The rest was never public. I would rather show you nothing than a dead URL that makes us both feel worse.',
}

export function ArchiveRow({ entry }: { entry: Archive }) {
  const [open, setOpen] = useState(false)
  const excuse = EXCUSES[entry.name] ?? DEFAULT_EXCUSE

  const inner = (
    <>
      <div>
        <div className="archive__name">
          {entry.name}
          {entry.url ? <ExternalIcon /> : <span className="archive__badge mono">No link</span>}
        </div>
        <p className="archive__note">{entry.note}</p>
      </div>
      <div className="archive__side">
        <div className="mono">{entry.tag}</div>
        <div className="mono" style={{ marginTop: '0.4rem' }}>
          {entry.year}
        </div>
      </div>
    </>
  )

  if (entry.url) {
    return (
      <a className="archive__row" href={entry.url} target="_blank" rel="noreferrer">
        {inner}
      </a>
    )
  }

  return (
    <>
      <button className="archive__row" type="button" onClick={() => setOpen(true)}>
        {inner}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={excuse.title}
        footer={
          <Link className="cta-ghost" href="/work" onClick={() => setOpen(false)}>
            See the ones that are still live
          </Link>
        }
      >
        <p>{excuse.body}</p>
        <p className="modal__meta mono">
          {entry.name} · {entry.tag} · {entry.year}
        </p>
      </Modal>
    </>
  )
}
