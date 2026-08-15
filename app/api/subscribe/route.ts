import { NextResponse } from 'next/server'
import { isEmail, readConfig, sendConfirmation, sign } from '@/lib/newsletter'

export async function POST(request: Request) {
  const config = readConfig()
  if (!config) {
    // Better a clear failure than a form that pretends to work.
    return NextResponse.json(
      { error: 'Newsletter is not configured yet.' },
      { status: 503 },
    )
  }

  let email: unknown
  try {
    ({ email } = await request.json())
  } catch {
    return NextResponse.json({ error: 'Send an email address.' }, { status: 400 })
  }

  if (!isEmail(email)) {
    return NextResponse.json({ error: 'That does not look like an email address.' }, { status: 400 })
  }

  const address = email.trim().toLowerCase()
  const token = sign(address, config.secret)
  const link = new URL(`/api/subscribe/confirm?token=${token}`, request.url).toString()

  try {
    await sendConfirmation(address, link, config)
  } catch (error) {
    console.error('[newsletter] confirmation send failed', error)
    return NextResponse.json({ error: 'Could not send the confirmation email.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
