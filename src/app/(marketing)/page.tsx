import { JsonLd } from '@/components/seo/json-ld'
import { AboutSection } from '@/components/sections/about/about'
import { ContentBridgeSection } from '@/components/sections/content-bridge/content-bridge'
import { FaqSection } from '@/components/sections/faq/faq'
import { HeroSection } from '@/components/sections/hero/hero'
import { NowSection } from '@/components/sections/now/now'
import { PartnershipsSection } from '@/components/sections/partnerships/partnerships'
import { PillarsSection } from '@/components/sections/pillars/pillars'
import { getFaqSchema } from '@/lib/seo'
import { getFaqFromSanity } from '@/sanity/queries'

/** Home editorial enxuta: sete capítulos, sem promessas de produtos futuros. */
export default async function HomePage() {
  const faq = await getFaqFromSanity()

  return (
    <>
      <JsonLd data={getFaqSchema(faq)} id="faq-schema" />
      <HeroSection />
      <NowSection />
      <AboutSection />
      <PillarsSection />
      <ContentBridgeSection />
      <PartnershipsSection />
      <FaqSection faq={faq} />
    </>
  )
}
