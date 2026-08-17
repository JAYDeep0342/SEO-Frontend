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
// field, so catch the most common wrong-format mistakes before a guaranteed
// verified:false round trip.
export function isValidSiteUrl(value) {
  return /^(https?:\/\/|sc-domain:)/.test(value.trim())
}
