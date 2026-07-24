import { createClient } from 'next-sanity'
import { apiVersion, dataset, hasSanityContent, projectId, useCdn } from './env'

/**
 * Client de leitura do Sanity.
 *
 * É null enquanto o conteúdo remoto não estiver explicitamente habilitado.
 * O Studio continua conectado só com projectId/dataset, mas a Home usa os
 * fallbacks até NEXT_PUBLIC_SANITY_CONTENT_ENABLED=true.
 */
export const sanityClient = hasSanityContent
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      perspective: 'published',
    })
  : null
