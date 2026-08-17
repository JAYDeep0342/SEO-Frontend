export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface-card/70 px-6 py-14 text-center backdrop-blur-md">
      {Icon && (
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon size={22} />
        </span>
      )}
      <p className="font-heading text-lg font-normal text-text">{title}</p>
      {description && <p className="max-w-sm text-sm text-text-muted">{description}</p>}
      {action}
    </div>
  )
}
