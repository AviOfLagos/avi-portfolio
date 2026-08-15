import { NextResponse } from 'next/server'
import { addContact, readConfig, verify } from '@/lib/newsletter'
import { clientKey, rateLimit } from '@/lib/rate-limit'
import { SITE_URL } from '@/lib/site'

export async function GET(request: Request) {
  // Token guessing is infeasible against an HMAC, but there is no reason to let
  // anyone sit here brute-forcing either.
  const limit = rateLimit(`confirm:${clientKey(request)}`, 30, 60 * 60 * 1000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many attempts.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }

  const config = readConfig()
  const token = new URL(request.url).searchParams.get('token')
  // Redirect target is built from our own origin so the Host header can never
  // steer where a confirmation click lands.
  const done = (status: 'confirmed' | 'expired' | 'error') =>
    NextResponse.redirect(new URL(`/?subscribe=${status}#subscribe`, SITE_URL))

  if (!config || !token) return done('error')

  const email = verify(token, config.secret)
  if (!email) return done('expired')

  try {
    await addContact(email, config)
  } catch (error) {
    // A contact that already exists is a success from the reader's point of view.
    const message = error instanceof Error ? error.message : ''
    if (!message.includes('already')) {
      console.error('[newsletter] contact create failed', error)
      return done('error')
    }
  }

  return done('confirmed')
}
