import client, { TIMEOUTS } from './client'

export function analyze({ url }) {
  return client.post('/api/onpage/analyze', { url }, { timeout: TIMEOUTS.slow }).then((res) => res.data)
}
