'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/analytics'

interface AnalyticsTrackerProps {
  eventName: string
  journey: string
  step?: string
  source?: string
  metadata?: Record<string, unknown>
}

export function AnalyticsTracker({ eventName, journey, step, source, metadata }: AnalyticsTrackerProps) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) {
      return
    }

    hasTracked.current = true
    void trackEvent({ eventName, journey, step, source, metadata })
  }, [eventName, journey, step, source, metadata])

  return null
}
