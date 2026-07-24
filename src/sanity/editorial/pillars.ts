import 'server-only'

import { createClient } from 'next-sanity'
import { pillars as pillarsFallback } from '@/content'
import { editorialPreviewServerEnv } from '@/lib/editorial-preview.server'
import type { PillarsContent } from '@/types/content'

export const EDITORIAL_PILLARS_SINGLETON_ID = 'pillars-singleton'

export const EDITORIAL_PILLARS_QUERY = `*[_id == "pillars-singleton"][0]{
  _id,
  _type,
  meta,
  items[]{
    _key,
    title,
    description,
    href
  }
}`

export type EditorialContentSource = 'sanity' | 'fallback' | 'unavailable'

export type EditorialPillarsResult = {
  content: PillarsContent
  source: EditorialContentSource
  reason:
    | 'remote-valid'
    | 'document-missing'
    | 'document-invalid'
    | 'configuration-unavailable'
    | 'request-failed'
}

type RawPillars = {
  _id?: unknown
  _type?: unknown
  meta?: {
    kicker?: unknown
    title?: unknown
  } | null
  items?: Array<{
    _key?: unknown
    title?: unknown
    description?: unknown
    href?: unknown
  }> | null
}

type EditorialFetch = (query: string) => Promise<RawPillars | null>

export async function resolveEditorialPillars(
  isDraftMode: boolean,
  fetchOverride?: EditorialFetch,
): Promise<EditorialPillarsResult> {
  if (!isDraftMode) return fallbackResult('document-missing')

  let fetchPillars: EditorialFetch | null
  try {
    fetchPillars = fetchOverride ?? createEditorialPillarsFetch()
  } catch {
    reportEditorialReadFailure()
    return fallbackResult('request-failed')
  }

  if (!fetchPillars) return unavailableResult()

  try {
    const raw = await fetchPillars(EDITORIAL_PILLARS_QUERY)
    if (!raw) return fallbackResult('document-missing')

    const content = validatePillars(raw)
    return content
      ? { content, source: 'sanity', reason: 'remote-valid' }
      : fallbackResult('document-invalid')
  } catch {
    reportEditorialReadFailure()
    return fallbackResult('request-failed')
  }
}

function createEditorialPillarsFetch(): EditorialFetch | null {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim()
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim()
  const apiVersion = editorialPreviewServerEnv.apiVersion?.trim() || '2025-01-01'
  const token = editorialPreviewServerEnv.readToken?.trim()

  if (!isValidProjectId(projectId) || !isValidDataset(dataset) || !isValidApiVersion(apiVersion) || !token) {
    return null
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    perspective: 'drafts',
    useCdn: false,
    stega: false,
  })

  return (query) =>
    client.fetch<RawPillars | null>(query, {}, {
      cache: 'no-store',
    })
}

function validatePillars(raw: RawPillars): PillarsContent | null {
  if (
    raw._id !== EDITORIAL_PILLARS_SINGLETON_ID ||
    raw._type !== 'pillars' ||
    !isNonEmptyString(raw.meta?.kicker) ||
    !isNonEmptyString(raw.meta?.title) ||
    !Array.isArray(raw.items) ||
    raw.items.length !== 4
  ) {
    return null
  }

  const items = raw.items.map((item) => {
    if (
      !isNonEmptyString(item._key) ||
      !isNonEmptyString(item.title) ||
      !isNonEmptyString(item.description) ||
      (item.href !== undefined && item.href !== null && typeof item.href !== 'string')
    ) {
      return null
    }

    return {
      _key: item._key,
      id: item._key,
      title: item.title,
      description: item.description,
      ...(isNonEmptyString(item.href) ? { href: item.href } : {}),
    }
  })

  if (items.some((item) => item === null)) return null

  return {
    _id: raw._id,
    _type: raw._type,
    meta: {
      kicker: raw.meta.kicker,
      title: raw.meta.title,
    },
    items: items as NonNullable<(typeof items)[number]>[],
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isValidProjectId(value: string | undefined): value is string {
  return !!value && /^[a-z0-9-]+$/.test(value)
}

function isValidDataset(value: string | undefined): value is string {
  return !!value && /^[a-zA-Z0-9_-]+$/.test(value)
}

function isValidApiVersion(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function fallbackResult(reason: EditorialPillarsResult['reason']): EditorialPillarsResult {
  return { content: pillarsFallback, source: 'fallback', reason }
}

function unavailableResult(): EditorialPillarsResult {
  return {
    content: pillarsFallback,
    source: 'unavailable',
    reason: 'configuration-unavailable',
  }
}

function reportEditorialReadFailure() {
  console.error('[Preview editorial] Leitura de Pilares indisponível; usando fallback seguro.')
}
