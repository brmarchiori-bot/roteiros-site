import { groq } from 'next-sanity'
import type {
  PortfolioCategory,
  PortfolioLink,
  PortfolioMedia,
  PortfolioProject,
  PrivatePortfolio,
} from '@/types/portfolio'
import { sanityClient } from './client'
import { urlForImage } from './image'

const PRIVATE_PORTFOLIO_QUERY = groq`*[_id == "private-portfolio-singleton"][0]{
  title,
  introduction,
  contactLabel,
  contactUrl,
  categories[]{
    _key,
    title,
    description,
    projects[]{
      _key,
      title,
      client,
      objective,
      description,
      result,
      links[]{ _key, label, url },
      media[]{
        _key,
        kind,
        title,
        url,
        image{ image, alt, caption, focusHorizontal, focusVertical, fit }
      }
    }
  }
}`

type RawControlledImage = {
  image?: { asset?: unknown; hotspot?: unknown; crop?: unknown } | null
  alt?: string
  caption?: string
  focusHorizontal?: 'left' | 'center' | 'right'
  focusVertical?: 'top' | 'center' | 'bottom'
  fit?: 'cover' | 'contain'
}

type RawMedia = {
  _key?: string
  kind?: PortfolioMedia['kind']
  title?: string
  url?: string
  image?: RawControlledImage
}

type RawProject = {
  _key?: string
  title?: string
  client?: string
  objective?: string
  description?: string
  result?: string
  links?: Array<{ _key?: string; label?: string; url?: string }>
  media?: RawMedia[]
}

type RawCategory = {
  _key?: string
  title?: string
  description?: string
  projects?: RawProject[]
}

type RawPortfolio = {
  title?: string
  introduction?: string
  contactLabel?: string
  contactUrl?: string
  categories?: RawCategory[]
}

function text(value?: string) {
  const normalized = value?.trim()
  return normalized || undefined
}

function resolveMedia(raw: RawMedia): PortfolioMedia | null {
  if (!raw._key || !raw.kind) return null

  if (raw.kind === 'image') {
    const src = raw.image?.image?.asset
      ? urlForImage(raw.image.image, 1800)
      : null
    if (!src || !text(raw.image?.alt)) return null

    const horizontal = raw.image?.focusHorizontal ?? 'center'
    const vertical = raw.image?.focusVertical ?? 'center'

    return {
      id: raw._key,
      kind: raw.kind,
      title: text(raw.title),
      image: {
        src,
        alt: raw.image?.alt?.trim() ?? '',
        caption: text(raw.image?.caption),
        objectPosition:
          horizontal === 'center' && vertical === 'center'
            ? 'center'
            : `${horizontal} ${vertical}`,
        fitMode: raw.image?.fit ?? 'cover',
      },
    }
  }

  const url = text(raw.url)
  if (!url) return null

  return {
    id: raw._key,
    kind: raw.kind,
    title: text(raw.title),
    url,
  }
}

function resolveProject(raw: RawProject): PortfolioProject | null {
  const title = text(raw.title)
  if (!raw._key || !title) return null

  const links: PortfolioLink[] = (raw.links ?? []).flatMap((link) => {
    const label = text(link.label)
    const url = text(link.url)
    return label && url ? [{ label, url }] : []
  })

  return {
    id: raw._key,
    title,
    client: text(raw.client),
    objective: text(raw.objective),
    description: text(raw.description),
    result: text(raw.result),
    links,
    media: (raw.media ?? []).flatMap((media) => {
      const resolved = resolveMedia(media)
      return resolved ? [resolved] : []
    }),
  }
}

function resolveCategory(raw: RawCategory): PortfolioCategory | null {
  const title = text(raw.title)
  if (!raw._key || !title) return null

  return {
    id: raw._key,
    title,
    description: text(raw.description),
    projects: (raw.projects ?? []).flatMap((project) => {
      const resolved = resolveProject(project)
      return resolved ? [resolved] : []
    }),
  }
}

export async function getPrivatePortfolio(): Promise<PrivatePortfolio | null> {
  if (!sanityClient) return null

  try {
    const raw = await sanityClient.fetch<RawPortfolio | null>(
      PRIVATE_PORTFOLIO_QUERY,
      {},
      { cache: 'no-store' },
    )
    const title = text(raw?.title)
    if (!raw || !title) return null

    return {
      title,
      introduction: text(raw.introduction),
      contactLabel: text(raw.contactLabel),
      contactUrl: text(raw.contactUrl),
      categories: (raw.categories ?? []).flatMap((category) => {
        const resolved = resolveCategory(category)
        return resolved ? [resolved] : []
      }),
    }
  } catch (error) {
    console.error('[Sanity] Falha ao carregar o portfólio privado.', error)
    return null
  }
}
