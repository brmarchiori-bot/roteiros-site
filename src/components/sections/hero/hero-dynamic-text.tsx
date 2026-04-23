'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  words: string[]
  /** Intervalo entre trocas, em ms. Default: 3200 (calmo, editorial). */
  intervalMs?: number
  className?: string
}

/**
 * Rotator de palavras com fade suave (zero layout shift).
 *
 * Técnica: todas as palavras ocupam a MESMA célula de um inline-grid,
 * então o container auto-dimensiona pra palavra mais larga. Apenas a
 * palavra atual fica com opacity 1 — as outras ficam invisíveis mas
 * presentes. Sem JS animation, sem IntersectionObserver — só CSS.
 *
 * Acessibilidade: a rotação é marcada aria-hidden. O h1 em volta deve
 * ter um aria-label estável com a primeira palavra pra leitores de tela.
 */
export function HeroDynamicText({ words, intervalMs = 3200, className }: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (words.length <= 1) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [words.length, intervalMs])

  if (words.length === 0) return null
  if (words.length === 1) {
    return <span className={className}>{words[0]}</span>
  }

  return (
    <span
      aria-hidden="true"
      className={cn('relative inline-grid align-baseline', className)}
    >
      {words.map((word, i) => (
        <span
          key={`${i}-${word}`}
          className={cn(
            'col-start-1 row-start-1 transition-opacity duration-1000 ease-in-out',
            i === index ? 'opacity-100' : 'opacity-0',
          )}
        >
          {word}
        </span>
      ))}
    </span>
  )
}
