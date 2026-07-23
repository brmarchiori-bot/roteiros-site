import { Section } from '@/components/layout/section'
import { Reveal } from '@/components/shared/reveal'
import { getPillarsFromSanity } from '@/sanity/queries'

export async function PillarsSection() {
  const pillars = await getPillarsFromSanity()
  return (
    <Section id="pillars" spacing="xl" className="bg-surface/70" bordered={false}>
      {/* Header editorial */}
      <header className="mb-10 md:mb-14">
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
            <h2 className="mt-6 max-w-4xl font-display text-3xl font-medium leading-[1.05] tracking-[-0.01em] text-foreground md:text-5xl">
              {pillars.meta.title}
            </h2>
          </Reveal>
        )}
      </header>

      <ul className="grid gap-x-12 gap-y-2 border-y border-foreground/20 py-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
        {pillars.items.map((pillar, i) => (
          <Reveal key={pillar.id} delay={i * 0.07}>
            <li className="relative flex h-full min-h-[210px] flex-col border-b border-foreground/15 px-2 py-8 last:border-b-0 sm:border-b-0 lg:min-h-[260px] lg:px-4 lg:py-10">
              {/* Numeração gigante como marca d'água */}
              <p
                aria-hidden="true"
                className="pointer-events-none absolute right-1 top-5 font-display text-6xl font-medium italic leading-none tracking-tight text-primary/20 md:text-7xl"
              >
                {String(i + 1).padStart(2, '0')}
              </p>

              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary md:text-[11px]">
                Nota {String(i + 1).padStart(2, '0')}
              </p>

              <h3 className="mt-auto max-w-[12ch] pt-12 font-display text-[24px] font-medium leading-tight tracking-tight text-foreground md:text-[28px]">
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
