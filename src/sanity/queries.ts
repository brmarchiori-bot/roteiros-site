import { groq } from 'next-sanity'
import {
  about as aboutFallback,
  contentHighlights as contentFallback,
  hero as heroFallback,
  now as nowFallback,
} from '@/content'
import type {
  AboutContent,
  ContentBridgeContent,
  ContentChannel,
  ContentHighlight,
  Cta,
  HeroContent,
  NowContent,
  PhotoControls,
  SectionLayout,
  SectionMeta,
} from '@/types/content'
import { sanityClient } from './client'
import { urlForImage } from './image'

/** Revalidação a cada 60s. */
const fetchOptions = { next: { revalidate: 60 } } as const

/* ---------------- Helpers genéricos ---------------- */

/** Escolhe a primeira string não-vazia (após trim). Usa fallback se Sanity não tem. */
function pickString(primary: string | undefined | null, fallback: string): string
function pickString(
  primary: string | undefined | null,
  fallback: string | undefined,
): string | undefined
function pickString(primary: string | undefined | null, fallback: string | undefined) {
  const trimmed = typeof primary === 'string' ? primary.trim() : ''
  if (trimmed) return trimmed
  return fallback
}

function mergeMeta(
  raw: { kicker?: string; title?: string } | undefined | null,
  fallback: SectionMeta,
): SectionMeta {
  return {
    kicker: pickString(raw?.kicker, fallback.kicker),
    title: pickString(raw?.title, fallback.title),
  }
}

function mergeCta(raw: Partial<Cta> | undefined | null, fallback: Cta): Cta {
  return {
    label: pickString(raw?.label, fallback.label),
    href: pickString(raw?.href, fallback.href),
  }
}

function mergeOptionalCta(
  raw: Partial<Cta> | undefined | null,
  fallback: Cta | undefined,
): Cta | undefined {
  if (!raw && !fallback) return undefined
  const label = pickString(raw?.label, fallback?.label)
  const href = pickString(raw?.href, fallback?.href)
  if (!label || !href) return fallback
  return { label, href }
}

function mergeChannel(
  raw: Partial<ContentChannel> | undefined | null,
  fallback: ContentChannel,
): ContentChannel {
  return {
    url: pickString(raw?.url, fallback.url),
    cta: pickString(raw?.cta, fallback.cta),
    note: pickString(raw?.note, fallback.note),
  }
}

/* ---------------- Imagem ---------------- */

type RawControlledImage = {
  image?: { asset?: unknown; hotspot?: unknown; crop?: unknown } | null
  alt?: string
  caption?: string
  focusHorizontal?: 'left' | 'center' | 'right'
  focusVertical?: 'top' | 'center' | 'bottom'
  fit?: 'cover' | 'contain'
}

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

type ResolvedImage = {
  src: string
  alt: string
  caption: string
  controls: PhotoControls
}

