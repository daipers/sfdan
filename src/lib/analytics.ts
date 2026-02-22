// src/lib/analytics.ts
export interface AnalyticsEvent {
  eventName: string
  journey: string
  step?: string
  source?: string
  path?: string
  referrer?: string
  metadata?: Record<string, unknown>
}

function normalizeString(value: unknown) {
  if (value === null || value === undefined) {
    return null
  }

  const trimmed = String(value).trim()
  return trimmed.length > 0 ? trimmed : null
}

function normalizeToken(value: unknown) {
  const normalized = normalizeString(value)
  return normalized ? normalized.toLowerCase() : null
}

function normalizeMetadata(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  try {
    const serialized = JSON.stringify(value)
    if (serialized.length > 2000) {
      return null
    }
  } catch (error) {
    return null
  }

  return value as Record<string, unknown>
}

export async function trackEvent(event: AnalyticsEvent) {
  try {
    const path = event.path ?? (typeof window !== 'undefined' ? window.location.pathname : undefined)
    const referrer = event.referrer ?? (typeof document !== 'undefined' ? document.referrer : undefined)

    const payload = {
      event_name: normalizeToken(event.eventName),
      journey: normalizeToken(event.journey),
      step: normalizeToken(event.step),
      source: normalizeToken(event.source),
      path: normalizeString(path),
      referrer: normalizeString(referrer),
      metadata: normalizeMetadata(event.metadata),
    }

    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch (error) {
    // Silently ignore analytics errors to avoid impacting UX
  }
}
