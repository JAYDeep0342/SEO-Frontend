import axios from 'axios'

const PUBLIC_PATHS = ['/auth/signup', '/auth/login']

export const TIMEOUTS = {
  default: 15000,
  slow: 30000,
  // Audit crawls up to 15 pages sequentially (fetch + 400ms polite delay
  // each) plus one AI classification call — comfortably past `slow` in the
  // worst case for a large site.
  audit: 45000,
  content: 60000,
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: TIMEOUTS.default,
})

client.interceptors.request.use((config) => {
  const isPublic = PUBLIC_PATHS.some((path) => config.url?.startsWith(path))
  if (!isPublic) {
    const token = localStorage.getItem('jwt')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    // A protected route with a missing/invalid JWT can come back as a bare
    // 403 from Spring Security's default filter-chain rejection (no JWT ever
    // reaches a controller to throw a "real" 401) — not just 401, so both
    // are treated as "please log in again".
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('jwt')
      localStorage.removeItem('authUser')
      if (!PUBLIC_PATHS.some((path) => error.config?.url?.startsWith(path))) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default client