function resolveImage(
  raw: RawControlledImage | undefined | null,
  width: number,
): ResolvedImage | undefined {
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

/* ---------------- Layout ---------------- */

type RawLayout = {
  contentWidth?: SectionLayout['contentWidth']
  imagePosition?: SectionLayout['imagePosition']
}

function mergeLayout(
  raw: RawLayout | undefined | null,
  fallback: SectionLayout | undefined,
): SectionLayout {
  return {
    contentWidth: raw?.contentWidth ?? fallback?.contentWidth ?? 'medium',
    imagePosition: raw?.imagePosition ?? fallback?.imagePosition ?? 'left',
  }
}

/* ================================================================
   HERO
   ================================================================ */

const HERO_QUERY = groq`*[_type == "hero"][0]{
  meta,
  titlePrefix,
  dynamicWords,
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  "imagemFundo": imagemFundo${IMAGE_PROJ},
  contentWidth
}`

type RawHero = {
  meta?: { kicker?: string; title?: string }
  titlePrefix?: string
  dynamicWords?: string[]
  headline?: string
  subheadline?: string
  primaryCta?: Partial<Cta>
  secondaryCta?: Partial<Cta>
  imagemFundo?: RawControlledImage | null
  contentWidth?: SectionLayout['contentWidth']
}

export async function getHeroFromSanity(): Promise<HeroContent> {
  if (!sanityClient) return heroFallback
  try {
    const raw = await sanityClient.fetch<RawHero | null>(HERO_QUERY, {}, fetchOptions)
    if (!raw) return heroFallback

    const cover = resolveImage(raw.imagemFundo, 2400)
    const coverImage = cover
      ? { src: cover.src, alt: cover.alt, ...cover.controls }
      : heroFallback.coverImage

    // Limpa palavras dinâmicas: trim + descarta strings vazias ou curtas demais (< 3 chars).
    // Frases com menos de 3 caracteres não têm densidade visual pra rodar no Hero.
    const cleanedWords = Array.isArray(raw.dynamicWords)
      ? raw.dynamicWords
          .map((w) => (typeof w === 'string' ? w.trim() : ''))
          .filter((w) => w.length >= 3)
      : []
    const dynamicWords = cleanedWords.length > 0 ? cleanedWords : heroFallback.dynamicWords

    return {
      meta: mergeMeta(raw.meta, heroFallback.meta),
      titlePrefix: pickString(raw.titlePrefix, heroFallback.titlePrefix),
      dynamicWords,
      headline: pickString(raw.headline, heroFallback.headline),
      subheadline: pickString(raw.subheadline, heroFallback.subheadline),
      ctas: {
        primary: mergeCta(raw.primaryCta, heroFallback.ctas.primary),
        secondary: mergeCta(raw.secondaryCta, heroFallback.ctas.secondary),
      },
      media: {
        ...heroFallback.media,
        alt: cover?.alt || heroFallback.media.alt,
      },
      coverImage,
      layout: mergeLayout({ contentWidth: raw.contentWidth }, heroFallback.layout),
    }
  } catch {
    return heroFallback
  }
}

/* ================================================================
   ABOUT
   ================================================================ */

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
  meta?: { kicker?: string; title?: string }
  chapters?: RawChapter[]
  closingCta?: Partial<Cta>
  imagemPrincipal?: RawControlledImage | null
  contentWidth?: SectionLayout['contentWidth']
  imagePosition?: SectionLayout['imagePosition']
}

export async function getAboutFromSanity(): Promise<AboutContent> {
  if (!sanityClient) return aboutFallback
  try {
    const raw = await sanityClient.fetch<RawAbout | null>(ABOUT_QUERY, {}, fetchOptions)
    if (!raw) return aboutFallback

    const validChapters = (raw.chapters ?? [])
      .filter(
        (c): c is RawChapter & { number: string; title: string; body: string } =>
          !!c.number?.trim() && !!c.title?.trim() && !!c.body?.trim(),
      )
      .map((c) => {
        const img = resolveImage(c.imagem, 1200)
        return {
          number: c.number.trim(),
          title: c.title.trim(),
          body: c.body.trim(),
          image: img ? { src: img.src, alt: img.alt, ...img.controls } : undefined,
        }
      })

    const chapters = validChapters.length > 0 ? validChapters : aboutFallback.chapters

    const mainImg = resolveImage(raw.imagemPrincipal, 1600)
    const photo = mainImg
      ? {
          src: mainImg.src,
          alt: mainImg.alt,
          caption: mainImg.caption || aboutFallback.photo?.caption || '',
          ...mainImg.controls,
        }
      : aboutFallback.photo

    return {
      meta: mergeMeta(raw.meta, aboutFallback.meta),
      chapters,
      closingCta: mergeOptionalCta(raw.closingCta, aboutFallback.closingCta),
      photo,
      layout: mergeLayout(
        { contentWidth: raw.contentWidth, imagePosition: raw.imagePosition },
        aboutFallback.layout,
      ),
    }
  } catch {
    return aboutFallback
  }
}

/* ================================================================
   NOW
   ================================================================ */

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

