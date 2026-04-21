import { createClient } from 'next-sanity'
import { apiVersion, dataset, hasSanityConfig, projectId, useCdn } from './env'

/**
 * Client de leitura do Sanity.
 *
 * É null enquanto NEXT_PUBLIC_SANITY_PROJECT_ID não estiver definida —
 * nesse caso, queries retornam null e o site usa fallback de src/content.
 */
export const sanityClient = hasSanityConfig
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      perspective: 'published',
    })
  : null
