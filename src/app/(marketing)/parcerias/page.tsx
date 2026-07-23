import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { siteConfig } from '@/content/site.config'

const title = 'Parcerias'
const description =
  'Trabalhamos com poucas marcas. E com as certas. Filosofia, formatos e como conversar com a gente.'

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: true },
  alternates: { canonical: '/parcerias' },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: '/parcerias',
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

export default function ParceriasPage() {
  return (
    <Container className="max-w-3xl py-32">
      <p className="font-mono text-xs uppercase tracking-widest text-foreground/40">{title}</p>
      <h1 className="mt-4 text-4xl md:text-5xl font-medium tracking-tight">
        Trabalhamos com poucas marcas. E com as certas.
      </h1>
      <p className="mt-6 text-foreground/60">
        Página completa em construção. Pré-visualização e mídia kit aparecem na home.
      </p>
    </Container>
  )
}
