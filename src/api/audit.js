import client, { TIMEOUTS } from './client'

export function run({ website }) {
  return client.post('/api/audit', { website }, { timeout: TIMEOUTS.audit }).then((res) => res.data)
}
