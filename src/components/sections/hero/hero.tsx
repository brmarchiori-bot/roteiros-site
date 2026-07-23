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
import { getHeroFromSanity, getNowFromSanity } from '@/sanity/queries'
import type { HeroContent } from '@/types/content'
import { HeroDynamicText } from './hero-dynamic-text'

export async function HeroSection() {
  const [hero, journey] = await Promise.all([getHeroFromSanity(), getNowFromSanity()])
  const containerSize = toContainerSize(hero.layout?.contentWidth)

  // Versão rotativa ativa só quando HÁ titlePrefix + pelo menos 2 frases válidas (≥ 3 chars)
  const words = (hero.dynamicWords ?? [])
    .map((w) => w.trim())
    .filter((w) => w.length >= 3)
  const useRotator = Boolean(hero.titlePrefix?.trim()) && words.length >= 2
  const hasCover = Boolean(hero.coverImage?.src)
  const h1AriaLabel = useRotator
    ? `${hero.titlePrefix} ${words[0]}`
    : hero.headline

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[94svh] flex-col justify-end overflow-hidden border-b border-subtle pb-24 pt-28 md:min-h-svh md:pb-24 md:pt-36"
    >
      <HeroBackground coverImage={hero.coverImage} />

      {/* Rótulo fixo topo-esquerdo — sensação de capa de caderno */}
      <div className="pointer-events-none absolute left-0 right-0 top-12 z-10 sm:top-20 md:top-40">
        <Container size={containerSize}>
          <Reveal>
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={cn('h-px w-8 md:w-12', hasCover ? 'bg-white/60' : 'bg-foreground/30')}
              />
              <p className={cn(
                'font-mono text-[10px] uppercase tracking-[0.25em] md:text-[11px]',
                hasCover ? 'text-white/80' : 'text-foreground/55',
              )}>
                {hero.meta.kicker}
              </p>
            </div>
          </Reveal>
        </Container>
      </div>

      <Container size={containerSize} className="relative z-10">
        <div className="max-w-[92rem]">
          <h1
            aria-label={h1AriaLabel}
            className={cn(
              'max-w-[11ch] font-display text-[52px] font-medium leading-[0.88] tracking-[-0.04em] sm:text-[68px] md:text-[112px] lg:text-[136px]',
              hasCover ? 'text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.35)]' : 'text-foreground',
            )}
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

          <div className="mt-9 grid gap-8 md:mt-12 md:grid-cols-12 md:gap-12">
            <Reveal delay={0.18} className="md:col-span-4 md:col-start-1">
              <p className={cn(
                'text-base leading-relaxed md:text-lg md:leading-[1.65]',
                hasCover ? 'text-white/90' : 'text-foreground/75',
              )}>
                {hero.subheadline}
              </p>
            </Reveal>

            <Reveal delay={0.28} className="md:col-span-4 md:col-start-9 md:self-end">
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
                  className={cn(
                    'group inline-flex min-h-11 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors',
                    hasCover ? 'text-white/85 hover:text-white' : 'text-foreground/70 hover:text-foreground',
                  )}
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
            <JourneyMarker
              journey={journey}
              className={cn(
                'pointer-events-auto rounded-full px-3 py-1 backdrop-blur-sm',
                hasCover ? 'bg-black/35 text-white' : 'bg-background/40',
              )}
            />
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
              'radial-gradient(circle at 68% 46%, rgba(14,14,13,0.02) 0%, rgba(14,14,13,0.16) 28%, rgba(14,14,13,0.46) 72%), linear-gradient(90deg, rgba(14,14,13,0.72) 0%, rgba(14,14,13,0.28) 52%, rgba(14,14,13,0.14) 100%), linear-gradient(to top, rgba(14,14,13,0.72), transparent 55%)',
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
