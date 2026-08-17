// GSC silently returns empty results if endDate is today — default a few
// days back, with a 30-day window before that.
export function defaultGscRange() {
  const end = new Date()
  end.setDate(end.getDate() - 3)
  const start = new Date(end)
  start.setDate(start.getDate() - 30)
  const fmt = (d) => d.toISOString().slice(0, 10)
  return { startDate: fmt(start), endDate: fmt(end) }
}

// No "list my properties" endpoint exists — the site picker is a plain text
// field. Accept either the exact GSC-formatted value (http(s):// or
// sc-domain:) or just a bare domain — bare domains get auto-formatted by
// normalizeSiteUrl below, so the user never has to type "sc-domain:" by hand.
export function isValidSiteUrl(value) {
  const trimmed = value.trim()
  if (/^(https?:\/\/|sc-domain:)/i.test(trimmed)) return true
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+\/?$/i.test(trimmed)
}

// Google Search Console requires siteUrl to match exactly how the property
// is registered — either "sc-domain:example.com" (domain property) or
// "https://www.example.com/" (URL-prefix property, trailing slash). Most
// modern GSC properties are domain properties, so a bare domain the user
// types (e.g. "example.com") is assumed to be one and auto-prefixed —
// already-formatted input (http(s):// or sc-domain:) passes through as-is.
export function normalizeSiteUrl(value) {
  const trimmed = value.trim()
  if (/^(https?:\/\/|sc-domain:)/i.test(trimmed)) return trimmed
  return `sc-domain:${trimmed}`
}
