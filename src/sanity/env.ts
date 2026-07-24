/**
 * Sanity — variáveis de ambiente e flags derivadas.
 *
 * Quando projectId estiver vazio, o site continua funcionando normalmente:
 * as queries retornam null e as seções caem no fallback de src/content/*.ts.
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2025-01-01'

/** Liga a CDN do Sanity em produção (mais rápido, cache ~1min). */
export const useCdn = process.env.NODE_ENV === 'production'

/** True quando as env vars obrigatórias estão preenchidas. */
export const hasSanityConfig = projectId.length > 0

/**
 * Publicação do conteúdo remoto é opt-in.
 *
 * O Studio pode permanecer conectado enquanto a Home usa os fallbacks locais
 * aprovados. Só ativar depois de migrar e revisar os documentos do dataset.
 */
export const hasSanityContent =
  hasSanityConfig && process.env.NEXT_PUBLIC_SANITY_CONTENT_ENABLED === 'true'
