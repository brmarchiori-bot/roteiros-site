import { groq } from 'next-sanity'
import { cache } from 'react'
import {
  about as aboutFallback,
  contentHighlights as contentFallback,
  faq as faqFallback,
  hero as heroFallback,
  now as nowFallback,
  partnerships as partnershipsFallback,
  pillars as pillarsFallback,
} from '@/content'
import type {
  AboutContent,
  ContentBridgeContent,
  ContentChannel,
  ContentHighlight,
  Cta,
  FaqContent,
  FaqItem,
  HeroContent,
  NowContent,
  PartnershipsContent,
  PhotoControls,
  PillarsContent,
  SectionLayout,
  SectionMeta,
} from '@/types/content'
import { sanityClient } from './client'
import { urlForImage } from './image'

/** Publicações do Studio devem aparecer na próxima abertura da Home, sem ISR defasado. */
const fetchOptions = { cache: 'no-store' } as const

type QueryClient = NonNullable<typeof sanityClient>

export type SanityQueryOptions = {
  client?: QueryClient
  fetchOptions?: {
    cache?: RequestCache
    next?: { revalidate?: number }
  }
}

function queryContext(options?: SanityQueryOptions) {
  return {
    client: options?.client ?? sanityClient,
    options: options?.fetchOptions ?? fetchOptions,
  }
}

/* ---------------- Helpers genéricos ---------------- */

function reportSanityFallback(section: string, error: unknown) {
  console.error(`[Sanity] Falha ao carregar "${section}"; usando fallback local.`, error)
}

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

