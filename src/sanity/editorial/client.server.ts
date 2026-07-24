import 'server-only'

import { createClient } from 'next-sanity'
import { editorialPreviewServerEnv } from '@/lib/editorial-preview.server'

export type EditorialClientStatus =
  | { ready: true }
  | { ready: false; reason: 'configuration-unavailable' }

export function getEditorialClientStatus(): EditorialClientStatus {
  return resolveEditorialConfig() ? { ready: true } : { ready: false, reason: 'configuration-unavailable' }
}

export function createEditorialClient(options: { stega: boolean }) {
  const config = resolveEditorialConfig()
  if (!config) return null

  return createClient({
    ...config,
    perspective: 'drafts',
    useCdn: false,
    stega: options.stega
      ? {
          enabled: true,
          studioUrl: config.studioUrl,
        }
      : false,
  })
}

function resolveEditorialConfig() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim()
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim()
  const apiVersion = editorialPreviewServerEnv.apiVersion?.trim() || '2025-01-01'
  const token = editorialPreviewServerEnv.readToken?.trim()
  const studioUrl = editorialPreviewServerEnv.studioUrl?.trim() || '/studio'

  if (
    !projectId ||
    !/^[a-z0-9-]+$/.test(projectId) ||
    !dataset ||
    !/^[a-zA-Z0-9_-]+$/.test(dataset) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(apiVersion) ||
    !token
  ) {
    return null
  }

  return { projectId, dataset, apiVersion, token, studioUrl }
}
