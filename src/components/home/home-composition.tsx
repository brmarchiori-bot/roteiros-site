import { JsonLd } from '@/components/seo/json-ld'
import { AboutSection } from '@/components/sections/about/about'
import { ContentBridgeSection } from '@/components/sections/content-bridge/content-bridge'
import { FaqSection } from '@/components/sections/faq/faq'
import { HeroSection } from '@/components/sections/hero/hero'
import { NowSection } from '@/components/sections/now/now'
import { PartnershipsSection } from '@/components/sections/partnerships/partnerships'
import { PillarsSection } from '@/components/sections/pillars/pillars'
import { faq as faqFallback } from '@/content'
import type { HomeContent } from '@/types/content'
import { getFaqSchema } from '@/lib/seo'

type HomeCompositionProps = {
  content?: HomeContent
}

/** A única composição visual da Home, compartilhada pelo caminho público e editorial. */
export function HomeComposition({ content }: HomeCompositionProps) {
  const faq = content?.faq ?? faqFallback

  return (
    <>
      <JsonLd data={getFaqSchema(faq)} id="faq-schema" />
      <HeroSection content={content?.hero} journey={content?.now} />
      <NowSection content={content?.now} />
      <AboutSection content={content?.about} />
      <PillarsSection content={content?.pillars} />
      <ContentBridgeSection content={content?.contentHighlights} />
      <PartnershipsSection content={content?.partnerships} />
      <FaqSection faq={faq} />
    </>
  )
}
