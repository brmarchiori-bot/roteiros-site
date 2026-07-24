import 'server-only'

/**
 * Configuração privada da fundação editorial.
 *
 * Nesta fase, somente SANITY_PREVIEW_SECRET é usado. As demais variáveis ficam
 * reservadas para a futura leitura server-only no Presentation Tool.
 */
export const editorialPreviewServerEnv = {
  previewSecret: process.env.SANITY_PREVIEW_SECRET,
  readToken: process.env.SANITY_API_READ_TOKEN,
  studioUrl: process.env.SANITY_STUDIO_URL,
  apiVersion: process.env.SANITY_API_VERSION,
}
