import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { research } from '../../../api/keyword'
import { useApi } from '../../../hooks/useApi'
import { getToolCache } from '../../../utils/toolCache'
import Input from '../../../components/common/Input'
import Button from '../../../components/common/Button'
import Card from '../../../components/common/Card'
import Badge from '../../../components/common/Badge'
import WaitState from '../../../components/tools/WaitState'
import ErrorBanner from '../../../components/tools/ErrorBanner'
import StatTile from '../../../components/tools/StatTile'

function difficultyVariant(difficulty) {
  const d = difficulty?.toLowerCase()
  if (d === 'easy') return 'emerald'
  if (d === 'hard') return 'rose'
  return 'amber' // medium / anything else
}

const CACHE_KEY = 'keyword'

export default function KeywordResearch() {
  const [topic, setTopic] = useState(() => getToolCache(CACHE_KEY)?.payload?.topic ?? '')
  const [formError, setFormError] = useState(null)
  const { data, error, loading, run, reset } = useApi(research, CACHE_KEY)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!topic.trim()) {
      setFormError('Please enter a topic.')
      return
    }
    setFormError(null)
    run({ topic: topic.trim() })
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-normal text-text sm:text-3xl">Keyword Research</h1>
      <p className="mt-1.5 text-text-muted">
        Intent, search volume signal, difficulty scoring, and AI-grouped topic clusters for any topic.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <Input
          label="Topic"
          type="text"
          placeholder="e.g. home espresso machines"
          value={topic}
          onChange={(e) => { setTopic(e.target.value); reset() }}
          className="flex-1"
        />
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Researching…' : 'Research'}
        </Button>
      </form>
      {formError && <p className="mt-2 text-sm" style={{ color: 'var(--color-accent-orange)' }}>{formError}</p>}

      <div className="mt-8">
        {loading && <WaitState label="Researching keywords…" note="Clustering topics and scoring difficulty — usually 5-15 seconds." />}
        {!loading && error && <ErrorBanner error={error} onRetry={() => run({ topic: topic.trim() })} />}
        {!loading && !error && data && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatTile stat={data.summary.totalKeywords} label="Keywords found" />
              <StatTile stat={data.summary.mainIntent} label="Main intent" />
              <StatTile stat={data.summary.avgDifficulty} label="Avg. difficulty" />
              <StatTile stat={data.summary.easyTargets} label="Easy targets" />
            </div>

            <Card hoverGlow={false} className="overflow-x-auto">
              <h3 className="font-heading text-base font-normal text-text">Keywords</h3>
              <table className="mt-4 w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-text-muted">
                    <th className="pb-2 pr-4 font-normal">Keyword</th>
                    <th className="pb-2 pr-4 font-normal">Intent</th>
                    <th className="pb-2 pr-4 font-normal">Type</th>
                    <th className="pb-2 font-normal">Difficulty</th>
                  </tr>
                </thead>
                <tbody>
                  {data.keywords.map((kw) => (
                    <tr key={kw.keyword} className="border-b border-border/60 last:border-0">
                      <td className="py-2.5 pr-4 text-text">{kw.keyword}</td>
                      <td className="py-2.5 pr-4"><Badge variant="slate">{kw.intent}</Badge></td>
                      <td className="py-2.5 pr-4"><Badge variant="slate">{kw.type}</Badge></td>
                      <td className="py-2.5"><Badge variant={difficultyVariant(kw.difficulty)}>{kw.difficulty}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card hoverGlow={false}>
              <h3 className="font-heading text-base font-normal text-text">Topic clusters</h3>
              <div className="mt-3 space-y-2">
                {data.clusters.map((cluster) => (
                  <details key={cluster.name} className="group rounded-xl border border-border bg-surface-2/40 px-4 py-3">
                    <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm text-text">
                      <span>{cluster.name} <span className="text-text-muted">({cluster.keywords.length})</span></span>
                      <ChevronDown size={16} className="shrink-0 text-text-muted transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {cluster.keywords.map((kw) => (
                        <Badge key={kw} variant="emerald">{kw}</Badge>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
