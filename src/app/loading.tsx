export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Carregando"
      className="flex min-h-[60vh] items-center justify-center"
    >
      <div className="font-mono text-xs uppercase tracking-widest text-foreground/40">
        carregando…
      </div>
    </div>
  )
}
