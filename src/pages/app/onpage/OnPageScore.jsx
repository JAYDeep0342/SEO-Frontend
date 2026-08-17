import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { analyze } from '../../../api/onPage'
import { useApi } from '../../../hooks/useApi'
import { getToolCache } from '../../../utils/toolCache'
import Input from '../../../components/common/Input'
import Button from '../../../components/common/Button'
import Card from '../../../components/common/Card'
import WaitState from '../../../components/tools/WaitState'
import ErrorBanner from '../../../components/tools/ErrorBanner'
import ScoreGauge from '../../../components/tools/ScoreGauge'

const CACHE_KEY = 'onpage'

export default function OnPageScore() {
  const [url, setUrl] = useState(() => getToolCache(CACHE_KEY)?.payload?.url ?? '')
  const [formError, setFormError] = useState(null)
  const { data, error, loading, run, reset } = useApi(analyze, CACHE_KEY)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!url.trim()) {
      setFormError('Please enter a URL to analyze.')
      return
    }
    setFormError(null)
    run({ url: url.trim() })
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-normal text-text sm:text-3xl">On-Page Score</h1>
      <p className="mt-1.5 text-text-muted">
        A 7-point audit of a single page's title, meta description, headings, canonical tag, indexability, image alt text, and content length.
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
          {loading ? 'Analyzing…' : 'Analyze page'}
        </Button>
      </form>
      {formError && <p className="mt-2 text-sm" style={{ color: 'var(--color-accent-orange)' }}>{formError}</p>}

      <div className="mt-8">
        {loading && <WaitState label="Analyzing page…" note="Fetching the page and running the 7-point check — usually a few seconds." />}
        {!loading && error && <ErrorBanner error={error} onRetry={() => run({ url: url.trim() })} />}
        {!loading && !error && data && (
          <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
            <Card hoverGlow={false} className="flex flex-col items-center justify-center">
              <ScoreGauge score={data.score} label="On-Page Score" size={160} />
            </Card>

            <Card hoverGlow={false}>
              <h3 className="font-heading text-base font-normal text-text">Checks</h3>
              <ul className="mt-4 space-y-3">
                {data.checks.map((check) => (
                  <li key={check.name} className="flex items-start gap-3">
                    {check.passed ? (
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                    ) : (
                      <XCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
                    )}
                    <div>
                      <p className="text-sm text-text">{check.name}</p>
                      <p className="text-sm text-text-muted">{check.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            {data.suggestions?.length > 0 && (
              <Card hoverGlow={false} className="lg:col-span-2">
                <h3 className="font-heading text-base font-normal text-text">Suggestions</h3>
                <ul className="mt-3 list-disc space-y-1.5 pl-5">
                  {data.suggestions.map((s, i) => (
                    <li key={i} className="text-sm text-text-muted">{s}</li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
