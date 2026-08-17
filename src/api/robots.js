import client, { TIMEOUTS } from './client'

export function analyze({ siteUrl }) {
  return client.post('/api/robots/analyze', { siteUrl }, { timeout: TIMEOUTS.slow }).then((res) => res.data)
}
