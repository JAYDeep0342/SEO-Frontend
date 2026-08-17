import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Section from '../../components/common/Section'

// Real analytics-widget charts (donut / line / bar) — titled, gridded,
// axis-labelled and legended, same structural language as a proper
// dashboard export (title top-left, legend top-right, gridlines, axis
// ticks). Each card gets its own saturated hue from the purple family
// (indigo/violet/fuchsia/rose) so the section reads as colorful rather
// than one flat tone repeated four times; no icons, no logos — the
// chart itself is the illustration.
function ChartTitle({ title, legend, c }) {
  return (
    <>
      <text x="14" y="18" fontSize="11" fontWeight="700" fill={c.ink}>{title}</text>
      {legend && (
        <g transform="translate(0,10)">
          {legend.map((item, i) => (
            <g key={item} transform={`translate(${200 - legend.length * 62 + i * 62}, 0)`}>
              <rect width="8" height="8" rx="2" fill={i === legend.length - 1 ? c.ink : c.secondary} />
              <text x="12" y="8" fontSize="8" fill={c.muted}>{item}</text>
            </g>
          ))}
        </g>
      )}
    </>
  )
}

function DonutChart({ c }) {
  const r = 40
  const circ = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 200 150" className="h-full w-full">
      <ChartTitle title="Suite Coverage" c={c} />
      <g transform="translate(62,88)">
        <circle r={r} fill="none" stroke={c.soft} strokeWidth="15" />
        <motion.circle
          r={r} fill="none" stroke={c.ink} strokeWidth="15" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * 0.05 }}
          transition={{ duration: 1.3, ease: 'easeOut' }}
          transform="rotate(-90)"
        />
        <text textAnchor="middle" dy="7" fontSize="24" fontWeight="700" fill={c.ink}>9</text>
      </g>
      <g transform="translate(126,62)">
        <rect width="9" height="9" rx="2" fill={c.ink} />
        <text x="14" y="8.5" fontSize="9" fill={c.muted}>Live tools</text>
      </g>
      <g transform="translate(126,84)">
        <rect width="9" height="9" rx="2" fill={c.soft} />
        <text x="14" y="8.5" fontSize="9" fill={c.muted}>Capacity</text>
      </g>
      <text x="126" y="112" fontSize="9" fill={c.muted}>9 of 9 active</text>
    </svg>
  )
}

function LineChart({ c }) {
  const d = 'M22,96 C40,90 52,58 70,64 C86,70 100,40 118,44 C132,47 146,28 164,24'
  const area = `${d} L164,120 L22,120 Z`
  const gridYs = [30, 58, 86, 114]
  const labels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6']
  return (
    <svg viewBox="0 0 200 150" className="h-full w-full">
      <ChartTitle title="Draft Speed" legend={['AI-assisted']} c={c} />
      <defs>
        <linearGradient id="aboutLineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.ink} stopOpacity="0.28" />
          <stop offset="100%" stopColor={c.ink} stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridYs.map((y) => (
        <line key={y} x1="22" x2="178" y1={y} y2={y} stroke={c.soft} strokeWidth="1" />
      ))}
      <motion.path
        d={area} fill="url(#aboutLineFill)" stroke="none"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }}
      />
      <motion.path
        d={d} fill="none" stroke={c.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0.4 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      <motion.circle
        cx="164" cy="24" r="3.5" fill={c.ink}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.1, duration: 0.25 }}
      />
      <line x1="22" y1="120" x2="178" y2="120" stroke={c.ink} strokeOpacity="0.3" strokeWidth="1" />
      {labels.map((lbl, i) => (
        <text key={lbl} x={22 + i * 31.2} y="134" fontSize="8" fill={c.muted} textAnchor="middle">{lbl}</text>
      ))}
    </svg>
  )
}

