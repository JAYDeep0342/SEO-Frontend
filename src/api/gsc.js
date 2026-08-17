import client, { TIMEOUTS } from './client'

export function getGoogleLoginUrl() {
  return client.get('/api/auth/google/login').then((res) => res.data)
}

export function check({ siteUrl }) {
  return client.post('/api/gsc/check', { siteUrl }).then((res) => res.data)
}

export function overview({ siteUrl, startDate, endDate }) {
  return client.post('/api/gsc/overview', { siteUrl, startDate, endDate }, { timeout: TIMEOUTS.slow }).then((res) => res.data)
}

export function performance({ siteUrl, startDate, endDate }) {
  return client.post('/api/gsc/performance', { siteUrl, startDate, endDate }, { timeout: TIMEOUTS.slow }).then((res) => res.data)
}

export function insights({ siteUrl, startDate, endDate }) {
  return client.post('/api/gsc/insights', { siteUrl, startDate, endDate }, { timeout: TIMEOUTS.slow }).then((res) => res.data)
}
