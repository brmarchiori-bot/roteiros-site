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

/** Formato cru de `controlledImage` vindo do Sanity. */
type RawControlledImage = {
  image?: { asset?: unknown; hotspot?: unknown; crop?: unknown } | null
  alt?: string
  caption?: string
  focusHorizontal?: 'left' | 'center' | 'right'
  focusVertical?: 'top' | 'center' | 'bottom'
  fit?: 'cover' | 'contain'
}

/** GROQ projection que puxa todos os sub-campos de um controlledImage. */
const IMAGE_PROJ = `{ image, alt, caption, focusHorizontal, focusVertical, fit }`

function toPhotoControls(raw?: RawControlledImage | null): PhotoControls {
  const h = raw?.focusHorizontal ?? 'center'
  const v = raw?.focusVertical ?? 'center'
  const objectPosition = h === 'center' && v === 'center' ? 'center' : `${h} ${v}`
  return {
    objectPosition,
    fitMode: raw?.fit ?? 'cover',
    zoom: 0,
  }
}

/** Resolve URL + metadados de uma controlledImage. Retorna undefined se não tem asset. */
function resolveImage(raw: RawControlledImage | undefined | null, width: number) {
  if (!raw?.image?.asset) return undefined
  const url = urlForImage(raw.image, width)
  if (!url) return undefined
  return {
    src: url,
    alt: raw.alt ?? '',
    caption: raw.caption ?? '',
    controls: toPhotoControls(raw),
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

/* ---------------- Hero ---------------- */

const HERO_QUERY = groq`*[_type == "hero"][0]{
  meta,
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  "imagemFundo": imagemFundo${IMAGE_PROJ},
  contentWidth
}`

type RawHero = {
  meta?: HeroContent['meta']
  headline?: string
  subheadline?: string
  primaryCta?: HeroContent['ctas']['primary']
  secondaryCta?: HeroContent['ctas']['secondary']
  imagemFundo?: RawControlledImage | null
  contentWidth?: SectionLayout['contentWidth']
}

export async function getHeroFromSanity(): Promise<HeroContent | null> {
  if (!sanityClient) return null
  try {
    const data = await sanityClient.fetch<RawHero | null>(HERO_QUERY, {}, fetchOptions)
    if (!data?.headline || !data.subheadline || !data.primaryCta || !data.secondaryCta) {
      return null
    }

    const cover = resolveImage(data.imagemFundo, 2400)

    return {
      meta: data.meta ?? { kicker: '' },
      headline: data.headline,
      subheadline: data.subheadline,
      ctas: { primary: data.primaryCta, secondary: data.secondaryCta },
      media: { alt: cover?.alt ?? '' },
      coverImage: cover
        ? { src: cover.src, alt: cover.alt, ...cover.controls }
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
    "imagem": imagem${IMAGE_PROJ}
  },
  closingCta,
  "imagemPrincipal": imagemPrincipal${IMAGE_PROJ},
  contentWidth,
  imagePosition
}`

type RawChapter = {
  _key?: string
  number?: string
  title?: string
  body?: string
  imagem?: RawControlledImage | null
}

type RawAbout = {
  meta?: AboutContent['meta']
  chapters?: RawChapter[]
  closingCta?: AboutContent['closingCta']
  imagemPrincipal?: RawControlledImage | null
  contentWidth?: SectionLayout['contentWidth']
  imagePosition?: SectionLayout['imagePosition']
}

export async function getAboutFromSanity(): Promise<AboutContent | null> {
  if (!sanityClient) return null
  try {
    const data = await sanityClient.fetch<RawAbout | null>(ABOUT_QUERY, {}, fetchOptions)
    if (!data?.meta || !data.chapters?.length) return null

    const main = resolveImage(data.imagemPrincipal, 1600)

    return {
      meta: data.meta,
      chapters: data.chapters
        .filter(
          (c): c is RawChapter & { number: string; title: string; body: string } =>
            !!c.number && !!c.title && !!c.body,
        )
        .map((c) => {
          const chapterImg = resolveImage(c.imagem, 1200)
          return {
            number: c.number,
            title: c.title,
            body: c.body,
            image: chapterImg
              ? { src: chapterImg.src, alt: chapterImg.alt, ...chapterImg.controls }
              : undefined,
          }
        }),
      closingCta: data.closingCta,
      photo: {
        src: main?.src ?? '',
        alt: main?.alt ?? '',
        caption: main?.caption ?? '',
        ...(main?.controls ?? toPhotoControls(null)),
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
  "imagemLocal": imagemLocal${IMAGE_PROJ},
  contentWidth,
  imagePosition
}`

type RawNow = Omit<NowContent, 'photo' | 'layout'> & {
  imagemLocal?: RawControlledImage | null
  contentWidth?: SectionLayout['contentWidth']
  imagePosition?: SectionLayout['imagePosition']
}

export async function getNowFromSanity(): Promise<NowContent | null> {
  if (!sanityClient) return null
  try {
    const data = await sanityClient.fetch<RawNow | null>(NOW_QUERY, {}, fetchOptions)
    if (!data?.meta || !data.city) return null

    const local = resolveImage(data.imagemLocal, 1600)
    const { imagemLocal: _omit, contentWidth, imagePosition, ...rest } = data
    void _omit

    return {
      ...rest,
      photo: {
        src: local?.src ?? '',
        alt: local?.alt ?? '',
        caption: local?.caption || `${data.city} · ${data.period}`,
        ...(local?.controls ?? toPhotoControls(null)),
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
    "imagemCapa": imagemCapa${IMAGE_PROJ}
  },
  channels,
  contentWidth
}`

type RawHighlight = {
  _key: string
  platform: ContentHighlight['platform']
  url: string
  title: string
  imagemCapa?: RawControlledImage | null
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
      highlights: data.highlights.map((h) => {
        const cover = resolveImage(h.imagemCapa, 800)
        return {
          id: h._key,
          platform: h.platform,
          url: h.url,
          title: h.title,
          thumbnail: cover?.src,
          thumbnailAlt: cover?.alt,
          thumbnailControls: cover?.controls,
        }
      }),
      channels: data.channels,
      layout: toLayout({ contentWidth: data.contentWidth }),
    }
  } catch {
    return null
  }
}
