import 'server-only'

import { stegaClean } from 'next-sanity'
import { about, contentHighlights, faq, hero, now, partnerships, pillars } from '@/content'
import type { HomeContent } from '@/types/content'
import { createEditorialClient } from './client.server'

export const EDITORIAL_SECTIONS = [
  'hero', 'now', 'about', 'pillars', 'contentHighlights', 'partnerships', 'faq',
] as const
export type EditorialSection = (typeof EDITORIAL_SECTIONS)[number]
export type EditorialContentSource = 'sanity' | 'fallback' | 'unavailable' | 'invalid'
export type EditorialAggregateSource = EditorialContentSource | 'mixed'
export type EditorialReason =
  | 'remote-valid'
  | 'not-authorized'
  | 'document-missing'
  | 'document-invalid'
  | 'configuration-unavailable'
  | 'request-failed'

type SectionContent = {
  hero: HomeContent['hero']; now: HomeContent['now']; about: HomeContent['about']
  pillars: HomeContent['pillars']; contentHighlights: HomeContent['contentHighlights']
  partnerships: HomeContent['partnerships']; faq: HomeContent['faq']
}
export type EditorialSectionResult<K extends EditorialSection = EditorialSection> = {
  content: SectionContent[K]
  source: EditorialContentSource
  documentId?: string
  reason: EditorialReason
  editMetadata?: {
    documentId: string
    documentType: string
    arrayKeys: Record<string, string[]>
  }
}
export type EditorialHomeResult = {
  content: HomeContent
  source: EditorialAggregateSource
  sections: { [K in EditorialSection]: EditorialSectionResult<K> }
}

const FALLBACKS: SectionContent = { hero, now, about, pillars, contentHighlights, partnerships, faq }
const IDS: Record<EditorialSection, string> = {
  hero: 'hero-singleton', now: 'now-singleton', about: 'about-singleton',
  pillars: 'pillars-singleton', contentHighlights: 'content-highlights-singleton',
  partnerships: 'partnerships-singleton', faq: 'faq-singleton',
}
const TYPES: Record<EditorialSection, string> = {
  hero: 'hero', now: 'now', about: 'about', pillars: 'pillars',
  contentHighlights: 'contentHighlights', partnerships: 'partnerships', faq: 'faq',
}

// Server-only and deliberately conservative: old documents never opt themselves in.
const DEFAULT_ALLOWED = new Set<EditorialSection>(['pillars', 'contentHighlights', 'partnerships'])
export function getEditorialAllowlist(value = process.env.SANITY_EDITORIAL_ALLOWED_SECTIONS) {
  if (!value?.trim()) return new Set(DEFAULT_ALLOWED)
  return new Set(
    value.split(',').map((item) => item.trim()).filter(
      (item): item is EditorialSection => EDITORIAL_SECTIONS.includes(item as EditorialSection),
    ),
  )
}

export const EDITORIAL_HOME_QUERY = `*[_id in $ids || _id in $draftIds]{
  _id,_type,meta,titlePrefix,dynamicWords,headline,subheadline,primaryCta,showJourneyCredits,
  imagemFundo{image{asset->{url},hotspot,crop},alt,caption,focusHorizontal,focusVertical,fit},
  city,country,date,period,dayCount,journeyState,atmosphere,caption,cta,
  imagemLocal{image{asset->{url},hotspot,crop},alt,caption,focusHorizontal,focusVertical,fit},
  chapters[]{_key,number,title,body,imagem{image{asset->{url},hotspot,crop},alt,caption,focusHorizontal,focusVertical,fit}},
  closingCta,imagemPrincipal{image{asset->{url},hotspot,crop},alt,caption,focusHorizontal,focusVertical,fit},
  items[]{_key,question,answer,title,description},pullQuote,
  highlights[]{_key,isVisible,platform,url,title,imagemCapa{image{asset->{url},hotspot,crop},alt,caption,focusHorizontal,focusVertical,fit}},
  channels,philosophy,principles[]{_key,title,body},formats[]{_key,name,description,audience},
  contactEmail,contactEmailLabel,whatsappUrl,whatsappLabel,intro,contentWidth,imagePosition
}`

type RawDocument = Record<string, unknown> & { _id?: unknown; _type?: unknown }
type EditorialFetch = (query: string, params: Record<string, unknown>) => Promise<RawDocument[]>

