import { groq } from 'next-sanity'
import type {
  AboutContent,
  ContentBridgeContent,
  ContentHighlight,
  HeroContent,
  NowContent,
  PhotoControls,
  SectionLayout,
} from '@/types/content'
import { sanityClient } from './client'
import { urlForImage } from './image'

/** Revalidação a cada 60s. */
const fetchOptions = { next: { revalidate: 60 } } as const

/* ---------------- Helpers ---------------- */

type RawPhotoControls = {
  horizontalFocus?: string
  verticalFocus?: string
  fitMode?: 'cover' | 'contain'
  zoom?: number
}

function toPhotoControls(raw?: RawPhotoControls | null): PhotoControls {
  const h = raw?.horizontalFocus ?? 'center'
  const v = raw?.verticalFocus ?? 'center'
  const objectPosition = h === 'center' && v === 'center' ? 'center' : `${h} ${v}`
  return {
    objectPosition,
    fitMode: raw?.fitMode ?? 'cover',
    zoom: typeof raw?.zoom === 'number' ? raw.zoom : 0,
  }
}

type RawLayout = {
  contentWidth?: SectionLayout['contentWidth']
  imagePosition?: SectionLayout['imagePosition']
}

function toLayout(raw?: RawLayout | null): SectionLayout {
  return {
    contentWidth: raw?.contentWidth ?? 'medium',
    imagePosition: raw?.imagePosition ?? 'left',
  }
}

const PHOTO_PROJ = `{..., "alt": alt, "caption": caption, "horizontalFocus": horizontalFocus, "verticalFocus": verticalFocus, "fitMode": fitMode, "zoom": zoom}`

/* ---------------- Hero ---------------- */

const HERO_QUERY = groq`*[_type == "hero"][0]{
  meta,
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  coverImage${PHOTO_PROJ},
  contentWidth
}`

type RawHero = {
  meta?: HeroContent['meta']
  headline?: string
  subheadline?: string
  primaryCta?: HeroContent['ctas']['primary']
  secondaryCta?: HeroContent['ctas']['secondary']
  coverImage?: ({ asset?: unknown; alt?: string } & RawPhotoControls) | null
  contentWidth?: SectionLayout['contentWidth']
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
            ...toPhotoControls(data.coverImage),
          }
        : undefined,
      layout: toLayout({ contentWidth: data.contentWidth }),
    }
  } catch {
    return null
  }
}

/* ---------------- About ---------------- */

const ABOUT_QUERY = groq`*[_type == "about"][0]{
  meta,
  chapters[]{
    _key, number, title, body,
    image${PHOTO_PROJ}
  },
  closingCta,
  photo${PHOTO_PROJ},
  contentWidth,
  imagePosition
}`

type RawChapter = {
  _key?: string
  number?: string
  title?: string
  body?: string
  image?: ({ asset?: unknown; alt?: string } & RawPhotoControls) | null
}

type RawAbout = {
  meta?: AboutContent['meta']
  chapters?: RawChapter[]
  closingCta?: AboutContent['closingCta']
  photo?:
    | ({
        asset?: unknown
        alt?: string
        caption?: string
      } & RawPhotoControls)
    | null
  contentWidth?: SectionLayout['contentWidth']
  imagePosition?: SectionLayout['imagePosition']
}

export async function getAboutFromSanity(): Promise<AboutContent | null> {
  if (!sanityClient) return null
  try {
    const data = await sanityClient.fetch<RawAbout | null>(ABOUT_QUERY, {}, fetchOptions)
    if (!data?.meta || !data.chapters?.length) return null

    const photoUrl = data.photo?.asset ? urlForImage(data.photo, 1600) : null

    return {
      meta: data.meta,
      chapters: data.chapters
        .filter((c): c is RawChapter & { number: string; title: string; body: string } =>
          !!c.number && !!c.title && !!c.body)
        .map((c) => {
          const chapterImageUrl = c.image?.asset ? urlForImage(c.image, 1200) : null
          return {
            number: c.number,
            title: c.title,
            body: c.body,
            image: chapterImageUrl
              ? {
                  src: chapterImageUrl,
                  alt: c.image?.alt ?? '',
                  ...toPhotoControls(c.image),
                }
              : undefined,
          }
        }),
      closingCta: data.closingCta,
      photo: {
        src: photoUrl ?? '',
        alt: data.photo?.alt ?? '',
        caption: data.photo?.caption ?? '',
        ...toPhotoControls(data.photo),
      },
      layout: toLayout(data),
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
  photo${PHOTO_PROJ},
  contentWidth,
  imagePosition
}`

type RawNow = Omit<NowContent, 'photo' | 'layout'> & {
  photo?:
    | ({
        asset?: unknown
        alt?: string
        caption?: string
      } & RawPhotoControls)
    | null
  contentWidth?: SectionLayout['contentWidth']
  imagePosition?: SectionLayout['imagePosition']
}

export async function getNowFromSanity(): Promise<NowContent | null> {
  if (!sanityClient) return null
  try {
    const data = await sanityClient.fetch<RawNow | null>(NOW_QUERY, {}, fetchOptions)
    if (!data?.meta || !data.city) return null

    const photoUrl = data.photo?.asset ? urlForImage(data.photo, 1600) : null
    const { photo: _omit, contentWidth, imagePosition, ...rest } = data
    void _omit

    return {
      ...rest,
      photo: {
        src: photoUrl ?? '',
        alt: data.photo?.alt ?? '',
        caption: data.photo?.caption ?? `${data.city} · ${data.period}`,
        ...toPhotoControls(data.photo),
      },
      layout: toLayout({ contentWidth, imagePosition }),
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
    thumbnail${PHOTO_PROJ}
  },
  channels,
  contentWidth
}`

type RawHighlight = {
  _key: string
  platform: ContentHighlight['platform']
  url: string
  title: string
  thumbnail?: ({ asset?: unknown; alt?: string } & RawPhotoControls) | null
}

type RawContent = {
  meta?: ContentBridgeContent['meta']
  pullQuote?: string
  highlights?: RawHighlight[]
  channels?: ContentBridgeContent['channels']
  contentWidth?: SectionLayout['contentWidth']
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
        thumbnailControls: h.thumbnail ? toPhotoControls(h.thumbnail) : undefined,
      })),
      channels: data.channels,
      layout: toLayout({ contentWidth: data.contentWidth }),
    }
  } catch {
    return null
  }
}
