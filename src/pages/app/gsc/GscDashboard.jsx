import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PlugZap, Search } from 'lucide-react'
import * as gscApi from '../../../api/gsc'
import { useApi } from '../../../hooks/useApi'
import { defaultGscRange, isValidSiteUrl } from '../../../utils/dateRange'
import { isGscNotConnected } from '../../../utils/errors'
import { getToolCache, setToolCache } from '../../../utils/toolCache'
import Input from '../../../components/common/Input'
import Button from '../../../components/common/Button'
import Card from '../../../components/common/Card'
import Badge from '../../../components/common/Badge'
import WaitState from '../../../components/tools/WaitState'
import ErrorBanner from '../../../components/tools/ErrorBanner'
import EmptyState from '../../../components/tools/EmptyState'
import StatTile from '../../../components/tools/StatTile'
import GscTrendChart from '../../../components/tools/GscTrendChart'

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'performance', label: 'Performance' },
  { key: 'insights', label: 'Insights' },
]

function ConnectPrompt() {
  return (
    <EmptyState
      icon={PlugZap}
      title="Connect Google Search Console"
      description="You'll need to connect your Google account before we can pull live Search Console data."
      action={<Button as={Link} to="/app/gsc/connect" variant="primary" size="sm" className="mt-2">Connect Google</Button>}
    />
  )
}

function OverviewTab({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile stat={data.totalClicks.toLocaleString()} label="Total clicks" />
        <StatTile stat={data.totalImpressions.toLocaleString()} label="Total impressions" />
        <StatTile stat={`${(data.avgCtr * 100).toFixed(1)}%`} label="Avg. CTR" />
        <StatTile stat={data.avgPosition.toFixed(1)} label="Avg. position" />
      </div>
      <Card hoverGlow={false}>
        <GscTrendChart data={data.trend} />
      </Card>
    </div>
  )
}

function PerformanceTab({ data }) {
  const { overview, rows } = data
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <StatTile stat={overview.totalClicks.toLocaleString()} label="Clicks" />
        <StatTile stat={overview.totalImpressions.toLocaleString()} label="Impressions" />
        <StatTile stat={`${(overview.avgCtr * 100).toFixed(1)}%`} label="Avg. CTR" />
        <StatTile stat={overview.avgPosition.toFixed(1)} label="Avg. position" />
        <StatTile stat={overview.totalKeywords} label="Keywords" />
      </div>
      <Card hoverGlow={false} className="overflow-x-auto">
        <h3 className="font-heading text-base font-normal text-text">Keywords</h3>
        <table className="mt-4 w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-text-muted">
              <th className="pb-2 pr-4 font-normal">Keyword</th>
              <th className="pb-2 pr-4 font-normal">Clicks</th>
              <th className="pb-2 pr-4 font-normal">Impressions</th>
              <th className="pb-2 pr-4 font-normal">CTR</th>
              <th className="pb-2 font-normal">Position</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.keyword} className="border-b border-border/60 last:border-0">
                <td className="py-2.5 pr-4 text-text">{row.keyword}</td>
                <td className="py-2.5 pr-4 text-text-muted">{row.clicks.toLocaleString()}</td>
                <td className="py-2.5 pr-4 text-text-muted">{row.impressions.toLocaleString()}</td>
                <td className="py-2.5 pr-4 text-text-muted">{(row.ctr * 100).toFixed(1)}%</td>
                <td className="py-2.5 text-text-muted">{row.position.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

function InsightItemCard({ item }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2/40 p-3">
      <p className="text-sm text-text">{item.keyword}</p>
      <p className="mt-1 text-xs text-text-muted">
        Pos {item.position.toFixed(1)} · {item.impressions.toLocaleString()} impr · {item.clicks.toLocaleString()} clicks · {(item.ctr * 100).toFixed(1)}% CTR
      </p>
      <p className="mt-2 text-sm text-text-muted">{item.suggestion}</p>
    </div>
  )
}