function BarChart({ c }) {
  const categories = ['Speed', 'SEO', 'Security', 'Content']
  const before = [42, 50, 38, 45]
  const after = [78, 88, 92, 84]
  const baseY = 112
  const scale = 0.66
  const gridYs = [30, 52, 74, 96]
  return (
    <svg viewBox="0 0 200 150" className="h-full w-full">
      <ChartTitle title="Audit Score" legend={['Before', 'With Us']} c={c} />
      {gridYs.map((y) => (
        <line key={y} x1="20" x2="182" y1={y} y2={y} stroke={c.soft} strokeWidth="1" />
      ))}
      {categories.map((cat, i) => {
        const x = 26 + i * 40
        return (
          <g key={cat}>
            <rect x={x} y={baseY - before[i] * scale} width="9" height={before[i] * scale} rx="2" fill={c.secondary} />
            <motion.rect
              x={x + 11} width="9" rx="2" fill={c.ink}
              initial={{ height: 0, y: baseY }}
              animate={{ height: after[i] * scale, y: baseY - after[i] * scale }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: 'easeOut' }}
            />
            <text x={x + 10} y="128" fontSize="8" fill={c.muted} textAnchor="middle">{cat}</text>
          </g>
        )
      })}
      <line x1="20" y1={baseY} x2="182" y2={baseY} stroke={c.ink} strokeOpacity="0.3" strokeWidth="1" />
    </svg>
  )
}

function WorkflowDonutChart({ c }) {
  const r = 38
  const circ = 2 * Math.PI * r
  const segments = [
    { label: 'Research', frac: 0.35, color: c.ink },
    { label: 'Optimize', frac: 0.4, color: c.secondary },
    { label: 'Track', frac: 0.25, color: c.tertiary },
  ]
  let offset = 0
  return (
    <svg viewBox="0 0 200 150" className="h-full w-full">
      <ChartTitle title="Workflow Mix" c={c} />
      <g transform="translate(58,88)">
        {segments.map((s, i) => {
          const dash = circ * s.frac
          const gap = circ - dash
          const rotation = -90 + offset * 360
          offset += s.frac
          return (
            <motion.circle
              key={s.label}
              r={r} fill="none" stroke={s.color} strokeWidth="13"
              strokeDasharray={`${dash} ${gap}`}
              strokeLinecap="round"
              initial={{ strokeDashoffset: dash }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.9, delay: i * 0.15, ease: 'easeOut' }}
              transform={`rotate(${rotation})`}
            />
          )
        })}
      </g>
      {segments.map((s, i) => (
        <g key={s.label} transform={`translate(124, ${58 + i * 22})`}>
          <rect width="9" height="9" rx="2" fill={s.color} />
          <text x="14" y="8.5" fontSize="9" fill={c.muted}>{s.label} · {Math.round(s.frac * 100)}%</text>
        </g>
      ))}
    </svg>
  )
}

// One saturated hue per card — indigo, violet, fuchsia, rose — so the
// prism cycles through real color rather than four shades of one purple.
const INDIGO = {
  ink: '#4338ca', muted: 'rgba(67,56,202,0.62)', soft: 'rgba(67,56,202,0.16)',
  secondary: '#818cf8', tertiary: '#c7d2fe',
  gradient: 'linear-gradient(150deg, #ffffff 0%, #eef0fe 40%, #c2c7fb 100%)',
  glow: 'radial-gradient(circle, rgba(99,102,241,0.6) 0%, rgba(67,56,202,0.35) 45%, transparent 75%)',
}
const VIOLET = {
  ink: '#7c3aed', muted: 'rgba(124,58,237,0.62)', soft: 'rgba(124,58,237,0.16)',
  secondary: '#c4b5fd', tertiary: '#e9d5ff',
  gradient: 'linear-gradient(150deg, #ffffff 0%, #f3ecff 40%, #d3b8fd 100%)',
  glow: 'radial-gradient(circle, rgba(167,139,250,0.6) 0%, rgba(124,58,237,0.35) 45%, transparent 75%)',
}
const FUCHSIA = {
  ink: '#a21caf', muted: 'rgba(162,28,175,0.62)', soft: 'rgba(162,28,175,0.16)',
  secondary: '#f0abfc', tertiary: '#fae8ff',
  gradient: 'linear-gradient(150deg, #ffffff 0%, #fbe9ff 40%, #f0aefc 100%)',
  glow: 'radial-gradient(circle, rgba(232,121,249,0.6) 0%, rgba(162,28,175,0.35) 45%, transparent 75%)',
}
const ROSE = {
  ink: '#be185d', muted: 'rgba(190,24,93,0.62)', soft: 'rgba(190,24,93,0.16)',
  secondary: '#fb7185', tertiary: '#fecdd3',
  gradient: 'linear-gradient(150deg, #ffffff 0%, #ffe9f1 40%, #fbb6ce 100%)',
  glow: 'radial-gradient(circle, rgba(244,114,182,0.6) 0%, rgba(190,24,93,0.35) 45%, transparent 75%)',
}

