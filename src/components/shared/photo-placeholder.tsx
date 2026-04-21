import { cn } from '@/lib/utils'
import { GrainOverlay } from './grain-overlay'

type PhotoPlaceholderProps = {
  caption: string
  /** Aspect ratio Tailwind. Default 4:5 (cinematográfico). */
  aspect?: string
  className?: string
}

/**
 * Placeholder de foto enquanto não há mídia real.
 * Gradient sutil com cores da marca + label "Foto em breve" + caption.
 */
export function PhotoPlaceholder({
  caption,
  aspect = 'aspect-[4/5]',
  className,
}: PhotoPlaceholderProps) {
  return (
    <figure
      className={cn(
        'relative w-full overflow-hidden rounded-md bg-surface',
        aspect,
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 35% 65%, rgba(196,81,42,0.18), transparent 70%), radial-gradient(circle at 70% 25%, rgba(61,74,43,0.14), transparent 60%)',
        }}
      />
      <GrainOverlay opacity={0.08} />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6 md:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
          Foto em breve
        </p>
        <figcaption className="font-display text-base text-foreground/70 md:text-lg">
          {caption}
        </figcaption>
      </div>
    </figure>
  )
}
