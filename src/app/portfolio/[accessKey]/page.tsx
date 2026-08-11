import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Portfólio privado · Menos Roteiros', description: 'Apresentação privada de trabalhos selecionados.',
  alternates: { canonical: null }, referrer: 'no-referrer',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
}

export default function PrivatePortfolioPage() {
  notFound()
}
