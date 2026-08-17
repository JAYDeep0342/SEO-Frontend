import client, { TIMEOUTS } from './client'

export function research({ topic }) {
  return client.post('/api/keyword', { topic }, { timeout: TIMEOUTS.slow }).then((res) => res.data)
}
