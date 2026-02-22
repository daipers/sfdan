// src/instrumentation.ts
// Instrumentation hook disabled for Netlify compatibility
// The original assertServerConfig() caused runtime crashes on Netlify
// because it required NEXT_PUBLIC_SITE_URL at startup which may not be available

export function register() {
  // No-op: previously asserted server config which crashed on Netlify
  // console.log('Instrumentation disabled for Netlify compatibility')
}