export async function resolveEditorialHome(
  isDraftMode: boolean,
  options: { fetch?: EditorialFetch; allowlist?: ReadonlySet<EditorialSection> } = {},
): Promise<EditorialHomeResult> {
  const allowlist = options.allowlist ?? getEditorialAllowlist()
  if (!isDraftMode) return compose(fallbackSections('not-authorized'))

  let fetchDocuments = options.fetch
  if (!fetchDocuments) {
    const client = createEditorialClient({ stega: true })
    if (!client) return compose(fallbackSections('configuration-unavailable', 'unavailable'))
    fetchDocuments = (query, params) => client.fetch(query, params, { cache: 'no-store' })
  }

  let documents: RawDocument[]
  try {
    // Todos os IDs são consultados para preservar somente metadados de navegação
    // (_id, _type e _key) dos documentos bloqueados. Seus valores nunca entram na UI.
    const ids = EDITORIAL_SECTIONS.map((section) => IDS[section])
    documents = await fetchDocuments(EDITORIAL_HOME_QUERY, {
      ids, draftIds: ids.map((id) => `drafts.${id}`),
    })
  } catch {
    console.error('[Preview editorial] Painel indisponível; usando versões seguras por seção.')
    return compose(fallbackSections('request-failed', 'unavailable'))
  }

  const sections = {} as EditorialHomeResult['sections']
  for (const section of EDITORIAL_SECTIONS) {
    const raw = documents.find((doc) => normalizeId(doc._id) === IDS[section])
    if (!allowlist.has(section)) {
      sections[section] = {
        ...fallback(section, 'not-authorized'),
        ...(raw ? { editMetadata: extractEditMetadata(section, raw) } : {}),
      } as never
      continue
    }
    if (!raw) {
      sections[section] = fallback(section, 'document-missing') as never
      continue
    }
    const content = validateSection(section, raw)
    sections[section] = content
      ? ({ content, source: 'sanity', documentId: String(raw._id), reason: 'remote-valid' } as never)
      : (fallback(section, 'document-invalid', 'invalid') as never)
  }
  return compose(sections)
}

function extractEditMetadata(section: EditorialSection, raw: RawDocument) {
  const arrayKeys: Record<string, string[]> = {}
  if (section === 'about') arrayKeys.chapters = keysFrom(raw.chapters)
  if (section === 'faq' || section === 'pillars') arrayKeys.items = keysFrom(raw.items)
  if (section === 'contentHighlights') arrayKeys.highlights = keysFrom(raw.highlights)
  if (section === 'partnerships') {
    arrayKeys.principles = keysFrom(raw.principles)
    arrayKeys.formats = keysFrom(raw.formats)
  }
  return { documentId: normalizeId(raw._id), documentType: String(raw._type), arrayKeys }
}

function keysFrom(value: unknown) {
  return array(value).map((item) => structuralString(object(item)?._key)).filter((key): key is string => Boolean(key))
}

function validateSection<K extends EditorialSection>(section: K, raw: RawDocument): SectionContent[K] | null {
  if (normalizeId(raw._id) !== IDS[section] || raw._type !== TYPES[section]) return null
  const mapper = MAPPERS[section] as (value: RawDocument) => SectionContent[K] | null
  return mapper(raw)
}

