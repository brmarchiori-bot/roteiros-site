import { groq } from 'next-sanity'
import type { PortfolioImage, PortfolioModule, PortfolioProject, PrivatePortfolio } from '@/types/portfolio'
import { PORTFOLIO_CATEGORIES } from '@/types/portfolio'
import { sanityClient } from './client'
import { urlForImage } from './image'

const QUERY = groq`*[_id == "private-portfolio-singleton"][0]`

type Raw = Record<string, unknown>
const text = (value: unknown) => typeof value === 'string' && value.trim() ? value.trim() : undefined
const record = (value: unknown): Raw | undefined => value && typeof value === 'object' && !Array.isArray(value) ? value as Raw : undefined
const records = (value: unknown): Raw[] => Array.isArray(value) ? value.map(record).filter((item): item is Raw => Boolean(item)) : []
const number = (value: unknown, fallback: number) => typeof value === 'number' && Number.isFinite(value) ? value : fallback
const key = (value: unknown) => typeof value === 'string' ? value : ''

function image(raw?: Raw): PortfolioImage | undefined {
  const source = record(raw?.image)
  const src = source?.asset ? urlForImage(source, 2200) : null
  const alt = text(raw?.alt)
  if (!src || !alt) return undefined
  const h = text(raw?.focusHorizontal) ?? 'center'; const v = text(raw?.focusVertical) ?? 'center'
  return { src, alt, caption: text(raw?.caption), objectPosition: h === 'center' && v === 'center' ? 'center' : `${h} ${v}`, fitMode: raw?.fit === 'contain' ? 'contain' : 'cover' }
}

function video(raw?: Raw) {
  const url = text(raw?.url); if (!url) return undefined
  return { url, title: text(raw?.title), poster: image(record(raw?.poster)) }
}

function module(raw: Raw): PortfolioModule | null {
  if (!raw?._key || !raw._type) return null
  if (raw._type === 'portfolioTextModule') { const value = text(raw.text); return value ? { id: key(raw._key), type: 'text', title: text(raw.title), text: value } : null }
  if (raw._type === 'portfolioImageModule') { const value = image(record(raw.image)); return value ? { id: String(raw._key), type: 'image', image: value } : null }
  if (raw._type === 'portfolioGalleryModule' || raw._type === 'portfolioInterfacesModule') { const images = records(raw.images).map(image).filter(Boolean) as PortfolioImage[]; return images.length ? { id: String(raw._key), type: raw._type === 'portfolioGalleryModule' ? 'gallery' : 'interfaces', title: text(raw.title), images } : null }
  if (raw._type === 'portfolioVideoModule') { const value = video(raw); return value ? { id: key(raw._key), type: 'video', video: value } : null }
  if (raw._type === 'portfolioWorkModule') return { id: key(raw._key), type: 'work' }
  if (raw._type === 'portfolioLinkModule') { const label = text(raw.label); const url = text(raw.url); return label && url ? { id: key(raw._key), type: 'link', label, url } : null }
  if (raw._type === 'portfolioCreditsModule') { const credits = records(raw.credits).flatMap((c) => text(c.name) ? [{ name: text(c.name)!, role: text(c.role) }] : []); return credits.length ? { id: String(raw._key), type: 'credits', credits } : null }
  return null
}

function project(raw: Raw): PortfolioProject | null {
  const title = text(raw.title)
  const category = text(raw.category)
  const projectType = text(raw.projectType)
  if (!key(raw._key) || !title || raw.visible === false || !category || !PORTFOLIO_CATEGORIES.includes(category as PortfolioProject['category'])) return null
  return {
    id: key(raw._key), title, client: text(raw.client), category: category as PortfolioProject['category'],
    projectType: projectType && ['audiovisual','photography','digital','hybrid'].includes(projectType) ? projectType as PortfolioProject['projectType'] : 'hybrid',
    visible: true, featured: raw.featured === true, order: number(raw.order, 100),
    context: text(raw.context), cover: image(record(raw.cover)), primaryVideo: video(record(raw.primaryVideo)),
    responsibilities: Array.isArray(raw.responsibilities) ? [...new Set(raw.responsibilities.map(text).filter(Boolean))] as string[] : [],
    externalLink: text(raw.externalLabel) && text(raw.externalUrl) ? { label: text(raw.externalLabel)!, url: text(raw.externalUrl)! } : undefined,
    modules: records(raw.modules).map(module).filter(Boolean) as PortfolioModule[],
  }
}

export async function getPrivatePortfolio(): Promise<PrivatePortfolio | null> {
  if (!sanityClient) return null
  try {
    const raw = await sanityClient.fetch<Raw | null>(QUERY, {}, { cache: 'no-store' })
    const title = text(raw?.title); const contactTitle = text(raw?.contactTitle)
    if (!raw || !title || !contactTitle) return null
    return {
      privacyLabel: text(raw.privacyLabel) ?? 'Portfólio privado', kicker: text(raw.kicker) ?? 'Portfólio', title,
      introduction: text(raw.introduction), heroImage: image(record(raw.heroImage)), heroVideo: video(record(raw.heroVideo)), heroCtaLabel: text(raw.heroCtaLabel),
      initialProjectCount: number(raw.initialProjectCount, 9),
      loadMoreLabel: text(raw.loadMoreLabel) ?? 'Carregar mais projetos',
      contact: { kicker: text(raw.contactKicker), title: contactTitle, text: text(raw.contactText), ctaLabel: text(raw.contactLabel), contactUrl: text(raw.contactUrl), email: text(raw.contactEmail), background: image(record(raw.contactBackground)) },
      footer: { text: text(raw.footerText), links: records(raw.footerLinks).flatMap((link) => key(link._key) && text(link.label) && text(link.url) ? [{ id: key(link._key), label: text(link.label)!, url: text(link.url)! }] : []) },
      projects: records(raw.projects).map(project).filter((item): item is PortfolioProject => Boolean(item)).sort((a, b) => a.order - b.order),
    }
  } catch (error) {
    console.error('[Sanity] Falha ao carregar o portfólio privado.', error)
    return null
  }
}
