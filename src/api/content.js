import client, { TIMEOUTS } from './client'

export function generate({ keyword }) {
  return client.post('/api/content', { keyword }, { timeout: TIMEOUTS.content }).then((res) => res.data)
}
