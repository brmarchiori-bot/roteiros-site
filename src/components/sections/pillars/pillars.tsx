import { Section } from '@/components/layout/section'
import { Reveal } from '@/components/shared/reveal'
import { pillars as pillarsFallback } from '@/content'
import type { PillarsContent } from '@/types/content'

export function PillarsSection({ content = pillarsFallback }: { content?: PillarsContent }) {
  return (
    <Section id="pillars" spacing="xl" className="bg-surface/70" bordered={false}>
      {/* Header editorial */}
      <header className="mb-10 md:mb-14">
        <Reveal>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-primary md:w-12" />
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary md:text-[11px]">
              {content.meta.kicker}
            </p>
          </div>
        </Reveal>

        {content.meta.title && (
          <Reveal delay={0.08}>
            <h2 className="mt-6 max-w-4xl font-display text-3xl font-medium leading-[1.05] tracking-[-0.01em] text-foreground md:text-5xl">
              {content.meta.title}
            </h2>
          </Reveal>
        )}
      </header>

      <ul className="grid gap-0 border-y border-white/20 py-4 sm:grid-cols-2 lg:grid-cols-4">
        {content.items.map((pillar, i) => (
          <Reveal
            key={pillar.id}
            delay={i * 0.07}
            className="h-full"
          >
            <li className="relative flex h-full min-h-[270px] flex-col border-b border-white/15 px-6 py-8 sm:border-r lg:border-b-0">
              <PillarMark index={i} />
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary md:text-[11px]">
                Forma de olhar · {String(i + 1).padStart(2, '0')}
              </p>

              <h3 className="mt-auto max-w-[13ch] pt-10 font-display text-[26px] font-medium leading-[1.05] tracking-tight text-foreground">
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

function PillarMark({ index }: { index: number }) {
  const paths = [
    'M12 36c8-18 28-26 44-14 14 11 11 34-4 43-17 10-41-2-40-29Zm22 30v16',
    'M13 25h52v42H13zM22 18h34l5 7M29 67l-5 15m31-15 5 15',
    'M20 13h40v66H20zM28 25h24M28 37h24M28 49h16m28-4c10 8 10 20 0 28',
    'M40 17c9 0 15 7 15 16 13-3 21 6 18 18 10 5 9 19-2 23H12C1 70 1 56 10 51 7 39 16 30 28 33c0-9 5-16 12-16Z',
  ]
  return (
    <svg aria-hidden="true" viewBox="0 0 88 88" className="h-12 w-12 text-background/65">
      <path d={paths[index % paths.length]} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
