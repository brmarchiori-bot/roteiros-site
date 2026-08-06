import 'server-only'

import {
  about,
  contentHighlights,
  faq,
  hero,
  now,
  partnerships,
  pillars,
} from '@/content'
import {
  getAboutFromSanity,
  getContentHighlightsFromSanity,
  getFaqFromSanity,
  getHeroFromSanity,
  getNowFromSanity,
  getPartnershipsFromSanity,
  getPillarsFromSanity,
} from '@/sanity/queries'
import type { HomeContent } from '@/types/content'
import { createEditorialClient } from './client.server'

export type EditorialContentSource = 'sanity' | 'fallback' | 'unavailable'

export type EditorialHomeResult = {
  content: HomeContent
  source: EditorialContentSource
}

const fallbackContent: HomeContent = {
  hero,
  now,
  about,
  pillars,
  contentHighlights,
  partnerships,
  faq,
}

const HOME_SINGLETON_IDS = [
  'hero-singleton',
  'now-singleton',
  'about-singleton',
  'pillars-singleton',
  'content-highlights-singleton',
  'partnerships-singleton',
  'faq-singleton',
]

/**
 * Carrega toda a Home pela perspectiva de rascunhos e mantém o stega ligado.
 * Assim cada texto renderizado sabe qual campo deve abrir no Studio.
 */
export async function resolveEditorialHome(isDraftMode: boolean): Promise<EditorialHomeResult> {
  if (!isDraftMode) return { content: fallbackContent, source: 'fallback' }

  const client = createEditorialClient({ stega: true })
  if (!client) return { content: fallbackContent, source: 'unavailable' }

  const options = { client, fetchOptions: { cache: 'no-store' as const } }

  try {
    const documentCount = await client.fetch<number>(
      'count(*[_id in $ids])',
      { ids: HOME_SINGLETON_IDS },
      { cache: 'no-store' },
    )
    if (documentCount === 0) return { content: fallbackContent, source: 'fallback' }
  } catch {
    console.error('[Preview editorial] Conteúdo temporariamente indisponível; usando o site atual.')
    return { content: fallbackContent, source: 'fallback' }
  }

  const [heroContent, nowContent, aboutContent, pillarsContent, highlights, partnerContent, faqContent] =
    await Promise.all([
      getHeroFromSanity(options),
      getNowFromSanity(options),
      getAboutFromSanity(options),
      getPillarsFromSanity(options),
      getContentHighlightsFromSanity(options),
      getPartnershipsFromSanity(options),
      getFaqFromSanity(options),
    ])

  return {
    source: 'sanity',
    content: {
      hero: heroContent,
      now: nowContent,
      about: aboutContent,
      pillars: pillarsContent,
      contentHighlights: highlights,
      partnerships: partnerContent,
      faq: faqContent,
    },
  }
}
