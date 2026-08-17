import { useState } from 'react'
import { FileWarning } from 'lucide-react'
import { analyze } from '../../../api/robots'
import { useApi } from '../../../hooks/useApi'
import { getToolCache } from '../../../utils/toolCache'
import Input from '../../../components/common/Input'
import Button from '../../../components/common/Button'
import Card from '../../../components/common/Card'
import Badge from '../../../components/common/Badge'
import WaitState from '../../../components/tools/WaitState'
import ErrorBanner from '../../../components/tools/ErrorBanner'
import EmptyState from '../../../components/tools/EmptyState'
import CopyButton from '../../../components/tools/CopyButton'

const LEVEL_VARIANT = { HIGH: 'rose', MEDIUM: 'amber', LOW: 'slate' }

const CACHE_KEY = 'robots'

export default function RobotsAnalyzer() {
  const [siteUrl, setSiteUrl] = useState(() => getToolCache(CACHE_KEY)?.payload?.siteUrl ?? '')
  const [formError, setFormError] = useState(null)
  const { data, error, loading, run, reset } = useApi(analyze, CACHE_KEY)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!siteUrl.trim()) {
      setFormError('Please enter a site URL.')
      return
    }
    setFormError(null)
    run({ siteUrl: siteUrl.trim() })
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-normal text-text sm:text-3xl">robots.txt Analyzer</h1>
      <p className="mt-1.5 text-text-muted">
        Checks robots.txt syntax, sitemap presence, and whole-site disallow blocks for a domain.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <Input
          label="Site URL"
          type="text"
          placeholder="https://example.com"
          value={siteUrl}
          onChange={(e) => { setSiteUrl(e.target.value); reset() }}
          className="flex-1"
        />
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Analyzing…' : 'Analyze'}
        </Button>
      </form>
      {formError && <p className="mt-2 text-sm" style={{ color: 'var(--color-accent-orange)' }}>{formError}</p>}

      <div className="mt-8">
        {loading && <WaitState label="Fetching robots.txt…" />}
        {!loading && error && <ErrorBanner error={error} onRetry={() => run({ siteUrl: siteUrl.trim() })} />}
        {!loading && !error && data && !data.found && (
          <EmptyState
            icon={FileWarning}
            title="No robots.txt found"
            description={data.message ?? 'This site does not have a robots.txt file.'}
          />
        )}
        {!loading && !error && data && data.found && (
          <div className="space-y-6">
            <Card hoverGlow={false}>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={data.sitemapPresent ? 'emerald' : 'slate'}>
                  {data.sitemapPresent ? 'Sitemap present' : 'No sitemap declared'}
                </Badge>
                <Badge variant={data.wholeSiteBlocked ? 'rose' : 'emerald'}>
                  {data.wholeSiteBlocked ? 'Whole site blocked' : 'Site crawlable'}
                </Badge>
              </div>
              {data.verdict && <p className="mt-3 text-sm text-text">{data.verdict}</p>}
              {data.message && <p className="mt-1 text-sm text-text-muted">{data.message}</p>}
            </Card>

            {data.issues?.length > 0 && (
              <Card hoverGlow={false}>
                <h3 className="font-heading text-base font-normal text-text">Issues</h3>
                <ul className="mt-4 space-y-2.5">
                  {data.issues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Badge variant={LEVEL_VARIANT[issue.level] ?? 'slate'} className="mt-0.5 shrink-0">
                        {issue.level}
                      </Badge>
                      <span className="text-sm text-text-muted">{issue.message}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {data.content && (
              <Card hoverGlow={false}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-heading text-base font-normal text-text">robots.txt</h3>
                  <CopyButton text={data.content} />
                </div>
                <pre className="mt-3 max-h-96 max-w-full overflow-auto rounded-xl border border-border bg-surface-2/40 p-4 text-xs text-text">
                  {data.content}
                </pre>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
