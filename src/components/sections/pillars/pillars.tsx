import { Section } from '@/components/layout/section'
import { Reveal } from '@/components/shared/reveal'
import { getPillarsFromSanity } from '@/sanity/queries'

export async function PillarsSection() {
  const pillars = await getPillarsFromSanity()
  const itemLayouts = [
    'lg:col-span-5 lg:col-start-1',
    'lg:col-span-4 lg:col-start-8 lg:mt-24',
    'lg:col-span-4 lg:col-start-2',
    'lg:col-span-5 lg:col-start-7 lg:-mt-10',
  ]
  const titleLayouts = [
    'md:text-5xl',
    'md:text-3xl md:italic',
    'md:text-4xl',
    'md:text-[42px]',
  ]
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

      <ul className="grid gap-x-8 gap-y-8 border-y border-foreground/20 py-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-y-16 lg:py-14">
        {pillars.items.map((pillar, i) => (
          <Reveal
            key={pillar.id}
            delay={i * 0.07}
            className={itemLayouts[i % itemLayouts.length]}
          >
            <li className="relative flex h-full flex-col border-t border-foreground/25 px-1 py-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary md:text-[11px]">
                Forma de olhar · {String(i + 1).padStart(2, '0')}
              </p>

              <h3 className={`max-w-[13ch] pt-10 font-display text-[28px] font-medium leading-[1.05] tracking-tight text-foreground ${titleLayouts[i % titleLayouts.length]}`}>
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
