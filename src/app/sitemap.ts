import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

const ROUTES = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
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
