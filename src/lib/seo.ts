import { faq } from '@/content/faq'
import { siteConfig } from '@/content/site.config'
import type { FaqContent } from '@/types/content'
import { SITE_URL } from './constants'

/**
 * Helpers de Schema.org JSON-LD.
 * Cada função retorna um objeto serializável que vira <script type="application/ld+json">.
 */

export function getOrganizationSchema() {
  const socials = (Object.values(siteConfig.social) as string[]).filter(Boolean)

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: SITE_URL,
    description: siteConfig.description,
    founder: [
      { '@type': 'Person', name: siteConfig.founders.andressa },
      { '@type': 'Person', name: siteConfig.founders.bruno },
    ],
    ...(socials.length > 0 && { sameAs: socials }),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: siteConfig.contact.partnerships,
        contactType: 'partnerships',
        areaServed: 'BR',
        availableLanguage: ['Portuguese', 'English'],
      },
    ],
  }
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: SITE_URL,
    description: siteConfig.description,
    inLanguage: siteConfig.locale,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
  }
}

export function getFaqSchema(content: FaqContent = faq) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
