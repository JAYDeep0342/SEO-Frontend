import { useState } from 'react'
import { generate } from '../../../api/metaTag'
import { useApi } from '../../../hooks/useApi'
import { getToolCache } from '../../../utils/toolCache'
import Button from '../../../components/common/Button'
import Card from '../../../components/common/Card'
import Badge from '../../../components/common/Badge'
import WaitState from '../../../components/tools/WaitState'
import ErrorBanner from '../../../components/tools/ErrorBanner'
import CopyButton from '../../../components/tools/CopyButton'
import TopicOrUrlToggle from '../../../components/tools/TopicOrUrlToggle'

const CACHE_KEY = 'meta-tags'

export default function MetaTagGenerator() {
  const cachedPayload = getToolCache(CACHE_KEY)?.payload
  const [mode, setMode] = useState(() => (cachedPayload?.url ? 'url' : 'topic'))
  const [topic, setTopic] = useState(() => cachedPayload?.topic ?? '')
  const [url, setUrl] = useState(() => cachedPayload?.url ?? '')
  const [formError, setFormError] = useState(null)
  const { data, error, loading, run, reset } = useApi(generate, CACHE_KEY)

  const activeValue = mode === 'topic' ? topic : url

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!activeValue.trim()) {
      setFormError(mode === 'topic' ? 'Please enter a topic.' : 'Please enter a URL.')
      return
    }
    setFormError(null)
    run({
      topic: mode === 'topic' ? activeValue.trim() : '',
      url: mode === 'url' ? activeValue.trim() : '',
    })
  }

  const handleModeChange = (next) => {
    setMode(next)
    reset()
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-normal text-text sm:text-3xl">Meta Tag Generator</h1>
      <p className="mt-1.5 text-text-muted">
        Generate high-CTR title tag options, a meta description, and target keywords — from a topic or an existing page.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <TopicOrUrlToggle
          mode={mode} onModeChange={handleModeChange}
          topic={topic} onTopicChange={(v) => { setTopic(v); reset() }}
          url={url} onUrlChange={(v) => { setUrl(v); reset() }}
        />
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Generating…' : 'Generate'}
        </Button>
      </form>
      {formError && <p className="mt-2 text-sm" style={{ color: 'var(--color-accent-orange)' }}>{formError}</p>}

      <div className="mt-8">
        {loading && <WaitState label="Writing meta tags…" note="Usually takes a few seconds." />}
        {!loading && error && <ErrorBanner error={error} onRetry={() => run({ topic: mode === 'topic' ? activeValue.trim() : '', url: mode === 'url' ? activeValue.trim() : '' })} />}
        {!loading && !error && data && (
          <div className="space-y-6">
            <Card hoverGlow={false}>
              <h3 className="font-heading text-base font-normal text-text">Title options</h3>
              <ul className="mt-4 space-y-2">
                {data.titleOptions.map((title, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-2/40 px-4 py-2.5">
                    <span className="text-sm text-text">{title}</span>
                    <CopyButton text={title} />
                  </li>
                ))}
              </ul>
            </Card>

            <Card hoverGlow={false}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-heading text-base font-normal text-text">Meta description</h3>
                <CopyButton text={data.metaDescription} />
              </div>
              <p className="mt-3 text-sm text-text-muted leading-relaxed">{data.metaDescription}</p>

              {/* Mini SERP-style preview — a fixed white card regardless of
                  site theme, since this previews how the result actually
                  looks on Google's (always-light) results page. */}
              <div className="mt-4 rounded-xl border border-[#dfe1e5] bg-white p-4">
                <p className="truncate text-sm text-[#006621]">{mode === 'url' ? url : 'example.com'}</p>
                <p className="truncate text-lg text-[#1a0dab]">{data.titleOptions[0]}</p>
                <p className="mt-1 text-sm text-[#4d5156]">{data.metaDescription}</p>
              </div>
            </Card>

            <Card hoverGlow={false}>
              <h3 className="font-heading text-base font-normal text-text">Keywords</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {data.keywords.map((kw) => (
                  <Badge key={kw} variant="emerald">{kw}</Badge>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
