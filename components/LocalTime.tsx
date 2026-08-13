'use client'

import { useEffect, useState } from 'react'
import { PERSON } from '@/lib/content'

export function LocalTime() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: PERSON.timezone,
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return <span className="mono">Lagos — {time} WAT</span>
}
