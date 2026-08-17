// Plain module-level cache (not React state/Context) so a tool page's last
// result + submitted form values survive unmounting when the user navigates
// to a different tool and back. Lives only for the tab's lifetime — resets
// on a full page reload, same as the rest of the SPA's in-memory state.
const cache = new Map()

export function getToolCache(key) {
  return cache.get(key)
}

export function setToolCache(key, value) {
  cache.set(key, value)
}

export function clearToolCache(key) {
  cache.delete(key)
}
