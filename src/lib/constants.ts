import { siteConfig } from '@/content/site.config'

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? siteConfig.url

export const BRAND_NAME = siteConfig.name
