'use client'

import dynamic from 'next/dynamic'

// Pure decoration, viewport-only: keep both out of the initial script payload.
const SmoothScroll = dynamic(() => import('./Chrome').then((m) => m.SmoothScroll), { ssr: false })
const Cursor = dynamic(() => import('./Chrome').then((m) => m.Cursor), { ssr: false })

export function Decorations() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
    </>
  )
}
