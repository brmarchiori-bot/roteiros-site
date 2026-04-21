import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { siteConfig } from '@/content/site.config'

const title = 'Sobre'
const description =
  'A história por trás do Menos Roteiros — dois que trocaram o balcão pela estrada e decidiram publicar a tentativa.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/sobre' },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: '/sobre',
    siteName: siteConfig.name,
    title: `${title} · ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${title} · ${siteConfig.name}`,
    description,
  },
}

export default function SobrePage() {
  return (
    <Container className="max-w-3xl py-32">
      <p className="font-mono text-xs uppercase tracking-widest text-foreground/40">{title}</p>
      <h1 className="mt-4 text-4xl md:text-5xl font-medium tracking-tight">Em construção.</h1>
      <p className="mt-6 text-foreground/60">
        Esta página será publicada em breve. Por enquanto, a história mora na home.
      </p>
    </Container>
  )
}
