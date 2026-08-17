import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export default function Logo({ className = '', iconOnly = false, to = '/' }) {
  return (
    <Link to={to} className={`group flex shrink-0 items-center gap-2.5 font-heading text-lg font-normal text-text ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-emerald to-primary text-[#061006] shadow-md shadow-[var(--glow)] transition-transform group-hover:scale-105">
        <Sparkles size={18} className="animate-pulse" />
      </span>
      {!iconOnly && (
        <span className="tracking-tight">
          Rank<span className="text-primary font-normal">Helper</span>
        </span>
      )}
    </Link>
  )
}
