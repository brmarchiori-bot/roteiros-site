import { Section } from '@/components/layout/section'
import { Reveal } from '@/components/shared/reveal'
import { comingSoon } from '@/content'
import { ComingSoonForm } from './coming-soon-form'

export function ComingSoonSection() {
  return (
    <Section id="coming-soon" spacing="xl">
      {/* Header editorial */}
      <header className="mb-10 md:mb-14">
        <Reveal>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-primary md:w-12" />
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary md:text-[11px]">
              {comingSoon.meta.kicker}
            </p>
          </div>
        </Reveal>

        {comingSoon.meta.title && (
          <Reveal delay={0.08}>
            <h2 className="mt-8 max-w-3xl font-display text-3xl font-medium leading-[1.05] tracking-tight text-foreground md:text-5xl">
              {comingSoon.meta.title}
            </h2>
          </Reveal>
        )}
      </header>

      <Reveal delay={0.12}>
        <p className="mb-14 max-w-2xl font-display text-xl italic leading-snug text-foreground/75 md:mb-20 md:text-[26px] md:leading-[1.45]">
          {comingSoon.intro}
        </p>
      </Reveal>

      <ComingSoonForm items={comingSoon.items} />
    </Section>
  )
}
