import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { siteConfig } from '@/content/site.config'

const title = 'Caderno de Viagem'
const description =
  'Uma carta nossa, todo domingo. Com o que deu errado na semana, o que aprendemos, o custo real do que fizemos. Sem marketing. Só a carta.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/caderno' },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: '/caderno',
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

export default function CadernoPage() {
  return (
    <Container className="max-w-3xl py-32">
      <p className="font-mono text-xs uppercase tracking-widest text-foreground/40">{title}</p>
      <h1 className="mt-4 text-4xl md:text-5xl font-medium tracking-tight">
        Uma carta nossa, todo domingo.
      </h1>
      <p className="mt-6 text-foreground/60">
        Página de inscrição em construção. Em breve, formulário ao vivo.
      </p>
    </Container>
  )
}
