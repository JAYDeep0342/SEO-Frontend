import { motion } from 'framer-motion'

function scoreColor(score) {
  if (score >= 80) return 'var(--color-primary)'
  if (score >= 50) return 'var(--color-accent-orange)'
  return '#ef4444'
}

// Same donut-ring-with-center-number visual language as About.jsx's
// DonutChart, extracted and parameterized for a single tool-result score.
export default function ScoreGauge({ score, label, size = 148 }) {
  const r = 46
  const circ = 2 * Math.PI * r
  const ink = scoreColor(score)

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 120 120" style={{ width: size, height: size }}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-border)" strokeWidth="12" />
        <motion.circle
          cx="60" cy="60" r={r} fill="none" stroke={ink} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - (score / 100) * circ }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="67" textAnchor="middle" fontSize="26" fontWeight="700" fill={ink}>
          {score}
        </text>
      </svg>
      {label && <span className="text-sm text-text-muted">{label}</span>}
    </div>
  )
}