const MAPPERS: { [K in EditorialSection]: (raw: RawDocument) => SectionContent[K] | null } = {
  hero: (raw) => {
    const meta = requiredMeta(raw.meta); const primary = requiredCta(raw.primaryCta)
    const headline = text(raw.headline); const prefix = optionalText(raw.titlePrefix)
    const words = stringArray(raw.dynamicWords); const subheadline = text(raw.subheadline)
    if (!meta || !primary || !subheadline || (!headline && !(prefix && words.length >= 2))) return null
    const image = optionalImage(raw.imagemFundo)
    return { _id: String(raw._id), _type: 'hero', meta, headline: headline ?? '', titlePrefix: prefix,
      dynamicWords: words, subheadline, ctas: { primary, secondary: hero.ctas.secondary },
      media: hero.media, ...(image ? { coverImage: image } : {}),
      showJourneyCredits: clean(raw.showJourneyCredits) !== false, layout: layout(raw) }
  },
  now: (raw) => {
    const meta = requiredMeta(raw.meta); const city = text(raw.city); const country = text(raw.country)
    const date = text(raw.date); const period = text(raw.period); const caption = text(raw.caption)
    if (!meta || !city || !country || !date || !period || !caption || !validDate(date)) return null
    const photo = optionalImage(raw.imagemLocal)
    return { _id: String(raw._id), _type: 'now', meta, city, country, date, period, caption,
      dayCount: typeof clean(raw.dayCount) === 'number' ? clean(raw.dayCount) as number : null,
      journeyState: optionalText(raw.journeyState), atmosphere: enumValue(raw.atmosphere, ['charcoal','field','paper']),
      cta: optionalCta(raw.cta), ...(photo ? { photo: { ...photo, caption: photo.caption ?? caption } } : {}), layout: layout(raw) }
  },
  about: (raw) => {
    const meta = requiredMeta(raw.meta); const chapters = array(raw.chapters).map(chapter).filter(Boolean)
    if (!meta || chapters.length === 0 || chapters.length !== array(raw.chapters).length) return null
    const photo = optionalImage(raw.imagemPrincipal)
    return { _id: String(raw._id), _type: 'about', meta, chapters: chapters as HomeContent['about']['chapters'],
      closingCta: optionalCta(raw.closingCta), ...(photo ? { photo: { ...photo, caption: photo.caption ?? '' } } : {}), layout: layout(raw) }
  },
  pillars: (raw) => {
    const meta = requiredMeta(raw.meta); const source = array(raw.items); const items = source.map((item) => {
      const value = object(item); const key = structuralString(value?._key); const title = text(value?.title); const description = text(value?.description)
      return key && title && description ? { _key: key, id: key, title, description } : null
    })
    return meta && source.length === 4 && items.every(Boolean)
      ? { _id: String(raw._id), _type: 'pillars', meta, items: items as HomeContent['pillars']['items'] } : null
  },
  contentHighlights: (raw) => {
    const meta = requiredMeta(raw.meta); const channels = object(raw.channels)
    const instagram = channel(channels?.instagram); const youtube = channel(channels?.youtube)
    const source = array(raw.highlights).filter((item) => clean(object(item)?.isVisible) !== false)
    const highlights = source.map(highlight)
    if (!meta || !instagram || !youtube || highlights.some((item) => !item)) return null
    return { _id: String(raw._id), _type: 'contentHighlights', meta, pullQuote: optionalText(raw.pullQuote),
      highlights: highlights as HomeContent['contentHighlights']['highlights'], channels: { instagram, youtube }, layout: layout(raw) }
  },
  partnerships: (raw) => {
    const meta = requiredMeta(raw.meta); const philosophy = text(raw.philosophy)
    const principles = array(raw.principles).map(principle); const formats = array(raw.formats).map(format)
    const email = structuralString(raw.contactEmail); const emailLabel = text(raw.contactEmailLabel)
    const whatsapp = structuralString(raw.whatsappUrl); const whatsappLabel = text(raw.whatsappLabel)
    if (!meta || !philosophy || principles.length !== 3 || principles.some((x) => !x) || formats.length === 0 || formats.some((x) => !x)) return null
    if ((emailLabel && !email) || (whatsappLabel && !whatsapp)) return null
    return { _id: String(raw._id), _type: 'partnerships', meta, philosophy,
      principles: principles as HomeContent['partnerships']['principles'], formats: formats as HomeContent['partnerships']['formats'],
      numbers: partnerships.numbers, ctas: {
        mediaKit: email && emailLabel ? { label: emailLabel, href: `mailto:${email}` } : partnerships.ctas.mediaKit,
        whatsapp: whatsapp && whatsappLabel ? { label: whatsappLabel, href: whatsapp } : partnerships.ctas.whatsapp,
      } }
  },
  faq: (raw) => {
    const meta = requiredMeta(raw.meta); const source = array(raw.items); const items = source.map(faqItem)
    if (!meta || source.length === 0 || items.some((item) => !item)) return null
    return { _id: String(raw._id), _type: 'faq', meta, intro: optionalText(raw.intro), items: items as HomeContent['faq']['items'] }
  },
}

