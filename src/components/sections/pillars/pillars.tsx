import { Section } from '@/components/layout/section'
import { Reveal } from '@/components/shared/reveal'
import { pillars } from '@/content'

export function PillarsSection() {
  return (
    <Section id="pillars" spacing="xl" className="bg-surface/60" bordered={false}>
      {/* Header editorial */}
      <header className="mb-16 md:mb-24">
        <Reveal>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-primary md:w-12" />
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary md:text-[11px]">
              {pillars.meta.kicker}
            </p>
          </div>
        </Reveal>

        {pillars.meta.title && (
          <Reveal delay={0.08}>
            <h2 className="mt-8 max-w-4xl font-display text-3xl font-medium leading-[1.05] tracking-[-0.01em] text-foreground md:text-5xl lg:text-[56px]">
              {pillars.meta.title}
            </h2>
          </Reveal>
        )}
      </header>

      <ul className="grid gap-px overflow-hidden bg-foreground/15 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.items.map((pillar, i) => (
          <Reveal key={pillar.id} delay={i * 0.07}>
            <li className="relative flex h-full min-h-[240px] flex-col bg-background p-8 md:min-h-[300px] md:p-10">
              {/* Numeração gigante como marca d'água */}
              <p
                aria-hidden="true"
                className="pointer-events-none absolute right-6 top-6 font-display text-5xl font-medium leading-none tracking-tight text-primary/15 md:text-7xl"
              >
                {String(i + 1).padStart(2, '0')}
              </p>

              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary md:text-[11px]">
                Pilar
              </p>

              <h3 className="mt-5 font-display text-[22px] font-medium leading-tight tracking-tight text-foreground md:text-[26px]">
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
