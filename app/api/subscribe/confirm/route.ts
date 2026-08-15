import { NextResponse } from 'next/server'
import { addContact, readConfig, verify } from '@/lib/newsletter'

export async function GET(request: Request) {
  const config = readConfig()
  const token = new URL(request.url).searchParams.get('token')
  const done = (status: 'confirmed' | 'expired' | 'error') =>
    NextResponse.redirect(new URL(`/?subscribe=${status}#subscribe`, request.url))

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