function InsightGroup({ title, items }) {
  return (
    <Card hoverGlow={false}>
      <h3 className="font-heading text-base font-normal text-text">
        {title} <span className="text-text-muted">({items.length})</span>
      </h3>
      <div className="mt-3 space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-text-muted">Nothing here right now.</p>
        ) : (
          items.map((item) => <InsightItemCard key={item.keyword} item={item} />)
        )}
      </div>
    </Card>
  )
}

function InsightsTab({ data }) {
  return (
    <div className="space-y-6">
      {data.summary && (
        <div className="rounded-2xl border border-primary/25 bg-primary/10 p-4 text-sm text-text">
          {data.summary}
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-3">
        <InsightGroup title="Quick wins" items={data.quickWins} />
        <InsightGroup title="Content gaps" items={data.contentGaps} />
        <InsightGroup title="CTR opportunities" items={data.ctrOpportunities} />
      </div>
    </div>
  )
}

const GSC_UI_KEY = 'gsc-ui'

export default function GscDashboard() {
  const cachedUi = getToolCache(GSC_UI_KEY)
  const initialRange = defaultGscRange()
  const [siteUrl, setSiteUrl] = useState(() => cachedUi?.siteUrl ?? '')
  const [startDate, setStartDate] = useState(() => cachedUi?.startDate ?? initialRange.startDate)
  const [endDate, setEndDate] = useState(() => cachedUi?.endDate ?? initialRange.endDate)
  const [activeTab, setActiveTab] = useState(() => cachedUi?.activeTab ?? 'overview')
  const [siteUrlError, setSiteUrlError] = useState(null)
  const [lastFetchedKey, setLastFetchedKey] = useState(
    () => cachedUi?.lastFetchedKey ?? { overview: null, performance: null, insights: null },
  )

  // There's no "am I connected?" endpoint, so we probe with a throwaway
  // check call the moment this page loads — before showing the site/date
  // form at all — rather than waiting for the user to hit Run and only
  // then discovering they need to connect Google. The JWT is still
  // attached automatically by client.js on this call, same as every other
  // request; connecting Google doesn't replace being logged in, it's an
  // additional requirement on top of it.
  const [connectionStatus, setConnectionStatus] = useState('checking') // checking | connected | not-connected

  useEffect(() => {
    let cancelled = false
    gscApi
      .check({ siteUrl: 'https://example.com/' })
      .then(() => { if (!cancelled) setConnectionStatus('connected') })
      .catch((err) => {
        if (cancelled) return
        setConnectionStatus(isGscNotConnected(err) ? 'not-connected' : 'connected')
      })
    return () => { cancelled = true }
  }, [])

  const overviewApi = useApi(gscApi.overview, 'gsc-overview')
  const performanceApi = useApi(gscApi.performance, 'gsc-performance')
  const insightsApi = useApi(gscApi.insights, 'gsc-insights')
  const checkApi = useApi(gscApi.check, 'gsc-check')
  const apiForTab = { overview: overviewApi, performance: performanceApi, insights: insightsApi }

  const currentKey = `${siteUrl}|${startDate}|${endDate}`
  const active = apiForTab[activeTab]

  // Persist the shared form/tab state (the results themselves are already
  // cached per-tab by useApi) so navigating away and back restores exactly
  // where the user left off, instead of resetting to a blank form.
  useEffect(() => {
    setToolCache(GSC_UI_KEY, { siteUrl, startDate, endDate, activeTab, lastFetchedKey })
  }, [siteUrl, startDate, endDate, activeTab, lastFetchedKey])

  const handleRun = () => {
    if (!siteUrl.trim()) {
      setSiteUrlError('Please enter a site URL.')
      return
    }
    if (!isValidSiteUrl(siteUrl)) {
      setSiteUrlError('Site URL must start with http://, https://, or sc-domain:')
      return
    }
    setSiteUrlError(null)
    const payload = { siteUrl: siteUrl.trim(), startDate, endDate }
    apiForTab[activeTab].run(payload)
    setLastFetchedKey((prev) => ({ ...prev, [activeTab]: currentKey }))
    checkApi.run({ siteUrl: siteUrl.trim() }).catch(() => {})
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    // Lazy per-tab fetch — only re-hits the API if this tab hasn't been
    // loaded yet for the current site/date-range combination.
    if (siteUrl.trim() && isValidSiteUrl(siteUrl) && lastFetchedKey[tab] !== currentKey) {
      apiForTab[tab].run({ siteUrl: siteUrl.trim(), startDate, endDate })
      setLastFetchedKey((prev) => ({ ...prev, [tab]: currentKey }))
    }
  }

  if (connectionStatus === 'checking') {
    return (
      <div>
        <h1 className="font-heading text-2xl font-normal text-text sm:text-3xl">Search Console Insights</h1>
        <p className="mt-1.5 text-text-muted">
          Actionable CTR quick wins, low-hanging fruit, and content gap analytics from live Google Search Console.
        </p>
        <div className="mt-8">
          <WaitState label="Checking Google connection…" />
        </div>
      </div>
    )
  }

  if (connectionStatus === 'not-connected') {
    return (
      <div>
        <h1 className="font-heading text-2xl font-normal text-text sm:text-3xl">Search Console Insights</h1>
        <p className="mt-1.5 text-text-muted">
          Actionable CTR quick wins, low-hanging fruit, and content gap analytics from live Google Search Console.
        </p>
        <div className="mt-8">
          <ConnectPrompt />
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-normal text-text sm:text-3xl">Search Console Insights</h1>
      <p className="mt-1.5 text-text-muted">
        Actionable CTR quick wins, low-hanging fruit, and content gap analytics from live Google Search Console.
      </p>

      <Card hoverGlow={false} className="mt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <Input
            label="Site URL"
            type="text"
            placeholder="https://example.com/ or sc-domain:example.com"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            className="min-w-[260px] flex-1"
          />
          <Input label="Start date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input label="End date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <Button variant="primary" onClick={handleRun} disabled={active.loading}>
            <Search size={15} />
            Run
          </Button>
        </div>
        {siteUrlError && <p className="mt-2 text-sm" style={{ color: 'var(--color-accent-orange)' }}>{siteUrlError}</p>}
        {checkApi.data && (
          <div className="mt-3 flex items-center gap-2">
            <Badge variant={checkApi.data.verified ? 'emerald' : 'slate'}>
              {checkApi.data.verified ? `Verified${checkApi.data.permission ? ` · ${checkApi.data.permission}` : ''}` : 'Not verified'}
            </Badge>
            {checkApi.data.message && <span className="text-xs text-text-muted">{checkApi.data.message}</span>}
          </div>
        )}
      </Card>

      <div className="mt-6 inline-flex rounded-full border border-border bg-surface-2/60 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleTabChange(tab.key)}
            className={`rounded-full px-4 py-1.5 text-sm transition-all ${
              activeTab === tab.key ? 'bg-primary text-[#061006] shadow-sm' : 'text-text-muted hover:text-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {active.loading && <WaitState label={`Loading ${activeTab}…`} />}
        {!active.loading && active.error && (
          isGscNotConnected(active.error)
            ? <ConnectPrompt />
            : <ErrorBanner error={active.error} onRetry={() => apiForTab[activeTab].run({ siteUrl: siteUrl.trim(), startDate, endDate })} />
        )}
        {!active.loading && !active.error && !active.data && (
          <EmptyState icon={Search} title="Run a report" description="Enter a site URL and date range above, then hit Run." />
        )}
        {!active.loading && !active.error && active.data && activeTab === 'overview' && <OverviewTab data={active.data} />}
        {!active.loading && !active.error && active.data && activeTab === 'performance' && <PerformanceTab data={active.data} />}
        {!active.loading && !active.error && active.data && activeTab === 'insights' && <InsightsTab data={active.data} />}
      </div>
    </div>
  )
}
