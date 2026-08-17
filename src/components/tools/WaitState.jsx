import { Loader2 } from 'lucide-react'

export default function WaitState({ label = 'Working…', note }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface-card/70 px-6 py-14 text-center backdrop-blur-md glow-md">
      <Loader2 size={28} className="animate-spin text-primary" />
      <p className="font-heading text-lg font-normal text-text">{label}</p>
      {note && <p className="max-w-sm text-sm text-text-muted">{note}</p>}
    </div>
  )
}
