import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Container className="max-w-2xl py-32 md:py-48 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-foreground/40">404</p>
          <h1 className="mt-4 text-4xl md:text-5xl font-medium tracking-tight">
            Saiu do mapa.
          </h1>
          <p className="mt-6 text-foreground/60">
            A página que você procurou não existe — ou ainda não foi escrita.
          </p>
          <Link
            href="/"
            className="mt-10 inline-block underline underline-offset-4 hover:opacity-70"
          >
            Voltar pra estrada principal →
          </Link>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}
