import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'
import { dataset, hasSanityConfig, projectId } from './env'

const builder = hasSanityConfig ? createImageUrlBuilder({ projectId, dataset }) : null

/**
 * Gera URL otimizada de uma imagem do Sanity.
 * Retorna null quando a config está faltando ou a imagem é inválida.
 */
export function urlForImage(source: SanityImageSource | null | undefined, width = 1600) {
  if (!builder || !source) return null
  try {
    return builder.image(source).width(width).auto('format').fit('max').url()
  } catch {
    return null
  }
}
