import { now } from '@/content/now'
import { cn } from '@/lib/utils'

type JourneyMarkerProps = {
  className?: string
  prefix?: string
  separator?: string
}

/**
 * Marcador da jornada — "Dia 47 · Piauí · Abril/2026".
 * Lê de src/content/now.ts. Atualiza-se em um lugar só.
 */
export function JourneyMarker({
  className,
  prefix = 'Dia',
  separator = ' · ',
}: JourneyMarkerProps) {
  const { dayCount, city, period } = now
  const parts = [`${prefix} ${dayCount}`, city, period]

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted',
        className,
      )}
      aria-label={`Dia ${dayCount} da jornada, em ${city}, ${period}`}
    >
      {parts.join(separator)}
    </span>
  )
}
