import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { siteConfig } from '@/content/site.config'

const title = 'Conteúdo'
const description =
  'Vídeos, Reels e bastidores do Menos Roteiros. Continuidade real, não highlight reel.'

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: true },
  alternates: { canonical: '/conteudo' },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: '/conteudo',
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

export default function ConteudoPage() {
  return (
    <Container className="max-w-3xl py-32">
      <p className="font-mono text-xs uppercase tracking-widest text-foreground/40">{title}</p>
      <h1 className="mt-4 text-4xl md:text-5xl font-medium tracking-tight">Em construção.</h1>
      <p className="mt-6 text-foreground/60">
        Hub de conteúdo virá em uma das próximas etapas. Por enquanto, acompanhe pelas redes.
      </p>
    </Container>
  )
}
