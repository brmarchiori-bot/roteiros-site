import { Section } from '@/components/layout/section'
import { SectionHeader } from '@/components/layout/section-header'
import { Reveal } from '@/components/shared/reveal'
import { comingSoon } from '@/content'
import { ComingSoonForm } from './coming-soon-form'

export function ComingSoonSection() {
  return (
    <Section id="coming-soon" spacing="xl">
      <SectionHeader meta={comingSoon.meta} className="mb-8 md:mb-10" />

      <Reveal delay={0.1}>
        <p className="mb-14 max-w-2xl font-display text-2xl italic leading-snug text-foreground/80 md:mb-20 md:text-[28px] md:leading-[1.4]">
          {comingSoon.intro}
        </p>
      </Reveal>

      <ComingSoonForm items={comingSoon.items} />
    </Section>
  )
}
