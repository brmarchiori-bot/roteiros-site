import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Reveal } from '@/components/shared/reveal'
import { manifesto } from '@/content'

export function ManifestoSection() {
  return (
    <Section
      id="manifesto"
      spacing="xl"
      bordered={false}
      bare
      className="relative isolate overflow-hidden bg-foreground text-background"
    >
      {/* Gradiente sutil pra não ficar flat */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(1400px 800px at 20% 10%, rgba(196,81,42,0.14), transparent 55%), radial-gradient(1000px 700px at 90% 100%, rgba(61,74,43,0.12), transparent 55%)',
        }}
      />

      <Container size="narrow">
        <Reveal>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-primary md:w-12" />
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary md:text-[11px]">
              {manifesto.meta.kicker}
            </p>
          </div>
        </Reveal>

        {manifesto.meta.title && (
          <Reveal delay={0.08}>
            <h2 className="mt-10 font-display text-[40px] font-medium leading-[1.02] tracking-[-0.01em] md:text-[72px] lg:text-[84px]">
              {manifesto.meta.title}
            </h2>
          </Reveal>
        )}

        <div className="mt-14 space-y-7 md:mt-20 md:space-y-9">
          {manifesto.paragraphs.map((paragraph, i) => {
            const isLead = i === 0
            return (
              <Reveal key={i} delay={0.18 + i * 0.05}>
                {isLead ? (
                  <p className="font-display text-[26px] leading-snug tracking-tight md:text-[34px] md:leading-[1.25]">
                    {paragraph}
                  </p>
                ) : (
                  <p className="text-lg leading-relaxed text-background/80 md:text-xl md:leading-[1.75]">
                    {paragraph}
                  </p>
                )}
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={0.55}>
          <div className="mt-16 flex items-center gap-4 md:mt-20">
            <span aria-hidden="true" className="h-px flex-1 bg-background/20" />
            <p className="font-display text-xl italic text-background/75 md:text-2xl">
              {manifesto.signature}
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
