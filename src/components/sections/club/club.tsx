import { Container } from '@/components/layout/container'
import { NewsletterForm } from '@/components/layout/newsletter-form'
import { Section } from '@/components/layout/section'
import { Reveal } from '@/components/shared/reveal'
import { club } from '@/content'

export function ClubSection() {
  return (
    <Section
      id="club"
      spacing="xl"
      bordered={false}
      bare
      className="relative isolate overflow-hidden bg-foreground text-background"
    >
      {/* Gradiente sutil — traz textura ao fundo preto */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(1200px 700px at 85% 20%, rgba(196,81,42,0.18), transparent 60%), radial-gradient(900px 600px at 10% 100%, rgba(61,74,43,0.15), transparent 55%)',
        }}
      />

      <Container size="default">
        {/* Cabeçalho editorial — rótulo + título enorme */}
        <div className="max-w-4xl">
          <Reveal>
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-primary md:w-12" />
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary md:text-[11px]">
                {club.meta.kicker}
              </p>
            </div>
          </Reveal>

          {club.meta.title && (
            <Reveal delay={0.08}>
              <h2 className="mt-8 font-display text-4xl font-medium leading-[1.02] tracking-[-0.01em] md:text-[64px] lg:text-[80px]">
                {club.meta.title}
              </h2>
            </Reveal>
          )}

          <Reveal delay={0.16}>
            <p className="mt-10 max-w-2xl text-lg leading-relaxed text-background/75 md:text-xl md:leading-[1.65]">
              {club.promise}
            </p>
          </Reveal>
        </div>

        {/* Bloco formulário — "ficha de inscrição" */}
        <div className="mt-16 grid gap-10 border-t border-background/15 pt-10 md:mt-24 md:grid-cols-12 md:gap-16 md:pt-14">
          <div className="md:col-span-4">
            <Reveal>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-background/50 md:text-[11px]">
                Ficha de inscrição
              </p>
              <p className="mt-4 font-display text-2xl leading-snug tracking-tight md:text-[28px]">
                {club.name}
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-background/50 md:text-[11px]">
                Envio semanal · Domingo
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-8">
            <Reveal delay={0.1}>
              <NewsletterForm variant="stacked" theme="dark" />
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-background/50 md:text-[11px]">
                {club.rule}
              </p>
            </Reveal>

            {club.socialProof && (
              <Reveal delay={0.28}>
                <p className="mt-8 border-t border-background/10 pt-6 text-sm text-background/65">
                  Já somos {club.socialProof.count} pessoas {club.socialProof.period}.
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}
