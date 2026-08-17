export default function StatTile({ stat, label }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-card/70 px-5 py-4 text-center backdrop-blur-md">
      <p className="font-heading text-2xl font-normal text-primary">{stat}</p>
      <p className="mt-1 text-xs text-text-muted">{label}</p>
    </div>
  )
}
