import { Section } from '@/components/layout/section'
import { Reveal } from '@/components/shared/reveal'
import { manifesto } from '@/content'

export function ManifestoSection() {
  return (
    <Section id="manifesto" size="narrow" spacing="xl">
      <Reveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
          {manifesto.meta.kicker}
        </p>
      </Reveal>

      {manifesto.meta.title && (
        <Reveal delay={0.08}>
          <h2 className="mt-6 font-display text-4xl font-medium leading-tight tracking-tight text-foreground md:text-6xl">
            {manifesto.meta.title}
          </h2>
        </Reveal>
      )}

      <div className="mt-12 space-y-7 md:mt-14 md:space-y-8">
        {manifesto.paragraphs.map((paragraph, i) => {
          const isLead = i === 0
          return (
            <Reveal key={i} delay={0.18 + i * 0.05}>
              {isLead ? (
                <p className="font-display text-2xl leading-snug text-foreground md:text-[32px] md:leading-[1.25]">
                  {paragraph}
                </p>
              ) : (
                <p className="text-lg leading-relaxed text-foreground/85 md:text-xl md:leading-[1.7]">
                  {paragraph}
                </p>
              )}
            </Reveal>
          )
        })}
      </div>

      <Reveal delay={0.55}>
        <p className="mt-14 font-display text-xl italic text-muted md:text-2xl">
          — {manifesto.signature}
        </p>
      </Reveal>
    </Section>
  )
}
