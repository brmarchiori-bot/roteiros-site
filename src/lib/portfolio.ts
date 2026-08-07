import type { PortfolioProject } from '@/types/portfolio'

export type PortfolioMediaFilter = 'all' | 'video' | 'photo'

export function visiblePortfolioProjects(projects: PortfolioProject[]) {
  return projects.filter((project) => project.visible).sort((a, b) => a.order - b.order)
}

export function filterPortfolioProjects(projects: PortfolioProject[], category: PortfolioProject['category'] | 'all', media: PortfolioMediaFilter) {
  return visiblePortfolioProjects(projects).filter((project) => {
    const categoryMatches = category === 'all' || project.category === category
    const hasVideo = Boolean(project.primaryVideo || project.modules.some((module) => module.type === 'video'))
    const hasPhoto = Boolean(project.cover || project.modules.some((module) => ['image', 'gallery', 'interfaces'].includes(module.type)))
    return categoryMatches && (media === 'all' || (media === 'video' ? hasVideo : hasPhoto))
  })
}

export function featuredPortfolioProject(projects: PortfolioProject[], selectedId?: string | null) {
  const visible = visiblePortfolioProjects(projects)
  return visible.find((project) => project.id === selectedId) ?? visible.find((project) => project.featured) ?? null
}

export function hasProjectMedia(project: PortfolioProject) {
  return Boolean(project.cover || project.primaryVideo || project.modules.some((module) => ['image', 'gallery', 'interfaces', 'video'].includes(module.type)))
}

export function youtubePrivacyUrl(value: string) {
  try {
    const url = new URL(value)
    const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v') ?? (url.pathname.startsWith('/shorts/') ? url.pathname.split('/')[2] : '')
    return id && /^[\w-]{6,20}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null
  } catch {
    return null
  }
}
