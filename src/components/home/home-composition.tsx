import { JsonLd } from '@/components/seo/json-ld'
import { AboutSection } from '@/components/sections/about/about'
import { ContentBridgeSection } from '@/components/sections/content-bridge/content-bridge'
import { FaqSection } from '@/components/sections/faq/faq'
import { HeroSection } from '@/components/sections/hero/hero'
import { NowSection } from '@/components/sections/now/now'
import { PartnershipsSection } from '@/components/sections/partnerships/partnerships'
import { PillarsSection } from '@/components/sections/pillars/pillars'
import { faq } from '@/content'
import type { PillarsContent } from '@/types/content'
import { getFaqSchema } from '@/lib/seo'

type HomeCompositionProps = {
  pillars?: PillarsContent
}

/** A única composição visual da Home, compartilhada pelo caminho público e editorial. */
export function HomeComposition({ pillars }: HomeCompositionProps) {
  return (
    <>
      <JsonLd data={getFaqSchema(faq)} id="faq-schema" />
      <HeroSection />
      <NowSection />
      <AboutSection />
      <PillarsSection content={pillars} />
      <ContentBridgeSection />
      <PartnershipsSection />
      <FaqSection faq={faq} />
    </>
  )
}
