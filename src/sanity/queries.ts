import { groq } from 'next-sanity'
import type {
  AboutContent,
  ContentBridgeContent,
  ContentHighlight,
  HeroContent,
  NowContent,
} from '@/types/content'
import { sanityClient } from './client'
import { urlForImage } from './image'

/** Revalidação a cada 60s — equilíbrio entre frescor e performance. */
const fetchOptions = { next: { revalidate: 60 } } as const

/* ---------------- Hero ---------------- */

const HERO_QUERY = groq`*[_type == "hero"][0]{
  meta,
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  coverImage{..., "alt": alt, "objectPosition": objectPosition}
}`

type RawHero = {
  meta?: HeroContent['meta']
  headline?: string
  subheadline?: string
  primaryCta?: HeroContent['ctas']['primary']
  secondaryCta?: HeroContent['ctas']['secondary']
  coverImage?: { asset?: unknown; alt?: string; objectPosition?: string } | null
}

export async function getHeroFromSanity(): Promise<HeroContent | null> {
  if (!sanityClient) return null
  try {
    const data = await sanityClient.fetch<RawHero | null>(HERO_QUERY, {}, fetchOptions)
    if (!data?.headline || !data.subheadline || !data.primaryCta || !data.secondaryCta) {
      return null
    }

    const coverUrl = data.coverImage?.asset ? urlForImage(data.coverImage, 2400) : null

    return {
      meta: data.meta ?? { kicker: '' },
      headline: data.headline,
      subheadline: data.subheadline,
      ctas: { primary: data.primaryCta, secondary: data.secondaryCta },
      media: { alt: data.coverImage?.alt ?? '' },
      coverImage: coverUrl
        ? {
            src: coverUrl,
            alt: data.coverImage?.alt ?? '',
            objectPosition: data.coverImage?.objectPosition,
          }
        : undefined,
    }
  } catch {
    return null
  }
}

/* ---------------- About ---------------- */

const ABOUT_QUERY = groq`*[_type == "about"][0]{
  meta,
  chapters,
  closingCta,
  photo{..., "alt": alt, "caption": caption, "objectPosition": objectPosition}
}`

type RawAbout = {
  meta?: AboutContent['meta']
  chapters?: AboutContent['chapters']
  closingCta?: AboutContent['closingCta']
  photo?: {
    asset?: unknown
    alt?: string
    caption?: string
    objectPosition?: string
  } | null
}

export async function getAboutFromSanity(): Promise<AboutContent | null> {
  if (!sanityClient) return null
  try {
    const data = await sanityClient.fetch<RawAbout | null>(ABOUT_QUERY, {}, fetchOptions)
    if (!data?.meta || !data.chapters?.length) return null

    const photoUrl = data.photo?.asset ? urlForImage(data.photo, 1600) : null

    return {
      meta: data.meta,
      chapters: data.chapters,
      closingCta: data.closingCta,
      photo: {
        src: photoUrl ?? '',
        alt: data.photo?.alt ?? '',
        caption: data.photo?.caption ?? '',
        objectPosition: data.photo?.objectPosition,
      },
    }
  } catch {
    return null
  }
}

/* ---------------- Now ---------------- */

const NOW_QUERY = groq`*[_type == "now"][0]{
  meta,
  city, state, country,
  date, period, dayCount, coordinates,
  caption,
  cta,
  photo{..., "alt": alt, "caption": caption, "objectPosition": objectPosition}
}`

type RawNow = Omit<NowContent, 'photo'> & {
  photo?: {
    asset?: unknown
    alt?: string
    caption?: string
    objectPosition?: string
  } | null
}

export async function getNowFromSanity(): Promise<NowContent | null> {
  if (!sanityClient) return null
  try {
    const data = await sanityClient.fetch<RawNow | null>(NOW_QUERY, {}, fetchOptions)
    if (!data?.meta || !data.city) return null

    const photoUrl = data.photo?.asset ? urlForImage(data.photo, 1600) : null

    return {
      ...data,
      photo: {
        src: photoUrl ?? '',
        alt: data.photo?.alt ?? '',
        caption: data.photo?.caption ?? `${data.city} · ${data.period}`,
        objectPosition: data.photo?.objectPosition,
      },
    }
  } catch {
    return null
  }
}

/* ---------------- Content highlights ---------------- */

const CONTENT_QUERY = groq`*[_type == "contentHighlights"][0]{
  meta,
  pullQuote,
  highlights[]{
    _key, platform, url, title,
    thumbnail{..., "alt": alt, "objectPosition": objectPosition}
  },
  channels
}`

type RawHighlight = {
  _key: string
  platform: ContentHighlight['platform']
  url: string
  title: string
  thumbnail?: { asset?: unknown; alt?: string; objectPosition?: string } | null
}

type RawContent = {
  meta?: ContentBridgeContent['meta']
  pullQuote?: string
  highlights?: RawHighlight[]
  channels?: ContentBridgeContent['channels']
}

export async function getContentHighlightsFromSanity(): Promise<ContentBridgeContent | null> {
  if (!sanityClient) return null
  try {
    const data = await sanityClient.fetch<RawContent | null>(CONTENT_QUERY, {}, fetchOptions)
    if (!data?.meta || !data.highlights?.length || !data.channels) return null

    return {
      meta: data.meta,
      pullQuote: data.pullQuote,
      highlights: data.highlights.map((h) => ({
        id: h._key,
        platform: h.platform,
        url: h.url,
        title: h.title,
        thumbnail: h.thumbnail?.asset ? (urlForImage(h.thumbnail, 800) ?? undefined) : undefined,
        thumbnailAlt: h.thumbnail?.alt,
        thumbnailObjectPosition: h.thumbnail?.objectPosition,
      })),
      channels: data.channels,
    }
  } catch {
    return null
  }
}
