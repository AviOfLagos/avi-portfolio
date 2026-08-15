import { NextResponse } from 'next/server'
import { isEmail, readConfig, sendConfirmation, sign } from '@/lib/newsletter'
import { clientKey, rateLimit } from '@/lib/rate-limit'
import { SITE_URL } from '@/lib/site'

export async function POST(request: Request) {
  // Without this, anyone can make us send confirmation mail to addresses that
  // never asked for it — which is how a sending domain gets blocklisted.
  const limit = rateLimit(`subscribe:${clientKey(request)}`, 5, 60 * 60 * 1000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }

  const config = readConfig()
  if (!config) {
    // Better a clear failure than a form that pretends to work.
    return NextResponse.json(
      { error: 'Newsletter is not configured yet.' },
      { status: 503 },
    )
  }

  const declaredLength = Number(request.headers.get('content-length') ?? 0)
  if (declaredLength > 2_000) {
    return NextResponse.json({ error: 'Send an email address.' }, { status: 413 })
  }

  let email: unknown
  let trap: unknown
  try {
    const body = await request.json()
    email = body?.email
    trap = body?.company
  } catch {
    return NextResponse.json({ error: 'Send an email address.' }, { status: 400 })
  }

  // Honeypot: hidden to people, irresistible to form bots. Answer as if it
  // worked so the bot has nothing to learn from the response.
  if (typeof trap === 'string' && trap.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  if (!isEmail(email)) {
    return NextResponse.json({ error: 'That does not look like an email address.' }, { status: 400 })
  }

  const address = email.trim().toLowerCase()
  const token = sign(address, config.secret)
  // Built from SITE_URL, not request.url: request.url reflects the Host header,
  // so a spoofed Host would mint confirmation links pointing at someone else.
  const link = new URL(`/api/subscribe/confirm?token=${token}`, SITE_URL).toString()

  try {
    await sendConfirmation(address, link, config)
  } catch (error) {
    console.error('[newsletter] confirmation send failed', error)
    return NextResponse.json({ error: 'Could not send the confirmation email.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