const POINTS = [
  {
    chart: DonutChart,
    colors: INDIGO,
    title: 'Every Tool You Need, Built In',
    description:
      'Keyword Research, AI Content Generation, Technical Audits, PageSpeed Insights, Meta Tag and Schema generators, On-Page Scoring, and a robots.txt Analyzer — nine dedicated tools in one dashboard, each one grounded in real crawl data and live API results, not guesswork.',
    stat: '9',
    statLabel: 'SEO tools, one suite',
  },
  {
    chart: LineChart,
    colors: VIOLET,
    title: 'AI Where It Actually Helps',
    description:
      'The Content Generator drafts full, SERP-optimized articles from a single keyword, the Meta Tag Generator writes high-CTR titles and descriptions, and AI-assisted clustering turns raw search volume into ready-to-execute topic groups — so you spend time publishing, not researching.',
    stat: '3.2x',
    statLabel: 'faster content drafts',
  },
  {
    chart: BarChart,
    colors: FUCHSIA,
    title: 'Secure & Enterprise Grade',
    description:
      'Every one of our tools runs behind a JWT-authenticated API, and your Google Search Console OAuth tokens stay encrypted end-to-end in storage — so your crawl history, keyword data, and live performance numbers stay private, whether you’re a solo SEO or a full agency team.',
    stat: '256-bit',
    statLabel: 'encrypted end-to-end',
  },
  {
    chart: WorkflowDonutChart,
    colors: ROSE,
    title: 'One Connected SEO Workflow',
    description:
      'Keyword Research feeds straight into the Content Generator, the Technical Audit and robots.txt Analyzer catch crawl issues before they hurt rankings, PageSpeed and On-Page scoring keep every page tuned, and live Google Search Console Insights close the loop — no manual exports, no spreadsheets, no switching tabs between nine different tools.',
    stat: '9',
    statLabel: 'tools, one workflow',
  },
]

// A regular-polygon prism with one face per POINT: face i sits at
// rotateY(i * FACE_ANGLE) pushed out to RADIUS, so the faces meet
// edge-to-edge and read as one solid box rather than flat cards.
const FACE_WIDTH = 340
const FACE_ANGLE = 360 / POINTS.length
const RADIUS = Math.round(FACE_WIDTH / 2 / Math.tan(Math.PI / POINTS.length))

const pad = (n) => String(n).padStart(2, '0')

/* A pinned scroll-through panel — the section sticks in place while the
   visitor scrolls past a taller wrapper, cycling through POINTS one at a
   time; each panel swaps in with a Y-axis coin-flip (matching the same
   rotation language used on the Services cards) rather than a plain cut. */
