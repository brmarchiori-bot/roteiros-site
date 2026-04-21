import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Container } from './container'

type SectionProps = {
  id?: string
  children: ReactNode
  className?: string
  containerClassName?: string
  size?: 'narrow' | 'default' | 'wide'
  bordered?: boolean
  /** Padding vertical — default 'lg' (28/36). 'sm' = 16/20, 'xl' = 36/48 */
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  /** Permite renderizar sem Container interno (ex: hero full-bleed) */
  bare?: boolean
}

const spacingClasses: Record<NonNullable<SectionProps['spacing']>, string> = {
  sm: 'py-12 md:py-20',
  md: 'py-14 md:py-28',
  lg: 'py-20 md:py-32',
  xl: 'py-24 md:py-40',
}

/**
 * Wrapper semântico de seção.
 * Padding e border consistentes em todas as seções da home.
 */
export function Section({
  id,
  children,
  className,
  containerClassName,
  size = 'default',
  bordered = true,
  spacing = 'lg',
  bare = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        spacingClasses[spacing],
        bordered && 'border-b border-subtle',
        className,
      )}
    >
      {bare ? (
        children
      ) : (
        <Container size={size} className={containerClassName}>
          {children}
        </Container>
      )}
    </section>
  )
}
