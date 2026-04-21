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
      className="bg-foreground text-background"
    >
      <Container size="default">
        <div className="grid gap-14 md:grid-cols-12 md:gap-16">
          {/* Coluna esquerda — kicker + título + promessa */}
          <div className="md:col-span-7">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                {club.meta.kicker}
              </p>
            </Reveal>

            {club.meta.title && (
              <Reveal delay={0.08}>
                <h2 className="mt-6 font-display text-4xl font-medium leading-tight tracking-tight md:text-6xl">
                  {club.meta.title}
                </h2>
              </Reveal>
            )}

            <Reveal delay={0.18}>
              <p className="mt-10 max-w-xl text-lg leading-relaxed text-background/80 md:text-xl md:leading-[1.7]">
                {club.promise}
              </p>
            </Reveal>
          </div>

          {/* Coluna direita — formulário */}
          <div className="md:col-span-5">
            <div>
              <Reveal delay={0.25}>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-background/50">
                  Inscrição
                </p>
              </Reveal>

              <Reveal delay={0.32}>
                <div className="mt-6">
                  <NewsletterForm variant="stacked" theme="dark" />
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-background/50">
                  {club.rule}
                </p>
              </Reveal>

              {club.socialProof && (
                <Reveal delay={0.48}>
                  <p className="mt-8 border-t border-background/10 pt-6 text-sm text-background/65">
                    Já somos {club.socialProof.count} pessoas {club.socialProof.period}.
                  </p>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
