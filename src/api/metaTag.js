import client, { TIMEOUTS } from './client'

export function generate({ topic, url }) {
  return client.post('/api/meta/generate', { topic, url }, { timeout: TIMEOUTS.slow }).then((res) => res.data)
}