type RawNow = {
  meta?: { kicker?: string; title?: string }
  city?: string
  state?: string
  country?: string
  date?: string
  period?: string
  dayCount?: number
  coordinates?: string
  caption?: string
  cta?: Partial<Cta>
  imagemLocal?: RawControlledImage | null
  contentWidth?: SectionLayout['contentWidth']
  imagePosition?: SectionLayout['imagePosition']
}

export async function getNowFromSanity(): Promise<NowContent> {
  if (!sanityClient) return nowFallback
  try {
    const raw = await sanityClient.fetch<RawNow | null>(NOW_QUERY, {}, fetchOptions)
    if (!raw) return nowFallback

    const localImg = resolveImage(raw.imagemLocal, 1600)
    const photo = localImg
      ? {
          src: localImg.src,
          alt: localImg.alt,
          caption: localImg.caption || nowFallback.photo?.caption || '',
          ...localImg.controls,
        }
      : nowFallback.photo

    return {
      meta: mergeMeta(raw.meta, nowFallback.meta),
      city: pickString(raw.city, nowFallback.city),
      state: pickString(raw.state, nowFallback.state),
      country: pickString(raw.country, nowFallback.country),
      date: pickString(raw.date, nowFallback.date),
      period: pickString(raw.period, nowFallback.period),
      dayCount: typeof raw.dayCount === 'number' ? raw.dayCount : nowFallback.dayCount,
      coordinates: pickString(raw.coordinates, nowFallback.coordinates),
      caption: pickString(raw.caption, nowFallback.caption),
      cta: mergeOptionalCta(raw.cta, nowFallback.cta),
      link: nowFallback.link,
      photo,
      layout: mergeLayout(
        { contentWidth: raw.contentWidth, imagePosition: raw.imagePosition },
        nowFallback.layout,
      ),
    }
  } catch {
    return nowFallback
  }
}

/* ================================================================
   CONTENT HIGHLIGHTS
   ================================================================ */

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
  _key?: string
  platform?: ContentHighlight['platform']
  url?: string
  title?: string
  imagemCapa?: RawControlledImage | null
}

type RawContent = {
  meta?: { kicker?: string; title?: string }
  pullQuote?: string
  highlights?: RawHighlight[]
  channels?: {
    instagram?: Partial<ContentChannel>
    youtube?: Partial<ContentChannel>
  }
  contentWidth?: SectionLayout['contentWidth']
}

export async function getContentHighlightsFromSanity(): Promise<ContentBridgeContent> {
  if (!sanityClient) return contentFallback
  try {
    const raw = await sanityClient.fetch<RawContent | null>(CONTENT_QUERY, {}, fetchOptions)
    if (!raw) return contentFallback

    const validHighlights = (raw.highlights ?? [])
      .filter(
        (h): h is RawHighlight & {
          _key: string
          platform: ContentHighlight['platform']
          url: string
          title: string
        } => !!h._key && !!h.platform && !!h.url?.trim() && !!h.title?.trim(),
      )
      .map((h) => {
        const cover = resolveImage(h.imagemCapa, 800)
        return {
          id: h._key,
          platform: h.platform,
          url: h.url.trim(),
          title: h.title.trim(),
          thumbnail: cover?.src,
          thumbnailAlt: cover?.alt,
          thumbnailControls: cover?.controls,
        }
      })

    const highlights = validHighlights.length > 0 ? validHighlights : contentFallback.highlights

    return {
      meta: mergeMeta(raw.meta, contentFallback.meta),
      pullQuote: pickString(raw.pullQuote, contentFallback.pullQuote),
      highlights,
      channels: {
        instagram: mergeChannel(raw.channels?.instagram, contentFallback.channels.instagram),
        youtube: mergeChannel(raw.channels?.youtube, contentFallback.channels.youtube),
      },
      layout: mergeLayout(
        { contentWidth: raw.contentWidth },
        contentFallback.layout,
      ),
    }
  } catch {
    return contentFallback
  }
}
