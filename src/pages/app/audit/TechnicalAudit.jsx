import { useState } from 'react'
import { ChevronDown, Info } from 'lucide-react'
import { run } from '../../../api/audit'
import { useApi } from '../../../hooks/useApi'
import { getToolCache } from '../../../utils/toolCache'
import Input from '../../../components/common/Input'
import Button from '../../../components/common/Button'
import Card from '../../../components/common/Card'
import Badge from '../../../components/common/Badge'
import WaitState from '../../../components/tools/WaitState'
import ErrorBanner from '../../../components/tools/ErrorBanner'
import StatTile from '../../../components/tools/StatTile'

const ISSUE_GROUPS = [
  { key: 'high', label: 'High priority', variant: 'rose' },
  { key: 'medium', label: 'Medium priority', variant: 'amber' },
  { key: 'low', label: 'Low priority', variant: 'slate' },
]

const PAGE_FLAGS = [
  ['brokenLink', 'Broken link'],
  ['missingTitle', 'Missing title'],
  ['missingMetaDescription', 'Missing meta description'],
  ['missingH1', 'Missing H1'],
  ['multipleH1', 'Multiple H1s'],
  ['missingCanonical', 'Missing canonical'],
  ['noIndex', 'noindex'],
]

function PageRow({ page }) {
  const flags = PAGE_FLAGS.filter(([key]) => page[key])
  if (page.imagesMissingAlt > 0) flags.push(['imagesMissingAlt', `${page.imagesMissingAlt} image(s) missing alt`])
  const isClean = flags.length === 0

  return (
    <details className="group rounded-xl border border-border bg-surface-2/40 px-4 py-3">
      <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm">
        <span className="min-w-0 truncate text-text">{page.url}</span>
        <span className="flex shrink-0 items-center gap-2">
          <Badge variant="slate">{page.statusCode}</Badge>
          {isClean ? (
            <Badge variant="emerald">Clean</Badge>
          ) : (
            <Badge variant="rose">{flags.length} issue{flags.length > 1 ? 's' : ''}</Badge>
          )}
          <ChevronDown size={16} className="text-text-muted transition-transform group-open:rotate-180" />
        </span>
      </summary>
      <div className="mt-3 space-y-2">
        {page.title && <p className="text-sm text-text-muted">Title: <span className="text-text">{page.title}</span></p>}
        <p className="text-sm text-text-muted">H1 count: <span className="text-text">{page.h1Count}</span></p>
        {isClean ? (
          <p className="text-sm text-text-muted">No issues found on this page.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {flags.map(([key, label]) => (
              <Badge key={key} variant={key === 'brokenLink' || key === 'noIndex' ? 'rose' : 'amber'}>{label}</Badge>
            ))}
          </div>
        )}
      </div>
    </details>
  )
}

const CACHE_KEY = 'audit'

export default function TechnicalAudit() {
  const [website, setWebsite] = useState(() => getToolCache(CACHE_KEY)?.payload?.website ?? '')
  const [formError, setFormError] = useState(null)
  const { data, error, loading, run: runAudit, reset } = useApi(run, CACHE_KEY)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!website.trim()) {
      setFormError('Please enter a website URL.')
      return
    }
    setFormError(null)
    runAudit({ website: website.trim() })
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-normal text-text sm:text-3xl">Technical Audit</h1>
      <p className="mt-1.5 text-text-muted">
        Crawls a site to find broken links, missing meta tags, and H1/H2 hierarchy issues.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <Input
          label="Website"
          type="text"
          placeholder="https://example.com"
          value={website}
          onChange={(e) => { setWebsite(e.target.value); reset() }}
          className="flex-1"
        />
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Auditing…' : 'Run audit'}
        </Button>
      </form>
      {formError && <p className="mt-2 text-sm" style={{ color: 'var(--color-accent-orange)' }}>{formError}</p>}

      <div className="mt-8">
        {loading && <WaitState label="Crawling site…" note="Checking up to 15 pages — this can take 15-30 seconds for larger sites." />}
        {!loading && error && <ErrorBanner error={error} onRetry={() => runAudit({ website: website.trim() })} />}
        {!loading && !error && data && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatTile stat={data.pagesCrawled} label="Pages crawled" />
              <StatTile stat={data.high.length} label="High priority" />
              <StatTile stat={data.medium.length} label="Medium priority" />
              <StatTile stat={data.low.length} label="Low priority" />
            </div>

            {data.pagesCrawled === 1 && (
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface-card/70 p-4 text-sm">
                <Info size={18} className="mt-0.5 shrink-0 text-primary" />
                <p className="text-text-muted">
                  Only one page was crawled. This often means the site renders its content with JavaScript —
                  our crawler reads raw HTML and can't execute scripts, so this isn't necessarily a crawl failure.
                </p>
              </div>
            )}

            {ISSUE_GROUPS.map(({ key, label, variant }) => (
              data[key].length > 0 && (
                <Card key={key} hoverGlow={false}>
                  <div className="flex items-center gap-2">
                    <Badge variant={variant}>{label}</Badge>
                    <span className="text-sm text-text-muted">({data[key].length})</span>
                  </div>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5">
                    {data[key].map((issue, i) => (
                      <li key={i} className="text-sm text-text-muted">{issue}</li>
                    ))}
                  </ul>
                </Card>
              )
            ))}

            <Card hoverGlow={false}>
              <h3 className="font-heading text-base font-normal text-text">Pages ({data.pages.length})</h3>
              <div className="mt-3 space-y-2">
                {data.pages.map((page) => (
                  <PageRow key={page.url} page={page} />
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
