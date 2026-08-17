import {
  Braces,
  ClipboardCheck,
  FileCode2,
  FileText,
  Gauge,
  Link2,
  LineChart,
  Percent,
  Search,
  Tags,
  TrendingUp,
  Users,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Section from '../../components/common/Section'
import RevealBox from '../../components/common/RevealBox'
import { useAuth } from '../../context/AuthContext'

const MotionLink = motion.create(Link)

const SERVICES = [
  {
    icon: Search,
    title: 'Keyword Research',
    description: 'Intent, search volume, difficulty scoring, and AI-grouped topic clusters.',
    stat: '12,400',
    statLabel: 'keywords clustered',
  },
  {
    icon: FileText,
    title: 'Content Generator',
    description: 'Competitor-aware SERP briefs and full AI-authored articles optimized for ranking.',
    stat: '3.2x',
    statLabel: 'faster content drafts',
  },
  {
    icon: ClipboardCheck,
    title: 'Technical Audit',
    description: 'Jsoup crawler detecting broken links, missing meta tags, and H1/H2 hierarchy issues.',
    stat: '82/100',
    statLabel: 'site health score',
  },
  {
    icon: Gauge,
    title: 'PageSpeed Insights',
    description: 'Mobile and desktop performance scoring with prioritized optimization roadmap.',
    stat: '91/100',
    statLabel: 'speed score',
  },
  {
    icon: Tags,
    title: 'Meta Tag Generator',
    description: 'Generate high-CTR title tags, descriptions, and keywords with live SERP preview.',
    stat: '+18%',
    statLabel: 'average CTR',
  },
  {
    icon: Braces,
    title: 'Schema Markup',
    description: 'Generate rich-snippet valid JSON-LD structured data for any entity or page.',
    stat: '24',
    statLabel: 'rich snippets live',
  },
  {
    icon: Percent,
    title: 'On-Page Score',
    description: 'Instant 7-point audit evaluating keyword density, tags, headings, and readability.',
    stat: '76/100',
    statLabel: 'on-page score',
  },
  {
    icon: FileCode2,
    title: 'robots.txt Analyzer',
    description: 'Verifies robots.txt syntax, detects whole-site disallow blocks, and validates sitemaps.',
    stat: '0',
    statLabel: 'crawl blockers found',
  },
  {
    icon: LineChart,
    title: 'Search Console Insights',
    description: 'Actionable CTR quick wins, low-hanging fruit, and content gap analytics from live GSC.',
    stat: '+34%',
    statLabel: 'clicks this month',
  },
  {
    icon: Link2,
    title: 'Backlink Analyzer',
    description: 'Tracks new and lost backlinks, domain authority shifts, and toxic-link warnings.',
    stat: '2,340',
    statLabel: 'backlinks tracked',
  },
  {
    icon: TrendingUp,
    title: 'Rank Tracker',
    description: 'Daily rank tracking across desktop and mobile SERPs, with position-change alerts.',
    stat: '+15',
    statLabel: 'positions gained',
  },
  {
    icon: Users,
    title: 'Competitor Analysis',
    description: 'Side-by-side competitor content and backlink gap analysis to find quick wins.',
    stat: '34',
    statLabel: 'content gaps found',
  },
]

// Flat, rounded, transparent glass rectangles — no rotation/3D — but with a
// tasteful hover lift + glow + icon pop, so they still feel alive without
// the heavier 3D-flip mechanics the grid previously used. Every card is a
// real link now: signed-in visitors land straight in the dashboard, signed-
// out visitors are prompted to log in first — same pattern as the navbar
// logo and the hero's "Start Free" button.
function ServiceCard({ service, index }) {
  const { icon: Icon, title, description, stat, statLabel } = service
  const { isAuthenticated } = useAuth()
  const target = isAuthenticated ? '/app' : '/login'

  return (
    <RevealBox direction="fade-up" delay={index * 0.04} threshold={0.08}>
      <MotionLink
        to={target}
        initial="rest"
        whileHover="hover"
        className="group flex h-full cursor-pointer flex-col justify-between rounded-2xl border border-border bg-surface-card/70 p-6 text-left shadow-sm backdrop-blur-md"
        variants={{
          rest: { y: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.04)', borderColor: 'var(--color-border)' },
          hover: { y: -6, boxShadow: '0 20px 44px -14px var(--glow)', borderColor: 'var(--color-primary)' },
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      >
        <div>
          <motion.span
            className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"
            variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.1, rotate: -6 } }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
          >
            <Icon size={20} />
          </motion.span>
          <h3 className="font-heading text-lg font-normal text-text">{title}</h3>
          <p className="mt-2 text-sm text-text-muted leading-relaxed">{description}</p>
        </div>
        <div className="mt-6 flex items-baseline gap-2 border-t border-border pt-4">
          <span className="font-heading text-xl font-normal text-primary">{stat}</span>
          <span className="text-xs text-text-muted">{statLabel}</span>
        </div>
      </MotionLink>
    </RevealBox>
  )
}

export default function Services() {
  return (
    <Section
      id="services"
      eyebrow="12 Powerful Tools"
      title="Complete AI Suite for Modern Search Engine Optimization"
      subtitle="Purpose-built modules designed to supercharge your research, technical health, content, and real rankings."
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {SERVICES.map((service, i) => (
          <ServiceCard key={service.title} service={service} index={i} />
        ))}
      </div>
    </Section>
  )
}
