import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { JsonLd } from '@/components/seo/json-ld'
import { siteConfig } from '@/content/site.config'
import { fontVariables } from '@/lib/fonts'
import { SITE_URL } from '@/lib/constants'
import { getOrganizationSchema, getWebSiteSchema } from '@/lib/seo'
import { cn } from '@/lib/utils'
import './globals.css'

const verification = {
  google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  other: process.env.NEXT_PUBLIC_BING_VERIFICATION
    ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION }
    : undefined,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.founders.andressa }, { name: siteConfig.founders.bruno }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  keywords: [
    'viagem real',
    'casal de viagem',
    'creator de viagem brasileiro',
    'travel editorial',
    'vida nômade Brasil',
    'transição de vida',
    'viagem econômica',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: SITE_URL,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  ...(verification.google || verification.yandex || verification.other
    ? { verification }
    : {}),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={siteConfig.locale}
      data-scroll-behavior="smooth"
      className={cn(fontVariables, 'h-full antialiased')}
    >
      <head>
        <JsonLd data={[getOrganizationSchema(), getWebSiteSchema()]} id="org-website-schema" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
        {process.env.VERCEL === '1' && <Analytics />}
      </body>
    </html>
  )
}
