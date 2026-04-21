import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type RevealProps = {
  children: ReactNode
  delay?: number
  className?: string
}

/**
 * Reveal editorial — fade + leve subida via CSS pura.
 * Sem JavaScript, sem IntersectionObserver, sem motion library.
 * Garantia de funcionamento em qualquer browser (incluindo Safari iOS antigo).
 *
 * Comportamento:
 * - Anima na primeira renderização (não no scroll)
 * - delay em segundos cria cascade entre elementos
 * - Respeita prefers-reduced-motion via @media em globals.css
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const style: CSSProperties | undefined =
    delay > 0 ? { animationDelay: `${delay}s` } : undefined

  return (
    <div className={cn('mr-reveal', className)} style={style}>
      {children}
    </div>
  )
}
