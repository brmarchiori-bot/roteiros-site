import 'server-only'

/**
 * Configuração privada da fundação editorial.
 *
 * Todas as credenciais permanecem no servidor. O fluxo oficial do Presentation
 * Tool valida segredos efêmeros usando o cliente Viewer.
 */
export const editorialPreviewServerEnv = {
  readToken: process.env.SANITY_API_READ_TOKEN,
  studioUrl: process.env.SANITY_STUDIO_URL,
  apiVersion: process.env.SANITY_API_VERSION,
}
