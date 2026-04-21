import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

const ROUTES = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/sobre', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/parcerias', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/conteudo', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/caderno', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/jornada', priority: 0.7, changeFrequency: 'weekly' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}
