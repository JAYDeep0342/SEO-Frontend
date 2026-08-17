import { AlertTriangle, RotateCw } from 'lucide-react'
import Button from '../common/Button'
import { getErrorMessage, isRetryable503 } from '../../utils/errors'

// Accepts either a raw axios error (`error`) or a plain string (`message`) —
// pages with their own client-side validation (Login/Signup) pass `message`
// directly since there's no axios error to unwrap yet.
export default function ErrorBanner({ error, message, onRetry }) {
  const text = message ?? getErrorMessage(error)
  const showRetry = onRetry && error && isRetryable503(error)

  return (
    <div className="flex items-start gap-3 rounded-2xl border p-4 text-sm"
      style={{ borderColor: 'var(--color-accent-orange)', background: 'color-mix(in srgb, var(--color-accent-orange) 10%, transparent)' }}
    >
      <AlertTriangle size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--color-accent-orange)' }} />
      <div className="flex-1">
        <p className="text-text">{text}</p>
        {showRetry && (
          <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
            <RotateCw size={14} />
            Retry
          </Button>
        )}
      </div>
    </div>
  )
}
