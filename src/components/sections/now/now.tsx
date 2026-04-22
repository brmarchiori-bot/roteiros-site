import Image from 'next/image'
import Link from 'next/link'
import { Section } from '@/components/layout/section'
import { PhotoPlaceholder } from '@/components/shared/photo-placeholder'
import { Reveal } from '@/components/shared/reveal'
import { cn } from '@/lib/utils'
import { toContainerSize, toImageStyle } from '@/lib/sanity-styles'
import { getNowFromSanity } from '@/sanity/queries'

export async function NowSection() {
  const now = await getNowFromSanity()
  const ctaHref = now.cta?.href ?? now.link
  const ctaLabel = now.cta?.label ?? 'Ver no Instagram'
  const containerSize = toContainerSize(now.layout?.contentWidth)
  const imageOnRight = now.layout?.imagePosition === 'right'

  const locationLine = [now.state, now.country].filter(Boolean).join(' · ')

  return (
    <Section id="now" spacing="xl" size={containerSize}>
      {/* Header simples — a mágica acontece nos blocos abaixo */}
      <header className="mb-14 md:mb-20">
        <Reveal>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-primary md:w-12" />
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary md:text-[11px]">
              {now.meta.kicker}
            </p>
          </div>
        </Reveal>
        {now.meta.title && (
          <Reveal delay={0.08}>
            <h2 className="mt-6 max-w-3xl font-display text-3xl font-medium leading-[1.05] tracking-tight text-foreground md:text-5xl">
              {now.meta.title}
            </h2>
          </Reveal>
        )}
      </header>

      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        {/* Coluna da foto */}
        <div className={cn('md:col-span-7', imageOnRight && 'md:order-2')}>
          <Reveal>
            {now.photo?.src ? (
              <figure className="relative aspect-[4/5] w-full overflow-hidden bg-surface md:aspect-[5/4]">
                <Image
                  src={now.photo.src}
                  alt={now.photo.alt}
                  fill
                  sizes="(min-width: 768px) 55vw, 100vw"
                  style={toImageStyle(now.photo)}
                />
              </figure>
            ) : (
              <PhotoPlaceholder
                aspect="aspect-[4/5] md:aspect-[5/4]"
                caption={now.photo?.caption ?? `${now.city} · ${now.period}`}
              />
            )}
          </Reveal>
        </div>

        {/* Coluna do diário */}
        <div className={cn('md:col-span-5', imageOnRight && 'md:order-1')}>
          {/* Bloco "ficha" — rótulos pequenos como coordenadas de livro de viagem */}
          <div className="border-t border-foreground/20 pt-6">
            <Reveal delay={0.08}>
              <dl className="grid grid-cols-2 gap-y-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted md:text-[11px]">
                <dt className="text-foreground/50">Período</dt>
                <dd className="text-right text-foreground/80">{now.period}</dd>
                <dt className="text-foreground/50">Local</dt>
                <dd className="text-right text-foreground/80">
                  {locationLine || now.country}
                </dd>
                {now.coordinates && (
                  <>
                    <dt className="text-foreground/50">Coordenadas</dt>
                    <dd className="text-right text-foreground/80">{now.coordinates}</dd>
                  </>
                )}
              </dl>
            </Reveal>
          </div>

          {/* Número ENORME do dia */}
          <Reveal delay={0.18}>
            <div className="mt-10 border-t border-foreground/20 pt-8 md:mt-14 md:pt-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary md:text-[11px]">
                Dia número
              </p>
              <p className="mt-2 font-display text-[96px] font-medium leading-[0.9] tracking-[-0.03em] text-foreground md:text-[140px] lg:text-[160px]">
                {now.dayCount}
              </p>
            </div>
          </Reveal>

          {/* Cidade em destaque */}
          <Reveal delay={0.26}>
            <p className="mt-6 font-display text-3xl font-medium leading-tight tracking-tight text-foreground md:text-4xl">
              {now.city}
            </p>
          </Reveal>

          {/* Diário */}
          <Reveal delay={0.32}>
            <p className="mt-8 text-base leading-relaxed text-foreground/80 md:text-lg md:leading-[1.75]">
              {now.caption}
            </p>
          </Reveal>

          {ctaHref && (
            <Reveal delay={0.4}>
              <div className="mt-10 border-t border-foreground/15 pt-6">
                <Link
                  href={ctaHref}
                  target={ctaHref.startsWith('http') ? '_blank' : undefined}
                  rel={ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-primary transition-colors hover:text-foreground"
                >
                  {ctaLabel}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  )
}
