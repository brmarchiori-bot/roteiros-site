import 'server-only'

import { createDataAttribute } from 'next-sanity'
import type { EditorialSectionResult } from './home'

export function editorialDataAttribute(
  result: EditorialSectionResult | undefined,
  path: string,
) {
  const metadata = result?.editMetadata
  if (!metadata || result?.reason !== 'not-authorized') return undefined

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  if (!projectId || !dataset) return undefined

  return createDataAttribute({
    baseUrl: '/studio',
    projectId,
    dataset,
    id: metadata.documentId,
    type: metadata.documentType,
    path,
  }).toString()
}
