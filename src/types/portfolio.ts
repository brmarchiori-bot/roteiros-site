import type { PhotoControls } from './content'

export type PortfolioLink = {
  label: string
  url: string
}

export type PortfolioMedia = {
  id: string
  kind: 'image' | 'reel' | 'youtube' | 'video'
  title?: string
  url?: string
  image?: {
    src: string
    alt: string
    caption?: string
  } & PhotoControls
}

export type PortfolioProject = {
  id: string
  title: string
  client?: string
  objective?: string
  description?: string
  result?: string
  links: PortfolioLink[]
  media: PortfolioMedia[]
}

export type PortfolioCategory = {
  id: string
  title: string
  description?: string
  projects: PortfolioProject[]
}

export type PrivatePortfolio = {
  title: string
  introduction?: string
  contactLabel?: string
  contactUrl?: string
  categories: PortfolioCategory[]
}
