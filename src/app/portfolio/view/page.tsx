import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { PortfolioExperience } from '@/components/portfolio/portfolio-experience'
import { emptyPortfolio } from '@/content/portfolio-empty'
import { getPrivatePortfolio } from '@/sanity/portfolio'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Portfólio privado · Menos Roteiros',
  description: 'Apresentação privada de trabalhos selecionados.',
  alternates: { canonical: null },
  referrer: 'no-referrer',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
}

export default async function PrivatePortfolioView() {
  const configuredKey = process.env.PRIVATE_PORTFOLIO_SLUG ?? ''
  const authorization = (await headers()).get('x-private-portfolio-auth') ?? ''
  const expectedAuthorization = configuredKey.length >= 24 ? await privateAccessToken(configuredKey) : ''
  if (!expectedAuthorization || !constantTimeEqual(authorization, expectedAuthorization)) notFound()
  const published = await getPrivatePortfolio()
  return <PortfolioExperience portfolio={published ?? emptyPortfolio} />
}

async function privateAccessToken(key: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`menos-roteiro:${key}`))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function constantTimeEqual(left: string, right: string) {
  const size = Math.max(left.length, right.length)
  let difference = left.length ^ right.length
  for (let index = 0; index < size; index += 1) difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0)
  return difference === 0
}