const HERO_QUERY = groq`*[_id == "hero-singleton"][0]{
  meta,
  titlePrefix,
  dynamicWords,
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  "imagemFundo": imagemFundo${IMAGE_PROJ},
  showJourneyCredits,
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
  showJourneyCredits?: boolean
  contentWidth?: SectionLayout['contentWidth']
}

export async function getHeroFromSanity(options?: SanityQueryOptions): Promise<HeroContent> {
  const context = queryContext(options)
  if (!context.client) return heroFallback
  try {
    const raw = await context.client.fetch<RawHero | null>(HERO_QUERY, {}, context.options)
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
      showJourneyCredits: raw.showJourneyCredits ?? heroFallback.showJourneyCredits,
      layout: mergeLayout({ contentWidth: raw.contentWidth }, heroFallback.layout),
    }
  } catch (error) {
    reportSanityFallback('hero', error)
    return heroFallback
  }
}

/* ================================================================
   ABOUT
   ================================================================ */

const ABOUT_QUERY = groq`*[_id == "about-singleton"][0]{
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

export async function getAboutFromSanity(options?: SanityQueryOptions): Promise<AboutContent> {
  const context = queryContext(options)
  if (!context.client) return aboutFallback
  try {
    const raw = await context.client.fetch<RawAbout | null>(ABOUT_QUERY, {}, context.options)
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
  } catch (error) {
    reportSanityFallback('about', error)
    return aboutFallback
  }
}

/* ================================================================
   NOW
   ================================================================ */

const NOW_QUERY = groq`*[_id == "now-singleton"][0]{
  meta,
  city, state, country,
  date, period, dayCount, coordinates, journeyState, atmosphere,
  caption,
  cta,
  "imagemLocal": imagemLocal${IMAGE_PROJ},
  "imagemSecundaria": imagemSecundaria${IMAGE_PROJ},
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
  journeyState?: string
  atmosphere?: NowContent['atmosphere']
  coordinates?: string
  caption?: string
  cta?: Partial<Cta>
  imagemLocal?: RawControlledImage | null
  imagemSecundaria?: RawControlledImage | null
  contentWidth?: SectionLayout['contentWidth']
  imagePosition?: SectionLayout['imagePosition']
}

async function fetchNowFromSanity(options?: SanityQueryOptions): Promise<NowContent> {
  const context = queryContext(options)
  if (!context.client) return nowFallback
  try {
    const raw = await context.client.fetch<RawNow | null>(NOW_QUERY, {}, context.options)
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
    const secondaryImg = resolveImage(raw.imagemSecundaria, 1200)
    const secondaryPhoto = secondaryImg
      ? {
          src: secondaryImg.src,
          alt: secondaryImg.alt,
          caption: secondaryImg.caption || '',
          ...secondaryImg.controls,
        }
      : undefined

    return {
      meta: mergeMeta(raw.meta, nowFallback.meta),
      city: pickString(raw.city, nowFallback.city),
      state: pickString(raw.state, nowFallback.state),
      country: pickString(raw.country, nowFallback.country),
      date: pickString(raw.date, nowFallback.date),
      period: pickString(raw.period, nowFallback.period),
      dayCount: typeof raw.dayCount === 'number' ? raw.dayCount : nowFallback.dayCount,
      journeyState: pickString(raw.journeyState, nowFallback.journeyState),
      atmosphere: raw.atmosphere ?? nowFallback.atmosphere,
      coordinates: pickString(raw.coordinates, nowFallback.coordinates),
      caption: pickString(raw.caption, nowFallback.caption),
      cta: mergeOptionalCta(raw.cta, nowFallback.cta),
      link: nowFallback.link,
      photo,
      secondaryPhoto,
      layout: mergeLayout(
        { contentWidth: raw.contentWidth, imagePosition: raw.imagePosition },
        nowFallback.layout,
      ),
    }
  } catch (error) {
    reportSanityFallback('now', error)
    return nowFallback
  }
}

const getCachedNowFromSanity = cache(() => fetchNowFromSanity())

export function getNowFromSanity(options?: SanityQueryOptions): Promise<NowContent> {
  return options ? fetchNowFromSanity(options) : getCachedNowFromSanity()
}

/* ================================================================
   CONTENT HIGHLIGHTS
   ================================================================ */

const CONTENT_QUERY = groq`*[_id == "content-highlights-singleton"][0]{
  meta,
  pullQuote,
  highlights[]{
    _key, platform, url, title, isVisible,
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
  isVisible?: boolean
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

export async function getContentHighlightsFromSanity(options?: SanityQueryOptions): Promise<ContentBridgeContent> {
  const context = queryContext(options)
  if (!context.client) return contentFallback
  try {
    const raw = await context.client.fetch<RawContent | null>(CONTENT_QUERY, {}, context.options)
    if (!raw) return contentFallback

    const validHighlights = (raw.highlights ?? [])
      .filter((h) => h.isVisible !== false)
      .filter(
        (h): h is RawHighlight & {
          _key: string
          platform: ContentHighlight['platform']
          url: string
          title: string
        } => !!h._key && !!h.platform && !!h.url?.trim() && !!h.title?.trim(),
      )
      .slice(0, 3)
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
  } catch (error) {
    reportSanityFallback('contentHighlights', error)
    return contentFallback
  }
}

/* ================================================================
   PILLARS
   ================================================================ */

const PILLARS_QUERY = groq`*[_id == "pillars-singleton"][0]{
  meta,
  items[]{ _key, title, description, href }
}`

export async function getPillarsFromSanity(options?: SanityQueryOptions): Promise<PillarsContent> {
  const context = queryContext(options)
  if (!context.client) return pillarsFallback
  try {
    const raw = await context.client.fetch<{
      meta?: { kicker?: string; title?: string }
      items?: Array<{ _key?: string; title?: string; description?: string; href?: string }>
    } | null>(PILLARS_QUERY, {}, context.options)
    if (!raw) return pillarsFallback

    const items = (raw.items ?? [])
      .filter((item) => item._key && item.title?.trim() && item.description?.trim())
      .slice(0, 4)
      .map((item) => ({
        id: item._key as string,
        title: item.title!.trim(),
        description: item.description!.trim(),
        href: pickString(item.href, undefined),
      }))

    return {
      meta: mergeMeta(raw.meta, pillarsFallback.meta),
      items: items.length > 0 ? items : pillarsFallback.items,
    }
  } catch (error) {
    reportSanityFallback('pillars', error)
    return pillarsFallback
  }
}

/* ================================================================
   PARTNERSHIPS
   ================================================================ */

const PARTNERSHIPS_QUERY = groq`*[_id == "partnerships-singleton"][0]{
  meta, philosophy, contactEmail, contactEmailLabel, whatsappUrl, whatsappLabel,
  principles[]{ _key, title, body },
  formats[]{ _key, name, description, audience }
}`

export async function getPartnershipsFromSanity(options?: SanityQueryOptions): Promise<PartnershipsContent> {
  const context = queryContext(options)
  if (!context.client) return partnershipsFallback
  try {
    const raw = await context.client.fetch<{
      meta?: { kicker?: string; title?: string }
      philosophy?: string
      contactEmail?: string
      contactEmailLabel?: string
      whatsappUrl?: string
      whatsappLabel?: string
      principles?: Array<{ _key?: string; title?: string; body?: string }>
      formats?: Array<{
        _key?: string
        name?: string
        description?: string
        audience?: string
      }>
    } | null>(PARTNERSHIPS_QUERY, {}, context.options)
    if (!raw) return partnershipsFallback

    const formats = (raw.formats ?? [])
      .filter(
        (item) =>
          item._key &&
          item.name?.trim() &&
          item.description?.trim() &&
          item.audience?.trim(),
      )
      .slice(0, 3)
      .map((item, index) => ({
        id: item._key as string,
        number: String(index + 1).padStart(2, '0'),
        name: item.name!.trim(),
        description: item.description!.trim(),
        audience: item.audience!.trim(),
      }))

    const principles = (raw.principles ?? [])
      .filter((item) => item._key && item.title?.trim() && item.body?.trim())
      .slice(0, 3)
      .map((item) => ({
        id: item._key as string,
        title: item.title!.trim(),
        body: item.body!.trim(),
      }))

    const email = raw.contactEmail?.trim()
    const whatsapp = raw.whatsappUrl?.trim()

    return {
      meta: mergeMeta(raw.meta, partnershipsFallback.meta),
      philosophy: pickString(raw.philosophy, partnershipsFallback.philosophy),
      principles: principles.length === 3 ? principles : partnershipsFallback.principles,
      formats: formats.length > 0 ? formats : partnershipsFallback.formats,
      numbers: partnershipsFallback.numbers,
      ctas: {
        mediaKit: email
          ? {
              label: pickString(raw.contactEmailLabel, partnershipsFallback.ctas.mediaKit.label),
              href: `mailto:${email}?subject=${encodeURIComponent(
                'Quero conhecer o trabalho do Menos Roteiros',
              )}`,
            }
          : partnershipsFallback.ctas.mediaKit,
        whatsapp: whatsapp
          ? {
              label: pickString(raw.whatsappLabel, partnershipsFallback.ctas.whatsapp.label),
              href: whatsapp,
            }
          : partnershipsFallback.ctas.whatsapp,
      },
    }
  } catch (error) {
    reportSanityFallback('partnerships', error)
    return partnershipsFallback
  }
}

/* ================================================================
   FAQ
   ================================================================ */

const FAQ_QUERY = groq`*[_id == "faq-singleton"][0]{
  meta,
  intro,
  items[]{ _key, question, answer }
}`

type RawFaqItem = {
  _key?: string
  question?: string
  answer?: string
}

type RawFaq = {
  meta?: { kicker?: string; title?: string }
  intro?: string
  items?: RawFaqItem[]
}

export async function getFaqFromSanity(options?: SanityQueryOptions): Promise<FaqContent> {
  const context = queryContext(options)
  if (!context.client) return faqFallback
  try {
    const raw = await context.client.fetch<RawFaq | null>(FAQ_QUERY, {}, context.options)
    if (!raw) return faqFallback

    // Filtra itens válidos: precisa ter pergunta E resposta (ambas não-vazias após trim)
    const validItems: FaqItem[] = (raw.items ?? [])
      .filter(
        (i): i is RawFaqItem & { question: string; answer: string } =>
          !!i.question?.trim() && !!i.answer?.trim(),
      )
      .map((i) => ({
        question: i.question.trim(),
        answer: i.answer.trim(),
      }))

    // Se filtrado ficou vazio, usa fallback inteiro (não deixa seção "morta")
    const items = validItems.length > 0 ? validItems : faqFallback.items

    return {
      meta: mergeMeta(raw.meta, faqFallback.meta),
      intro: pickString(raw.intro, faqFallback.intro),
      items,
    }
  } catch (error) {
    reportSanityFallback('faq', error)
    return faqFallback
  }
}
