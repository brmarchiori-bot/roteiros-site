/**
 * Tipos dos conteúdos editáveis em src/content.
 * Cada arquivo de conteúdo importa o seu tipo — TypeScript valida a estrutura.
 */

/* ---------- Primitivos ---------- */

export type SectionMeta = {
  kicker: string
  title?: string
}

export type Cta = {
  label: string
  href: string
}

/** Controles compartilhados de imagem (Sanity) */
export type PhotoControls = {
  objectPosition?: string // "center", "top left" etc — derivado de horizontalFocus + verticalFocus
  fitMode?: 'cover' | 'contain'
  /** 0 a 100 — aplicado como transform: scale(1 + zoom/100) */
  zoom?: number
}

export type SectionLayout = {
  contentWidth?: 'narrow' | 'medium' | 'wide'
  imagePosition?: 'left' | 'right'
}

/* ---------- Hero ---------- */

export type HeroContent = {
  _id?: string
  _type?: 'hero'
  meta: SectionMeta
  headline: string
  /** Começo fixo do título quando houver rotação (ex: "Viajando o mundo e"). */
  titlePrefix?: string
  /** Palavras que alternam com fade após o titlePrefix. 2+ ativam a rotação. */
  dynamicWords?: string[]
  subheadline: string
  ctas: {
    primary: Cta
    secondary: Cta
  }
  media: {
    videoSrc?: string
    posterSrc?: string
    alt: string
  }
  /** Imagem de capa opcional (gerenciada via Sanity). Quando vazio, usa gradiente. */
  coverImage?: {
    src: string
    alt: string
  } & PhotoControls
  /** Exibe local e período da seção Agora no rodapé da capa. */
  showJourneyCredits?: boolean
  layout?: SectionLayout
}

/* ---------- Manifesto ---------- */

export type ManifestoContent = {
  meta: SectionMeta
  paragraphs: string[]
  signature: string
}

/* ---------- About ---------- */

export type AboutChapter = {
  _key?: string
  number: string
  title: string
  body: string
  image?: {
    src: string
    alt: string
  } & PhotoControls
}

export type AboutContent = {
  _id?: string
  _type?: 'about'
  meta: SectionMeta
  chapters: AboutChapter[]
  closingCta?: Cta
  photo?: {
    /** Caminho em /public — quando vazio, renderiza PhotoPlaceholder */
    src?: string
    alt: string
    caption: string
  } & PhotoControls
  layout?: SectionLayout
}

/* ---------- Now ---------- */

export type NowContent = {
  _id?: string
  _type?: 'now'
  meta: SectionMeta
  city: string
  state?: string
  country: string
  /** ISO date (2026-04-20) — pra sort/SEO */
  date: string
  /** Display ("Abril/2026") — pro JourneyMarker */
  period: string
  /** Nulo no fallback quando a contagem atual ainda não foi confirmada editorialmente. */
  dayCount: number | null
  journeyState?: string
  atmosphere?: 'charcoal' | 'field' | 'paper'
  /** Coordenadas opcionais como detalhe tátil (ex: "−5.09° S · −42.80° W") */
  coordinates?: string
  /** Foto da semana — quando src vazio, renderiza PhotoPlaceholder */
  photo?: {
    src?: string
    alt: string
    caption: string
  } & PhotoControls
  secondaryPhoto?: {
    src?: string
    alt: string
    caption: string
  } & PhotoControls
  caption: string
  /** CTA pra ler bastidores (Instagram, Caderno, etc.) */
  cta?: Cta
  /** Mantido por compatibilidade — link cru pro Instagram */
  link?: string
  layout?: SectionLayout
}

/* ---------- Pillars ---------- */

export type Pillar = {
  _key?: string
  id: string
  title: string
  description: string
  href?: string
}

export type PillarsContent = {
  _id?: string
  _type?: 'pillars'
  meta: SectionMeta
  items: Pillar[]
}

/* ---------- Content highlights ---------- */

export type ContentHighlight = {
  _key?: string
  id: string
  platform: 'instagram' | 'youtube' | 'tiktok'
  url: string
  title: string
  thumbnail?: string
  thumbnailAlt?: string
  thumbnailControls?: PhotoControls
}

export type ContentChannel = {
  _key?: string
  url: string
  cta: string
  note?: string
}

export type ContentBridgeContent = {
  _id?: string
  _type?: 'contentHighlights'
  meta: SectionMeta
  pullQuote?: string
  highlights: ContentHighlight[]
  channels: {
    instagram: ContentChannel
    youtube: ContentChannel
  }
  layout?: SectionLayout
}

/* ---------- Club (Caderno de Viagem) ---------- */

export type ClubSocialProof = {
  count: number
  period: string
}

export type ClubContent = {
  meta: SectionMeta
  name: string
  promise: string
  rule: string
  cta: Cta
  socialProof?: ClubSocialProof | null
}

/* ---------- Coming soon ---------- */

export type ComingSoonItem = {
  id: string
  title: string
  description: string
  tag: string
}

export type ComingSoonContent = {
  meta: SectionMeta
  intro: string
  items: ComingSoonItem[]
}

/* ---------- Partnerships ---------- */

export type PartnershipFormat = {
  _key?: string
  id: string
  number: string
  name: string
  description: string
  audience: string
}

export type PartnershipNumber = {
  _key?: string
  label: string
  value: string
  note?: string
}

export type PartnershipsContent = {
  _id?: string
  _type?: 'partnerships'
  meta: SectionMeta
  philosophy: string
  principles: Array<{
    _key?: string
    id: string
    title: string
    body: string
  }>
  formats: PartnershipFormat[]
  numbers: {
    updatedAt: string
    items: PartnershipNumber[]
  }
  ctas: {
    mediaKit: Cta
    whatsapp: Cta
  }
}

/* ---------- FAQ ---------- */

export type FaqItem = {
  _key?: string
  question: string
  answer: string
}

export type FaqContent = {
  _id?: string
  _type?: 'faq'
  meta: SectionMeta
  intro?: string
  items: FaqItem[]
}

/* ---------- Home completa ---------- */

export type HomeContent = {
  hero: HeroContent
  now: NowContent
  about: AboutContent
  pillars: PillarsContent
  contentHighlights: ContentBridgeContent
  partnerships: PartnershipsContent
  faq: FaqContent
}
