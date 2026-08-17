import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { APP_NAV_ITEMS } from '../../config/tools'

export default function ToolSearch({ className = '' }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const rootRef = useRef(null)

  const results = query.trim()
    ? APP_NAV_ITEMS.filter((item) => item.title.toLowerCase().includes(query.trim().toLowerCase()))
    : APP_NAV_ITEMS

  useEffect(() => {
    const onClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const goTo = (route) => {
    navigate(route)
    setQuery('')
    setOpen(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && results.length > 0) goTo(results[0].route)
    if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <div className="flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-4 py-2 transition-colors focus-within:border-primary/50">
        <Search size={16} className="shrink-0 text-text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search tools…"
          className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
        />
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-border bg-surface shadow-xl backdrop-blur-2xl">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-text-muted">No tools found.</p>
          ) : (
            results.map(({ icon: Icon, title, description, route }) => (
              <button
                key={route}
                type="button"
                onClick={() => goTo(route)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-surface-2/60"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon size={15} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm text-text">{title}</span>
                  <span className="block truncate text-xs text-text-muted">{description}</span>
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
