import { Section } from '@/components/layout/section'
import { SectionHeader } from '@/components/layout/section-header'
import { Reveal } from '@/components/shared/reveal'
import { pillars } from '@/content'

export function PillarsSection() {
  return (
    <Section id="pillars" spacing="xl">
      <SectionHeader meta={pillars.meta} className="mb-14 md:mb-20" />

      <ul className="grid gap-10 sm:grid-cols-2 md:gap-12 lg:grid-cols-4">
        {pillars.items.map((pillar, i) => (
          <Reveal key={pillar.id} delay={i * 0.08}>
            <li className="border-t border-foreground/15 pt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-5 font-display text-2xl font-medium leading-tight tracking-tight text-foreground md:text-[28px]">
                {pillar.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-foreground/75 md:text-base md:leading-[1.7]">
                {pillar.description}
              </p>
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
