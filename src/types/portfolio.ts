import type { PhotoControls } from './content'

export const PORTFOLIO_CATEGORIES = [
  'hospitality', 'gastronomy', 'events', 'brands', 'digital',
] as const
export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number]

export const PORTFOLIO_CATEGORY_LABELS: Record<PortfolioCategory, string> = {
  hospitality: 'Hospedagem & experiências',
  gastronomy: 'Gastronomia & lugares',
  events: 'Eventos & encontros',
  brands: 'Marcas & histórias',
  digital: 'Projetos & experiências digitais',
}

export const PORTFOLIO_RESPONSIBILITIES = [
  'Direção criativa', 'Roteiro', 'Captação', 'Fotografia', 'Edição', 'Narração',
  'Apresentação', 'Estratégia', 'Produto', 'Arquitetura da experiência', 'UX/UI',
  'Direção visual', 'Desenvolvimento', 'CMS', 'Automações', 'Integrações',
] as const

export type PortfolioProjectType = 'audiovisual' | 'photography' | 'digital' | 'hybrid'
export type PortfolioImage = { src: string; alt: string; caption?: string } & PhotoControls
export type PortfolioVideo = { url: string; title?: string; poster?: PortfolioImage }
export type PortfolioCredit = { name: string; role?: string }

export type PortfolioModule =
  | { id: string; type: 'text'; title?: string; text: string }
  | { id: string; type: 'image'; image: PortfolioImage }
  | { id: string; type: 'gallery' | 'interfaces'; title?: string; images: PortfolioImage[] }
  | { id: string; type: 'video'; video: PortfolioVideo }
  | { id: string; type: 'work' }
  | { id: string; type: 'link'; label: string; url: string }
  | { id: string; type: 'credits'; credits: PortfolioCredit[] }

export type PortfolioProject = {
  id: string
  title: string
  client?: string
  category: PortfolioCategory
  projectType: PortfolioProjectType
  visible: boolean
  featured: boolean
  order: number
  context?: string
  cover?: PortfolioImage
  primaryVideo?: PortfolioVideo
  responsibilities: string[]
  externalLink?: { label: string; url: string }
  modules: PortfolioModule[]
}

export type PrivatePortfolio = {
  privacyLabel: string
  kicker: string
  title: string
  introduction?: string
  heroImage?: PortfolioImage
  heroVideo?: PortfolioVideo
  heroCtaLabel?: string
  initialProjectCount: number
  loadMoreLabel: string
  contact: {
    kicker?: string
    title: string
    text?: string
    ctaLabel?: string
    contactUrl?: string
    email?: string
    background?: PortfolioImage
  }
  footer: {
    text?: string
    links: Array<{ id: string; label: string; url: string }>
  }
  projects: PortfolioProject[]
}
