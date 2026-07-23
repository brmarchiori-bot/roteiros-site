import { now } from '@/content/now'
import { cn } from '@/lib/utils'
import type { NowContent } from '@/types/content'

type JourneyMarkerProps = {
  className?: string
  prefix?: string
  separator?: string
  journey?: Pick<NowContent, 'dayCount' | 'city' | 'period'>
}

/**
 * Marcador da jornada — "Dia 47 · Piauí · Abril/2026".
 * Recebe a jornada resolvida pelo servidor; usa o conteúdo local como fallback.
 */
export function JourneyMarker({
  className,
  prefix = 'Dia',
  separator = ' · ',
  journey = now,
}: JourneyMarkerProps) {
  const { dayCount, city, period } = journey
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
