import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { GrainOverlay } from '@/components/shared/grain-overlay'
import { Reveal } from '@/components/shared/reveal'
import { cn } from '@/lib/utils'
import { toContainerSize, toImageStyle } from '@/lib/sanity-styles'
import { getHeroFromSanity, getNowFromSanity } from '@/sanity/queries'
import type { HeroContent } from '@/types/content'
import { HeroDynamicText } from './hero-dynamic-text'

export async function HeroSection({
  content,
  journey: journeyContent,
}: {
  content?: HeroContent
  journey?: Awaited<ReturnType<typeof getNowFromSanity>>
} = {}) {
  const [hero, journey] = await Promise.all([
    content ?? getHeroFromSanity(),
    journeyContent ?? getNowFromSanity(),
  ])
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
  const kicker = hero.meta.kicker.replace(/\bhero\b/gi, 'em movimento')
  const subheadline =
    hero.subheadline ===
    'A gente largou 10 anos de bar pra viver viajando, trabalhando remoto e mostrando tudo como realmente é.'
      ? 'A gente largou a vida que tinha para viver uma história em movimento.'
      : hero.subheadline
  const journeyCredits = [
    'Em movimento',
    journey.city,
    /atualização pendente/i.test(journey.period) ? null : journey.period,
  ].filter((item): item is string => Boolean(item))

  return (
    <section
      id="hero"
      className="hero-master relative isolate flex min-h-[94svh] flex-col justify-end overflow-hidden"
    >
      <HeroBackground coverImage={hero.coverImage} />

      <Container size={containerSize} className="relative z-10">
        <div className="hero-master-copy">
          <p className="hero-master-kicker font-mono uppercase">
            {kicker}
          </p>
          <h1
            aria-label={h1AriaLabel}
            className={cn(
              'hero-master-title font-display font-medium',
              hasCover ? 'text-[#f4efe6]' : 'text-foreground',
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

          <div className="hero-master-support">
            <Reveal delay={0.18}>
              <p className={cn(
                'hero-master-subheadline font-display italic',
                hasCover ? 'text-[#eee7dc]/82' : 'text-foreground/75',
              )}>
                {subheadline}
              </p>
            </Reveal>

            <Reveal delay={0.28}>
              <div className="hero-master-action flex flex-wrap items-center">
                <Link
                  href={hero.ctas.primary.href}
                  className="hero-master-cta group inline-flex min-h-11 items-center font-mono uppercase text-primary-foreground transition-colors"
                >
                  {hero.ctas.primary.label}
                  <span aria-hidden="true" className="hero-master-cta-arrow transition-transform group-hover:translate-y-0.5">↓</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>

      <div className="hero-master-credits pointer-events-none absolute left-0 right-0 z-10">
        <Container
          size={containerSize}
          className="flex items-end justify-between gap-6"
        >
          <span aria-hidden="true" />
          <Reveal delay={0.55}>
            <span className="font-mono uppercase text-white/40">
              {journeyCredits.join(' · ')}
            </span>
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
          className="hero-master-photo object-cover"
          style={toImageStyle(coverImage)}
        />
        <div className="hero-master-grade absolute inset-0" />
        <div className="hero-master-lift absolute inset-0" />
        <GrainOverlay opacity={0.035} />
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
