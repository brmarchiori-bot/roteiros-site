import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { emptyPortfolio } from '@/content/portfolio-empty'
import { getPrivatePortfolio } from '@/sanity/portfolio'
import { PortfolioExperience } from '@/components/portfolio/portfolio-experience'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Portfólio privado · Menos Roteiros', description: 'Apresentação privada de trabalhos selecionados.',
  alternates: { canonical: null }, referrer: 'no-referrer',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
}

export default async function PrivatePortfolioPage({ params }: { params: Promise<{ accessKey: string }> }) {
  const { accessKey } = await params
  const configuredKey = process.env.PRIVATE_PORTFOLIO_SLUG
  if (!configuredKey || configuredKey.length < 24 || accessKey !== configuredKey) notFound()
  const published = await getPrivatePortfolio()
  return <PortfolioExperience portfolio={published ?? emptyPortfolio} />
}
