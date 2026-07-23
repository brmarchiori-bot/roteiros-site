import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

const ROUTES = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency,
    priority,
  }))
}
