import { cn } from '@/lib/utils'

type GrainOverlayProps = {
  className?: string
  /** Opacidade entre 0 e 1. Default 0.05. */
  opacity?: number
}

/**
 * Textura de grain editorial — SVG inline com feTurbulence.
 * Sem requisição externa. Opacity baixa pra dar tato de filme analógico.
 */
export function GrainOverlay({ className, opacity = 0.05 }: GrainOverlayProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 mix-blend-multiply', className)}
      style={{ opacity }}
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="mr-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#mr-grain)" />
      </svg>
    </div>
  )
}
