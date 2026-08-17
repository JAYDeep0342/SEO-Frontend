import { motion } from 'framer-motion'

// Same drawn-in-line visual language as About.jsx's LineChart, scaled up
// to a full-width standalone chart for the GSC Overview tab's clicks trend.
export default function GscTrendChart({ data }) {
  if (!data || data.length === 0) return null

  const width = 640
  const height = 220
  const padL = 8
  const padR = 8
  const padT = 16
  const padB = 26
  const innerW = width - padL - padR
  const innerH = height - padT - padB

  const maxClicks = Math.max(...data.map((d) => d.clicks), 1)
  const stepX = innerW / Math.max(data.length - 1, 1)
  const points = data.map((d, i) => [
    padL + i * stepX,
    padT + innerH - (d.clicks / maxClicks) * innerH,
  ])

  const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ')
  const lastPoint = points[points.length - 1]
  const area = `${path} L${lastPoint[0]},${padT + innerH} L${points[0][0]},${padT + innerH} Z`

  const gridYs = [0, 0.25, 0.5, 0.75, 1].map((f) => padT + innerH * f)
  const labelCount = Math.min(6, data.length)
  const labelIdxs = Array.from({ length: labelCount }, (_, i) =>
    Math.round((i * (data.length - 1)) / Math.max(labelCount - 1, 1)),
  )

  return (
    <div>
      <h3 className="font-heading text-base font-normal text-text">Clicks trend</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-2 h-56 w-full">
        <defs>
          <linearGradient id="gscTrendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {gridYs.map((y, i) => (
          <line key={i} x1={padL} x2={width - padR} y1={y} y2={y} stroke="var(--color-border)" strokeWidth="1" />
        ))}
        <motion.path
          d={area} fill="url(#gscTrendFill)" stroke="none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}
        />
        <motion.path
          d={path} fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0.4 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
        {labelIdxs.map((idx) => (
          <text
            key={idx} x={points[idx][0]} y={height - 6} fontSize="10" textAnchor="middle" fill="var(--color-text-muted)"
          >
            {data[idx].date.slice(5)}
          </text>
        ))}
      </svg>
    </div>
  )
}
