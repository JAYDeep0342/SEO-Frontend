import {
  Braces, ClipboardCheck, FileCode2, FileText, Gauge, LineChart, Percent, Search, Tags,
} from 'lucide-react'

// The product's own 9 real tools (matches Backend/Seo's actual API
// controllers — Keyword/Content/Audit/PageSpeed/MetaTag/Schema/OnPage/
// Robots/Gsc — not third-party competitor names).
const TOOLS = [
  { name: 'Keyword Research', icon: Search },
  { name: 'Content Generator', icon: FileText },
  { name: 'Technical Audit', icon: ClipboardCheck },
  { name: 'PageSpeed Insights', icon: Gauge },
  { name: 'Meta Tag Generator', icon: Tags },
  { name: 'Schema Markup', icon: Braces },
  { name: 'On-Page SEO Score', icon: Percent },
  { name: 'robots.txt Analyzer', icon: FileCode2 },
  { name: 'Search Console Insights', icon: LineChart },
]

// We duplicate the list so the CSS loop looks seamless
const TRACK = [...TOOLS, ...TOOLS]

export default function LogoMarquee({ className = '' }) {
  return (
    <div className={`relative overflow-hidden py-6 ${className}`}>
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-bg to-transparent" />

      {/* Label */}
      <p className="mb-4 text-center text-xs font-normal uppercase tracking-widest text-text-muted">
        One suite, nine powerful tools
      </p>

      {/* Scrolling track */}
      <div
        className="flex gap-4"
        style={{
          animation: 'marqueeScroll 28s linear infinite',
          width: 'max-content',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
        onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
      >
        {TRACK.map(({ name, icon: Icon }, i) => (
          <div
            key={`${name}-${i}`}
            className="flex shrink-0 items-center gap-2.5 rounded-full border border-border bg-surface-card/70 px-5 py-2.5 text-sm font-normal text-text-secondary shadow-sm backdrop-blur-sm transition-all hover:border-primary/40 hover:text-primary hover:shadow-[0_0_14px_var(--glow)]"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon size={13} />
            </span>
            <span>{name}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
