import type { CSSProperties } from 'react'
import type { PhotoControls, SectionLayout } from '@/types/content'

/** Traduz contentWidth do Sanity pro prop `size` do Container. */
export function toContainerSize(
  width: SectionLayout['contentWidth'],
): 'narrow' | 'default' | 'wide' {
  if (width === 'narrow') return 'narrow'
  if (width === 'wide') return 'wide'
  return 'default'
}

/**
 * Traduz PhotoControls (foco, fit, zoom) em CSS aplicável ao <Image>.
 * zoom 0 = escala 1. zoom 100 = escala 2.
 */
export function toImageStyle(controls?: PhotoControls | null): CSSProperties {
  const objectPosition = controls?.objectPosition ?? 'center'
  const objectFit = controls?.fitMode ?? 'cover'
  const zoom = controls?.zoom ?? 0
  const scale = 1 + Math.max(0, Math.min(100, zoom)) / 100
  return {
    objectPosition,
    objectFit,
    transform: scale === 1 ? undefined : `scale(${scale})`,
    transformOrigin: objectPosition,
  }
}
