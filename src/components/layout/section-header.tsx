import { Reveal } from '@/components/shared/reveal'
import { cn } from '@/lib/utils'
import type { SectionMeta } from '@/types/content'

type SectionHeaderProps = {
  meta: SectionMeta
  description?: string
  align?: 'left' | 'center'
  className?: string
}

/**
 * Header editorial padrão: kicker (terracota mono) + title (Fraunces) + descrição.
 * Animado com Reveal em cascata.
 */
export function SectionHeader({
  meta,
  description,
  align = 'left',
  className,
}: SectionHeaderProps) {
  const isCenter = align === 'center'

  return (
    <header className={cn(isCenter && 'text-center', className)}>
      <Reveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
          {meta.kicker}
        </p>
      </Reveal>

      {meta.title && (
        <Reveal delay={0.1}>
          <h2
            className={cn(
              'mt-6 font-display text-3xl font-medium leading-tight tracking-tight md:text-5xl',
              isCenter ? 'mx-auto max-w-3xl' : 'max-w-3xl',
            )}
          >
            {meta.title}
          </h2>
        </Reveal>
      )}

      {description && (
        <Reveal delay={0.2}>
          <p
            className={cn(
              'mt-6 text-base leading-relaxed text-muted md:text-lg',
              isCenter ? 'mx-auto max-w-2xl' : 'max-w-2xl',
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </header>
  )
}