function compose(sections: EditorialHomeResult['sections']): EditorialHomeResult {
  const sources = EDITORIAL_SECTIONS.map((section) => sections[section].source)
  const source: EditorialAggregateSource = sources.every((s) => s === 'sanity') ? 'sanity'
    : sources.every((s) => s === 'fallback' || s === 'invalid') ? 'fallback'
    : sources.every((s) => s === 'unavailable') ? 'unavailable' : 'mixed'
  return { source, sections, content: Object.fromEntries(
    EDITORIAL_SECTIONS.map((section) => [section, sections[section].content]),
  ) as HomeContent }
}
function fallbackSections(reason: EditorialReason, source: EditorialContentSource = 'fallback') {
  return Object.fromEntries(EDITORIAL_SECTIONS.map((section) => [section, fallback(section, reason, source)])) as EditorialHomeResult['sections']
}
function fallback<K extends EditorialSection>(section: K, reason: EditorialReason, source: EditorialContentSource = 'fallback'): EditorialSectionResult<K> {
  return { content: FALLBACKS[section], source, reason }
}
function normalizeId(value: unknown) { return typeof value === 'string' ? value.replace(/^drafts\./, '') : '' }
function clean(value: unknown): unknown { return typeof value === 'string' ? stegaClean(value) : value }
function text(value: unknown) { return typeof value === 'string' && value.trim() ? value : null }
function optionalText(value: unknown) { return text(value) ?? undefined }
function structuralString(value: unknown) { const v = clean(value); return typeof v === 'string' && v.trim() ? v.trim() : undefined }
function object(value: unknown): Record<string, unknown> | null { return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null }
function array(value: unknown): unknown[] { return Array.isArray(value) ? value : [] }
function stringArray(value: unknown) { return array(value).filter((v): v is string => typeof v === 'string' && Boolean(v.trim())) }
function requiredMeta(value: unknown) { const v = object(value); const kicker = text(v?.kicker); const title = optionalText(v?.title); return kicker ? { kicker, ...(title ? { title } : {}) } : null }
function requiredCta(value: unknown) { const v = object(value); const label = text(v?.label); const href = structuralString(v?.href); return label && href ? { label, href } : null }
function optionalCta(value: unknown) { if (!value) return undefined; return requiredCta(value) ?? undefined }
function enumValue<T extends string>(value: unknown, allowed: readonly T[]): T | undefined { const v = clean(value); return typeof v === 'string' && allowed.includes(v as T) ? v as T : undefined }
function layout(raw: RawDocument) { return { contentWidth: enumValue(raw.contentWidth, ['narrow','medium','wide']) ?? 'medium', imagePosition: enumValue(raw.imagePosition, ['left','right']) ?? 'left' } }
function validDate(value: string) { return /^\d{4}-\d{2}-\d{2}$/.test(structuralString(value) ?? '') }
function optionalImage(value: unknown) { const v = object(value); const image = object(v?.image); const asset = object(image?.asset); const src = structuralString(asset?.url); if (!src) return undefined
  const horizontal = enumValue(v?.focusHorizontal, ['left','center','right']) ?? 'center'; const vertical = enumValue(v?.focusVertical, ['top','center','bottom']) ?? 'center'
  return { src, alt: text(v?.alt) ?? '', caption: optionalText(v?.caption), objectPosition: horizontal === 'center' && vertical === 'center' ? 'center' : `${horizontal} ${vertical}`, fitMode: enumValue(v?.fit, ['cover','contain']) ?? 'cover' as const }
}
function chapter(value: unknown) { const v = object(value); const _key = structuralString(v?._key); const number = text(v?.number); const title = text(v?.title); const body = text(v?.body); if (!_key || !number || !title || !body) return null; const image = optionalImage(v?.imagem); return { _key, number, title, body, ...(image ? { image } : {}) } }
function faqItem(value: unknown) { const v = object(value); const _key = structuralString(v?._key); const question = text(v?.question); const answer = text(v?.answer); return _key && question && answer ? { _key, question, answer } : null }
function channel(value: unknown) { const v = object(value); const url = structuralString(v?.url); const cta = text(v?.cta); return url && cta ? { url, cta, note: optionalText(v?.note) } : null }
function highlight(value: unknown) { const v = object(value); const _key = structuralString(v?._key); const platform = enumValue(v?.platform, ['instagram','youtube','tiktok']); const url = structuralString(v?.url); const title = text(v?.title); if (!_key || !platform || !url || !title) return null; const image = optionalImage(v?.imagemCapa); return { _key, id: _key, platform, url, title, ...(image ? { thumbnail: image.src, thumbnailAlt: image.alt, thumbnailControls: { objectPosition: image.objectPosition, fitMode: image.fitMode } } : {}) } }
function principle(value: unknown) { const v = object(value); const _key = structuralString(v?._key); const title = text(v?.title); const body = text(v?.body); return _key && title && body ? { _key, id: _key, title, body } : null }
function format(value: unknown) { const v = object(value); const _key = structuralString(v?._key); const name = text(v?.name); const description = text(v?.description); const audience = text(v?.audience); return _key && name && description && audience ? { _key, id: _key, number: '', name, description, audience } : null }
