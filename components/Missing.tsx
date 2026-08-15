'use client'

import { useEffect, useState } from 'react'

/**
 * The path the visitor actually asked for. Client-side because a 404 is
 * rendered for any unmatched route and the server does not hand it down.
 */
export function RequestedPath() {
  const [path, setPath] = useState('')

  useEffect(() => {
    const { pathname } = window.location
    // Long paths would blow out the line; the tail is the interesting part.
    setPath(pathname.length > 42 ? `…${pathname.slice(-41)}` : pathname)
  }, [])

  if (!path) return null
  return (
    <p className="mono oops__path">
      Requested <span className="oops__path-value">{path}</span> · delivered nothing
    </p>
  )
}

/** The palette shortcut, written with the modifier this visitor actually has. */
export function ShortcutKey() {
  const [modifier, setModifier] = useState('⌘')

  useEffect(() => {
    const apple = /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent)
    if (!apple) setModifier('Ctrl ')
  }, [])

  return <span>{modifier}K</span>
}
