import React from 'react'

const VARIANTS = {
  emerald: 'bg-primary/10 text-primary dark:text-[#F0ABFC] border-primary/20',
  lime: 'bg-accent-lime/10 text-accent-lime border-accent-lime/25',
  slate: 'bg-surface-2/70 text-text-secondary border-border',
  // Severity colors for HIGH/MEDIUM/LOW-style issue lists (Audit, robots.txt
  // Analyzer) — the rest of the palette is purple/lime-family and can't
  // read as "warning"/"danger" on its own.
  amber: 'bg-[color-mix(in_srgb,var(--color-accent-orange)_12%,transparent)] text-[var(--color-accent-orange)] border-[color-mix(in_srgb,var(--color-accent-orange)_30%,transparent)]',
  rose: 'bg-red-500/10 text-red-500 border-red-500/25',
}

export default function Badge({ variant = 'emerald', className = '', children, ...props }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-normal tracking-wide backdrop-blur-sm transition-colors ${VARIANTS[variant] || VARIANTS.emerald} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
