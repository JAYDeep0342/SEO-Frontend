import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { ExternalLink } from 'lucide-react'
import { generate } from '../../../api/content'
import { useApi } from '../../../hooks/useApi'
import { getToolCache } from '../../../utils/toolCache'
import Input from '../../../components/common/Input'
import Button from '../../../components/common/Button'
import Card from '../../../components/common/Card'
import Badge from '../../../components/common/Badge'
import WaitState from '../../../components/tools/WaitState'
import ErrorBanner from '../../../components/tools/ErrorBanner'
import CopyButton from '../../../components/tools/CopyButton'
import StatTile from '../../../components/tools/StatTile'

// brief.faq is a flat alternating array — "Q: …", "A: …", "Q: …", "A: …" —
// not an array of {q,a} objects, so it has to be paired up at render time.
function pairFaq(faq) {
  const pairs = []
  for (let i = 0; i < faq.length; i += 2) {
    pairs.push({
      q: (faq[i] ?? '').replace(/^Q:\s*/i, ''),
      a: (faq[i + 1] ?? '').replace(/^A:\s*/i, ''),
    })
  }
  return pairs
}

const MARKDOWN_CLASSES = [
  '[&_h1]:font-heading [&_h1]:text-2xl [&_h1]:font-normal [&_h1]:text-text [&_h1]:mt-6 [&_h1]:mb-3',
  '[&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-normal [&_h2]:text-text [&_h2]:mt-6 [&_h2]:mb-3',
  '[&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-normal [&_h3]:text-text [&_h3]:mt-5 [&_h3]:mb-2',
  '[&_p]:text-sm [&_p]:text-text-muted [&_p]:leading-relaxed [&_p]:mb-3 [&_p]:break-words',
  '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:space-y-1',
  '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_ol]:space-y-1',
  '[&_li]:text-sm [&_li]:text-text-muted [&_li]:break-words',
  '[&_strong]:text-text [&_strong]:font-medium',
  '[&_a]:text-primary [&_a]:underline [&_a]:break-words',
  // Defensive — the article is prose and unlikely to contain code blocks,
  // but if the AI ever emits one, keep it from blowing out page width the
  // same way the Schema/robots.txt <pre> blocks could.
  '[&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border [&_pre]:bg-surface-2/40 [&_pre]:p-3',
  '[&_code]:text-xs',
].join(' ')

const CACHE_KEY = 'content'

export default function ContentGenerator() {
  const [keyword, setKeyword] = useState(() => getToolCache(CACHE_KEY)?.payload?.keyword ?? '')
  const [formError, setFormError] = useState(null)
  const { data, error, loading, run: runGenerate, reset } = useApi(generate, CACHE_KEY)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!keyword.trim()) {
      setFormError('Please enter a keyword.')
      return
    }
    setFormError(null)
    runGenerate({ keyword: keyword.trim() })
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-normal text-text sm:text-3xl">Content Generator</h1>
      <p className="mt-1.5 text-text-muted">
        Competitor-aware SERP briefs and a full AI-authored article, optimized for ranking, from a single keyword.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <Input
          label="Keyword"
          type="text"
          placeholder="e.g. best running shoes for beginners"
          value={keyword}
          onChange={(e) => { setKeyword(e.target.value); reset() }}
          className="flex-1"
        />
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Generating…' : 'Generate article'}
        </Button>
      </form>
      <p className="mt-2 text-xs text-text-muted">Uses one search + AI credit per generation.</p>
      {formError && <p className="mt-2 text-sm" style={{ color: 'var(--color-accent-orange)' }}>{formError}</p>}

      <div className="mt-8">
        {loading && (
          <WaitState
            label="Writing your article…"
            note="Researching competitors, building a brief, then drafting the full article — this can take up to a minute."
          />
        )}
        {!loading && error && <ErrorBanner error={error} onRetry={() => runGenerate({ keyword: keyword.trim() })} />}
        {!loading && !error && data && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <StatTile stat={data.wordCount} label="Words" />
              <StatTile stat={`${data.readingTimeMinutes} min`} label="Reading time" />
              <StatTile stat={`${data.keywordDensity}%`} label="Keyword density" />
            </div>

            <Card hoverGlow={false}>
              <h3 className="font-heading text-base font-normal text-text">Competitor research</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-text-muted">Common topics</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {data.competitor.commonTopics.map((t) => <Badge key={t} variant="slate">{t}</Badge>)}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Content gaps you can fill</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {data.competitor.gaps.map((g) => <Badge key={g} variant="emerald">{g}</Badge>)}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-text-muted">Average competitor length: {data.competitor.avgWords} words</p>
            </Card>

            <Card hoverGlow={false}>
              <h3 className="font-heading text-base font-normal text-text">Sources analyzed</h3>
              <ul className="mt-3 space-y-1.5">
                {data.sources.map((s) => (
                  <li key={s.link}>
                    <a href={s.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                      {s.title}
                      <ExternalLink size={12} />
                    </a>
                  </li>
                ))}
              </ul>
            </Card>

            <Card hoverGlow={false}>
              <h3 className="font-heading text-base font-normal text-text">Brief</h3>
              <p className="mt-2 text-sm text-text"><span className="text-text-muted">Title:</span> {data.brief.title}</p>
              <p className="mt-1 text-sm text-text"><span className="text-text-muted">Meta:</span> {data.brief.meta}</p>
              <p className="mt-1 text-sm text-text-muted">Target: {data.brief.wordTarget} words</p>
              <p className="mt-3 text-xs text-text-muted">Outline</p>
              <ol className="mt-1 list-decimal space-y-1 pl-5">
                {data.brief.outline.map((item, i) => <li key={i} className="text-sm text-text-muted">{item}</li>)}
              </ol>
              {data.brief.faq?.length > 0 && (
                <>
                  <p className="mt-4 text-xs text-text-muted">FAQ</p>
                  <div className="mt-2 space-y-3">
                    {pairFaq(data.brief.faq).map(({ q, a }, i) => (
                      <div key={i}>
                        <p className="text-sm text-text">{q}</p>
                        <p className="text-sm text-text-muted">{a}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>

            <Card hoverGlow={false}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-heading text-base font-normal text-text">Article</h3>
                <CopyButton text={data.content} label="Copy markdown" />
              </div>
              <div className={`mt-3 ${MARKDOWN_CLASSES}`}>
                <ReactMarkdown>{data.content}</ReactMarkdown>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
