import { useState } from 'react'
import { analyze } from '../../../api/pagespeed'
import { useApi } from '../../../hooks/useApi'
import { getToolCache } from '../../../utils/toolCache'
import Input from '../../../components/common/Input'
import Button from '../../../components/common/Button'
import Card from '../../../components/common/Card'
import WaitState from '../../../components/tools/WaitState'
import ErrorBanner from '../../../components/tools/ErrorBanner'
import ScoreGauge from '../../../components/tools/ScoreGauge'

const METRIC_LABELS = [
  ['fcp', 'First Contentful Paint'],
  ['lcp', 'Largest Contentful Paint'],
  ['tbt', 'Total Blocking Time'],
  ['cls', 'Cumulative Layout Shift'],
  ['ttfb', 'Time to First Byte'],
]

function DeviceCard({ label, metrics }) {
  const opportunities = [...(metrics.opportunities ?? [])].sort((a, b) => b.savingsMs - a.savingsMs)

  return (
    <Card hoverGlow={false}>
      <div className="flex flex-col items-center border-b border-border pb-5">
        <ScoreGauge score={metrics.performanceScore} label={label} size={140} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
        {METRIC_LABELS.map(([key, name]) => (
          <div key={key}>
            <p className="text-xs text-text-muted">{name}</p>
            <p className="text-sm text-text">{metrics[key] ?? '—'}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <h4 className="text-sm font-normal text-text">Opportunities</h4>
        {opportunities.length === 0 ? (
          <p className="mt-2 text-sm text-text-muted">No major opportunities — this page is well optimized.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {opportunities.map((op, i) => (
              <li key={i} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-text-muted">{op.title}</span>
                <span className="shrink-0 text-text">{op.displayValue}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}

const CACHE_KEY = 'pagespeed'

export default function PageSpeed() {
  const [url, setUrl] = useState(() => getToolCache(CACHE_KEY)?.payload?.url ?? '')
  const [formError, setFormError] = useState(null)
  const { data, error, loading, run, reset } = useApi(analyze, CACHE_KEY)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!url.trim()) {
      setFormError('Please enter a URL.')
      return
    }
    setFormError(null)
    run({ url: url.trim() })
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-normal text-text sm:text-3xl">PageSpeed Insights</h1>
      <p className="mt-1.5 text-text-muted">
        Mobile and desktop performance scoring with a prioritized optimization roadmap.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <Input
          label="Page URL"
          type="text"
          placeholder="https://example.com/page"
          value={url}
          onChange={(e) => { setUrl(e.target.value); reset() }}
          className="flex-1"
        />
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Analyzing…' : 'Analyze'}
        </Button>
      </form>
      {formError && <p className="mt-2 text-sm" style={{ color: 'var(--color-accent-orange)' }}>{formError}</p>}

      <div className="mt-8">
        {loading && <WaitState label="Running PageSpeed…" note="Testing mobile and desktop performance — usually 10-20 seconds." />}
        {!loading && error && <ErrorBanner error={error} onRetry={() => run({ url: url.trim() })} />}
        {!loading && !error && data && (
          <div className="grid gap-6 md:grid-cols-2">
            <DeviceCard label="Mobile" metrics={data.mobile} />
            <DeviceCard label="Desktop" metrics={data.desktop} />
          </div>
        )}
      </div>
    </div>
  )
}
