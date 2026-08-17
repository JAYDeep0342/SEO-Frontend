import { useState } from 'react'
import { generate } from '../../../api/schema'
import { useApi } from '../../../hooks/useApi'
import { getToolCache } from '../../../utils/toolCache'
import Input from '../../../components/common/Input'
import Button from '../../../components/common/Button'
import Card from '../../../components/common/Card'
import WaitState from '../../../components/tools/WaitState'
import ErrorBanner from '../../../components/tools/ErrorBanner'
import CopyButton from '../../../components/tools/CopyButton'
import TopicOrUrlToggle from '../../../components/tools/TopicOrUrlToggle'

const CACHE_KEY = 'schema'

export default function SchemaMarkup() {
  const cachedPayload = getToolCache(CACHE_KEY)?.payload
  const [mode, setMode] = useState(() => (cachedPayload?.url ? 'url' : 'topic'))
  const [topic, setTopic] = useState(() => cachedPayload?.topic ?? '')
  const [url, setUrl] = useState(() => cachedPayload?.url ?? '')
  const [schemaType, setSchemaType] = useState(() => cachedPayload?.schemaType ?? '')
  const [formError, setFormError] = useState(null)
  const { data, error, loading, run, reset } = useApi(generate, CACHE_KEY)

  const activeValue = mode === 'topic' ? topic : url

  const buildPayload = () => ({
    topic: mode === 'topic' ? activeValue.trim() : '',
    url: mode === 'url' ? activeValue.trim() : '',
    schemaType: schemaType.trim() || undefined,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!activeValue.trim()) {
      setFormError(mode === 'topic' ? 'Please enter a topic.' : 'Please enter a URL.')
      return
    }
    setFormError(null)
    run(buildPayload())
  }

  const handleModeChange = (next) => {
    setMode(next)
    reset()
  }

  const prettyJson = data ? JSON.stringify(data.jsonLd, null, 2) : ''
  const scriptEmbed = data ? `<script type="application/ld+json">\n${prettyJson}\n</script>` : ''

  return (
    <div>
      <h1 className="font-heading text-2xl font-normal text-text sm:text-3xl">Schema Markup</h1>
      <p className="mt-1.5 text-text-muted">
        Generate rich-snippet valid JSON-LD structured data for any topic, entity, or existing page.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <TopicOrUrlToggle
          mode={mode} onModeChange={handleModeChange}
          topic={topic} onTopicChange={(v) => { setTopic(v); reset() }}
          url={url} onUrlChange={(v) => { setUrl(v); reset() }}
        />
        <Input
          label="Schema type (optional)"
          type="text"
          placeholder="e.g. Article, Product, FAQPage"
          value={schemaType}
          onChange={(e) => { setSchemaType(e.target.value); reset() }}
          className="max-w-xs"
        />
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Generating…' : 'Generate'}
        </Button>
      </form>
      {formError && <p className="mt-2 text-sm" style={{ color: 'var(--color-accent-orange)' }}>{formError}</p>}

      <div className="mt-8">
        {loading && <WaitState label="Building schema…" note="Usually takes a few seconds." />}
        {!loading && error && <ErrorBanner error={error} onRetry={() => run(buildPayload())} />}
        {!loading && !error && data && (
          <div className="space-y-6">
            <Card hoverGlow={false}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-heading text-base font-normal text-text">
                  {data.schemaType} JSON-LD
                </h3>
                <CopyButton text={prettyJson} label="Copy JSON" />
              </div>
              <pre className="mt-3 max-h-96 max-w-full overflow-auto rounded-xl border border-border bg-surface-2/40 p-4 text-xs text-text">
                {prettyJson}
              </pre>
            </Card>

            <Card hoverGlow={false}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-heading text-base font-normal text-text">Embed code</h3>
                <CopyButton text={scriptEmbed} label="Copy embed" />
              </div>
              <pre className="mt-3 max-h-96 max-w-full overflow-auto rounded-xl border border-border bg-surface-2/40 p-4 text-xs text-text">
                {scriptEmbed}
              </pre>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
