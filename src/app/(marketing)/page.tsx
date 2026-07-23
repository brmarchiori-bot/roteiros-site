import { JsonLd } from '@/components/seo/json-ld'
import { AboutSection } from '@/components/sections/about/about'
import { ClubSection } from '@/components/sections/club/club'
import { ComingSoonSection } from '@/components/sections/coming-soon/coming-soon'
import { ContentBridgeSection } from '@/components/sections/content-bridge/content-bridge'
import { FaqSection } from '@/components/sections/faq/faq'
import { HeroSection } from '@/components/sections/hero/hero'
import { ManifestoSection } from '@/components/sections/manifesto/manifesto'
import { NowSection } from '@/components/sections/now/now'
import { PartnershipsSection } from '@/components/sections/partnerships/partnerships'
import { PillarsSection } from '@/components/sections/pillars/pillars'
import { getFaqSchema } from '@/lib/seo'
import { getFaqFromSanity } from '@/sanity/queries'

/**
 * Home — composição final das 10 seções da marca.
 *
 * Concluída no PASSO 6:
 *   parte 1 — Hero, Manifesto, About
 *   parte 2 — Now, Pillars, Content Bridge
 *   parte 3 — Club, Coming Soon, Partnerships, FAQ
 */
export default async function HomePage() {
  const faq = await getFaqFromSanity()

  return (
    <>
      <JsonLd data={getFaqSchema(faq)} id="faq-schema" />
      <HeroSection />
      <ManifestoSection />
      <AboutSection />
      <NowSection />
      <PillarsSection />
      <ContentBridgeSection />
      <ClubSection />
      <ComingSoonSection />
      <PartnershipsSection />
      <FaqSection faq={faq} />
    </>
  )
}
