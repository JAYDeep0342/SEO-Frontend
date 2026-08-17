import client, { TIMEOUTS } from './client'

export function generate({ topic, url, schemaType }) {
  return client.post('/api/schema/generate', { topic, url, schemaType }, { timeout: TIMEOUTS.slow }).then((res) => res.data)
}
