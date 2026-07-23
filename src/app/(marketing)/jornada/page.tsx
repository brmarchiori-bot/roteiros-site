import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { siteConfig } from '@/content/site.config'

const title = 'Jornada'
const description =
  'Onde a gente tá agora — e onde já passou. Mapa interativo + diário em construção.'

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: true },
  alternates: { canonical: '/jornada' },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: '/jornada',
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

export default function JornadaPage() {
  return (
    <Container className="max-w-3xl py-32">
      <p className="font-mono text-xs uppercase tracking-widest text-foreground/40">{title}</p>
      <h1 className="mt-4 text-4xl md:text-5xl font-medium tracking-tight">
        A jornada escrita enquanto acontece.
      </h1>
      <p className="mt-6 text-foreground/60">
        Mapa interativo + diário em construção. Versão completa em breve.
      </p>
    </Container>
  )
}