export default function About() {
  const wrapperRef = useRef(null)
  const [step, setStep] = useState(0)
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ['start start', 'end end'] })
  // The box's own rotateY is driven directly (and continuously) by scroll —
  // not stepped — so it reads as one solid prism physically turning. Only
  // turns (POINTS.length - 1) faces' worth (-240° for 3 faces), landing
  // exactly on the last face at v=1 — a full -360° would spin all the way
  // back around to face 0 right as the text claimed to be on the last step.
  const boxRotateY = useTransform(scrollYProgress, [0, 1], [0, -(POINTS.length - 1) * FACE_ANGLE])

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      // Face i is exactly front-facing at v = i / (POINTS.length - 1), so the
      // step text should track whichever face is CLOSEST right now (rounding),
      // not which third-of-the-scroll we're in (flooring) — flooring kept the
      // text a half-step behind the box's actual visible rotation.
      const idx = Math.min(POINTS.length - 1, Math.max(0, Math.round(v * (POINTS.length - 1))))
      setStep(idx)
    })
  }, [scrollYProgress])

  const active = POINTS[step]

  return (
    <Section
      id="about"
      title="One unified dashboard for your entire SEO strategy"
      subtitle="From preliminary keyword discovery to tracking live Search Console performance, experience seamless automation."
      className="relative"
    >
      <div ref={wrapperRef} className="relative" style={{ height: `${POINTS.length * 100}vh` }}>
        <div className="sticky top-20 flex min-h-[70vh] items-center">
          <div className="grid w-full items-center gap-10 lg:grid-cols-2">
            {/* Panel — a solid 3-sided prism (one face per POINT) that
                physically turns as the visitor scrolls, rather than flat
                cards fading in and out. */}
            <div
              className="relative mx-auto mt-10"
              style={{ width: FACE_WIDTH, height: 460, perspective: '1400px' }}
            >
              {/* Big soft glow blob behind the box — tracks the active
                  card's own hue, so the backdrop shifts color right along
                  with the card as the visitor scrolls between faces. */}
              <div
                className="pointer-events-none absolute -inset-16 -z-10 rounded-full blur-[90px] transition-[background] duration-500"
                style={{ background: active.colors.glow }}
              />
              <motion.div
                className="absolute inset-0"
                style={{ transformStyle: 'preserve-3d', rotateY: boxRotateY }}
              >
                {POINTS.map((point, i) => {
                  const c = point.colors
                  return (
                    <div
                      key={point.title}
                      className="absolute inset-0 flex flex-col gap-4 overflow-hidden border border-white/60 p-6"
                      style={{
                        background: c.gradient,
                        backfaceVisibility: 'hidden',
                        transform: `rotateY(${i * FACE_ANGLE}deg) translateZ(${RADIUS}px)`,
                        boxShadow: `0 30px 80px -14px ${c.muted}, 0 1px 0 0 rgba(255,255,255,0.6) inset`,
                      }}
                    >
                      {/* Top accent ribbon — a two-stop gradient of the
                          card's own ink/secondary, the one bold color
                          touch that reads instantly per card */}
                      <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-1.5"
                        style={{ background: `linear-gradient(90deg, ${c.ink}, ${c.secondary})` }}
                      />
                      {/* Soft glass highlight sheen, top-left */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/50 via-white/0 to-transparent opacity-70" />

                      <span
                        className="relative w-fit rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
                        style={{ background: c.soft, color: c.ink }}
                      >
                        Live data
                      </span>

                      <div className="relative flex-1 rounded-2xl bg-white/80 p-2 shadow-[0_1px_0_0_rgba(255,255,255,0.8)_inset] backdrop-blur-sm">
                        <point.chart c={c} />
                      </div>

                      <div className="relative flex items-baseline gap-2 border-t pt-3" style={{ borderColor: c.soft }}>
                        <p className="font-heading text-3xl font-normal" style={{ color: c.ink }}>{point.stat}</p>
                        <p className="text-sm" style={{ color: c.muted }}>{point.statLabel}</p>
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            </div>

            {/* Step counter + copy */}
            <div className="text-left">
              <div className="mb-5 flex items-baseline gap-3">
                <span
                  className="font-heading text-6xl font-normal transition-colors duration-500"
                  style={{ color: active.colors.ink }}
                >
                  {pad(step + 1)}
                </span>
                <span className="text-xl text-text-muted">/{pad(POINTS.length)}</span>
              </div>
              <motion.div
                key={active.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="font-heading text-3xl font-normal text-text sm:text-4xl">{active.title}</h3>
                <p className="mt-4 max-w-lg text-lg text-text-muted leading-relaxed">{active.description}</p>
              </motion.div>

              {/* Step dots */}
              <div className="mt-8 flex gap-2">
                {POINTS.map((point, i) => (
                  <span
                    key={point.title}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: i === step ? '2rem' : '1rem',
                      background: i === step ? point.colors.ink : 'var(--color-border)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
