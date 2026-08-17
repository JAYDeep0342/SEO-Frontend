import { useCallback, useState } from 'react'
import { clearToolCache, getToolCache, setToolCache } from '../utils/toolCache'

// One instance per tool page: { data, error, loading, run, reset }.
// `run` returns the resolved data so callers can `await` it if needed, and
// re-throws so a caller-side try/catch can react too — the hook's own
// `error` state is enough for the common "just render it" case though.
//
// Pass a `cacheKey` (unique per tool, e.g. 'keyword') to survive navigating
// away and back — the last result/error/payload is stashed in a
// module-level cache and used to hydrate state on mount, instead of every
// tool page starting blank each time it remounts.
export function useApi(apiFn, cacheKey) {
  const cached = cacheKey ? getToolCache(cacheKey) : null
  const [data, setData] = useState(cached?.data ?? null)
  const [error, setError] = useState(cached?.error ?? null)
  const [loading, setLoading] = useState(false)

  const run = useCallback(
    async (...args) => {
      setLoading(true)
      setError(null)
      try {
        const result = await apiFn(...args)
        setData(result)
        if (cacheKey) setToolCache(cacheKey, { data: result, error: null, payload: args[0] })
        return result
      } catch (err) {
        setError(err)
        if (cacheKey) setToolCache(cacheKey, { data: null, error: err, payload: args[0] })
        throw err
      } finally {
        setLoading(false)
      }
    },
    [apiFn, cacheKey],
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
    if (cacheKey) clearToolCache(cacheKey)
  }, [cacheKey])

  return { data, error, loading, run, reset }
}
