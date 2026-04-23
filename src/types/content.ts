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
  number: string
  title: string
  body: string
  image?: {
    src: string
    alt: string
  } & PhotoControls
}

export type AboutContent = {
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
  meta: SectionMeta
  city: string
  state?: string
  country: string
  /** ISO date (2026-04-20) — pra sort/SEO */
  date: string
  /** Display ("Abril/2026") — pro JourneyMarker */
  period: string
  dayCount: number
  /** Coordenadas opcionais como detalhe tátil (ex: "−5.09° S · −42.80° W") */
  coordinates?: string
  /** Foto da semana — quando src vazio, renderiza PhotoPlaceholder */
  photo?: {
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
  id: string
  title: string
  description: string
  href?: string
}

export type PillarsContent = {
  meta: SectionMeta
  items: Pillar[]
}

/* ---------- Content highlights ---------- */

export type ContentHighlight = {
  id: string
  platform: 'instagram' | 'youtube' | 'tiktok'
  url: string
  title: string
  thumbnail?: string
  thumbnailAlt?: string
  thumbnailControls?: PhotoControls
}

export type ContentChannel = {
  url: string
  cta: string
  note?: string
}

export type ContentBridgeContent = {
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
  id: string
  number: string
  name: string
  description: string
  audience: string
}

export type PartnershipNumber = {
  label: string
  value: string
  note?: string
}

export type PartnershipsContent = {
  meta: SectionMeta
  philosophy: string
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
  question: string
  answer: string
}

export type FaqContent = {
  meta: SectionMeta
  items: FaqItem[]
}
