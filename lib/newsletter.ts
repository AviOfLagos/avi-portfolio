import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Double opt-in without a database: the confirmation link carries a signed,
 * expiring token, so nothing is stored until the reader clicks it.
 */

const TTL_MS = 1000 * 60 * 60 * 24 // 24 hours

export type Config = {
  apiKey: string
  secret: string
  from: string
}

/** Returns null when the integration has not been provisioned yet. */
export function readConfig(): Config | null {
  const apiKey = process.env.RESEND_API_KEY
  const secret = process.env.NEWSLETTER_SECRET
  if (!apiKey || !secret) return null
  return {
    apiKey,
    secret,
    from: process.env.NEWSLETTER_FROM ?? 'Avi <hello@nexprove.com>',
  }
}

/**
 * Deliberately strict, and length-capped: an address is user input that ends up
 * in an outbound API call, so anything unusual is rejected rather than
 * sanitised. RFC 5321 caps a path at 254 characters.
 */
const EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,63}$/

export function isEmail(value: unknown): value is string {
  if (typeof value !== 'string') return false
  const trimmed = value.trim()
  return trimmed.length >= 6 && trimmed.length <= 254 && EMAIL.test(trimmed)
}

export function sign(email: string, secret: string) {
  const expires = Date.now() + TTL_MS
  const payload = `${email.toLowerCase()}.${expires}`
  const mac = createHmac('sha256', secret).update(payload).digest('base64url')
  return Buffer.from(`${payload}.${mac}`).toString('base64url')
}

export function verify(token: string, secret: string): string | null {
  let decoded: string
  try {
    decoded = Buffer.from(token, 'base64url').toString('utf8')
  } catch {
    return null
  }
  const [email, expires, mac] = decoded.split('.')
  if (!email || !expires || !mac) return null
  if (Number(expires) < Date.now()) return null

  const expected = createHmac('sha256', secret).update(`${email}.${expires}`).digest('base64url')
  const a = Buffer.from(mac)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  return email
}

async function resend(path: string, config: Config, body: unknown) {
  const res = await fetch(`https://api.resend.com${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    throw new Error(`Resend ${path} failed: ${res.status} ${await res.text()}`)
  }
  return res.json()
}

export function sendConfirmation(email: string, link: string, config: Config) {
  return resend('/emails', config, {
    from: config.from,
    to: email,
    subject: 'Confirm your subscription',
    text: [
      'Thanks for signing up for occasional notes on product, AI and building in Lagos.',
      '',
      `Confirm your email: ${link}`,
      '',
      'This link expires in 24 hours. If you did not request it, ignore this email.',
      '— Avi',
    ].join('\n'),
  })
}

/**
 * Resend's contact book is account-wide now: contacts are created at /contacts
 * and grouped with segments, so there is no audience id to pass.
 */
export function addContact(email: string, config: Config) {
  return resend('/contacts', config, { email, unsubscribed: false })
}
