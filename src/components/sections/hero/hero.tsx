import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { GrainOverlay } from '@/components/shared/grain-overlay'
import { JourneyMarker } from '@/components/shared/journey-marker'
import { Reveal } from '@/components/shared/reveal'
import { buttonStyles } from '@/components/ui/button'
import { hero } from '@/content'

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[88svh] flex-col justify-end overflow-hidden border-b border-subtle pb-24 pt-28 md:min-h-[100svh] md:pb-28 md:pt-40"
    >
      <HeroBackground />

      <Container size="default" className="relative z-10">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/50">
            {hero.meta.kicker}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-8 max-w-5xl font-display text-[44px] font-medium leading-[1.04] tracking-tight text-foreground md:text-[80px] lg:text-[96px]">
            {hero.headline}
          </h1>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-foreground/70 md:text-lg md:leading-relaxed">
            {hero.subheadline}
          </p>
        </Reveal>

        <Reveal delay={0.28}>
          <div className="mt-12 flex flex-wrap items-center gap-3 md:gap-4">
            <Link
              href={hero.ctas.primary.href}
              className={buttonStyles({ variant: 'primary', size: 'lg' })}
            >
              {hero.ctas.primary.label}
            </Link>
            <Link
              href={hero.ctas.secondary.href}
              className={buttonStyles({ variant: 'ghost', size: 'lg' })}
            >
              {hero.ctas.secondary.label} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
      </Container>

      <div className="absolute bottom-5 right-6 z-10 md:bottom-8 md:right-10">
        <Reveal delay={0.5}>
          <JourneyMarker className="rounded-full bg-background/40 px-3 py-1 backdrop-blur-sm" />
        </Reveal>
      </div>
    </section>
  )
}

/**
 * Fundo do hero. Sem vídeo enquanto não chega arquivo.
 * Quando hero.media.videoSrc apontar pra arquivo real,
 * substituir esta função por um <video autoPlay muted loop playsInline />.
 */
function HeroBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(1200px 800px at 70% 20%, rgba(196,81,42,0.10), transparent 60%), radial-gradient(900px 700px at 15% 85%, rgba(61,74,43,0.08), transparent 55%)',
        }}
      />
      <GrainOverlay opacity={0.04} />
    </div>
  )
}
