import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { GrainOverlay } from '@/components/shared/grain-overlay'
import { JourneyMarker } from '@/components/shared/journey-marker'
import { Reveal } from '@/components/shared/reveal'
import { buttonStyles } from '@/components/ui/button'
import { siteConfig } from '@/content/site.config'
import { cn } from '@/lib/utils'
import { toContainerSize, toImageStyle } from '@/lib/sanity-styles'
import { getHeroFromSanity } from '@/sanity/queries'
import type { HeroContent } from '@/types/content'
import { HeroDynamicText } from './hero-dynamic-text'

export async function HeroSection() {
  const hero = await getHeroFromSanity()
  const containerSize = toContainerSize(hero.layout?.contentWidth)

  // Versão rotativa ativa só quando HÁ titlePrefix + pelo menos 2 palavras
  const words = (hero.dynamicWords ?? []).filter((w) => w.trim().length > 0)
  const useRotator = Boolean(hero.titlePrefix?.trim()) && words.length >= 2
  const h1AriaLabel = useRotator
    ? `${hero.titlePrefix} ${words[0]}`
    : hero.headline

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden border-b border-subtle pb-20 pt-28 md:pb-24 md:pt-40"
    >
      <HeroBackground coverImage={hero.coverImage} />

      {/* Rótulo fixo topo-esquerdo — sensação de capa de caderno */}
      <div className="pointer-events-none absolute left-0 right-0 top-28 z-10 md:top-40">
        <Container size={containerSize}>
          <Reveal>
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-8 bg-foreground/30 md:w-12"
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55 md:text-[11px]">
                {hero.meta.kicker}
              </p>
            </div>
          </Reveal>
        </Container>
      </div>

      <Container size={containerSize} className="relative z-10">
        <div className="max-w-6xl">
          <Reveal delay={0.08}>
            <h1
              aria-label={h1AriaLabel}
              className="font-display text-[48px] font-medium leading-[0.98] tracking-[-0.02em] text-foreground md:text-[96px] lg:text-[112px]"
            >
              {useRotator ? (
                <span aria-hidden="true">
                  {hero.titlePrefix}{' '}
                  {/* Mobile: quebra em bloco pra frase não ficar órfã do prefix */}
                  <span className="block md:inline-block md:align-baseline">
                    <HeroDynamicText
                      words={words}
                      className="text-primary"
                    />
                  </span>
                </span>
              ) : (
                hero.headline
              )}
            </h1>
          </Reveal>

          <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:gap-12">
            <Reveal delay={0.18} className="md:col-span-6 md:col-start-1">
              <p className="text-base leading-relaxed text-foreground/75 md:text-lg md:leading-[1.65]">
                {hero.subheadline}
              </p>
            </Reveal>

            <Reveal delay={0.28} className="md:col-span-5 md:col-start-8 md:self-end">
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={hero.ctas.primary.href}
                  className={cn(
                    buttonStyles({ variant: 'primary', size: 'lg' }),
                    'shimmer-button glow-primary',
                  )}
                >
                  {hero.ctas.primary.label}
                </Link>
                <Link
                  href={hero.ctas.secondary.href}
                  className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/70 transition-colors hover:text-foreground"
                >
                  {hero.ctas.secondary.label}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>

      {/* Ribbon inferior — JourneyMarker + assinatura */}
      <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-10 md:bottom-10">
        <Container
          size={containerSize}
          className="flex items-end justify-between gap-6"
        >
          <Reveal delay={0.45}>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45 md:text-[11px]">
              {siteConfig.shortTagline}
            </p>
          </Reveal>
          <Reveal delay={0.55}>
            <JourneyMarker className="pointer-events-auto rounded-full bg-background/40 px-3 py-1 backdrop-blur-sm" />
          </Reveal>
        </Container>
      </div>
    </section>
  )
}

function HeroBackground({ coverImage }: { coverImage?: HeroContent['coverImage'] }) {
  if (coverImage?.src) {
    return (
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image
          src={coverImage.src}
          alt={coverImage.alt ?? ''}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={toImageStyle(coverImage)}
        />
        {/* Gradiente cinema: escurece bordas, preserva o meio-baixo */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(14,14,13,0.25) 0%, rgba(14,14,13,0.1) 40%, rgba(243,238,229,0.55) 100%)',
          }}
        />
        <GrainOverlay opacity={0.08} />
      </div>
    )
  }

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(1400px 900px at 75% 15%, rgba(196,81,42,0.14), transparent 55%), radial-gradient(1000px 800px at 10% 90%, rgba(61,74,43,0.12), transparent 55%), linear-gradient(to bottom, rgba(14,14,13,0.03), transparent 30%)',
        }}
      />
      <GrainOverlay opacity={0.05} />
    </div>
  )
}
