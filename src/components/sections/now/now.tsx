import Image from 'next/image'
import Link from 'next/link'
import { Section } from '@/components/layout/section'
import { Reveal } from '@/components/shared/reveal'
import { cn } from '@/lib/utils'
import { toContainerSize, toImageStyle } from '@/lib/sanity-styles'
import { getNowFromSanity } from '@/sanity/queries'

export async function NowSection() {
  const now = await getNowFromSanity()
  const ctaHref = now.cta?.href ?? now.link
  const ctaLabel = now.cta?.label ?? 'Ver no Instagram'
  const hasPhoto = Boolean(now.photo?.src)
  const imageOnRight = now.layout?.imagePosition === 'right'
  const locationLine = [now.state, now.country].filter(Boolean).join(' · ')
  const atmosphereClass =
    now.atmosphere === 'field'
      ? 'bg-secondary text-secondary-foreground'
      : now.atmosphere === 'paper'
        ? 'material-paper text-foreground'
        : 'bg-foreground text-background'
  const inverse = now.atmosphere !== 'paper'

  return (
    <Section
      id="now"
      spacing="lg"
      size={toContainerSize(now.layout?.contentWidth)}
      className={`relative overflow-hidden ${atmosphereClass} before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_80%_20%,rgba(196,81,42,0.13),transparent_32%),linear-gradient(115deg,rgba(255,255,255,0.025),transparent_45%)]`}
      bordered={false}
    >
      <header className="relative mb-14 md:mb-20 md:grid md:grid-cols-12">
        <Reveal>
          <div className="flex items-center gap-3 md:col-span-3">
            <span aria-hidden="true" className="h-px w-8 bg-primary md:w-12" />
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary md:text-[11px]">
              {now.meta.kicker}
            </p>
          </div>
        </Reveal>
        {now.meta.title && (
          <Reveal delay={0.08}>
            <h2 className={`mt-8 max-w-3xl font-display text-4xl font-medium leading-[0.98] tracking-tight md:col-span-8 md:col-start-5 md:mt-0 md:text-7xl ${inverse ? 'text-white' : 'text-foreground'}`}>
              {now.meta.title}
            </h2>
          </Reveal>
        )}
      </header>

      <div className="relative grid gap-10 md:grid-cols-12 md:gap-14">
        {hasPhoto && now.photo?.src && (
          <div className={cn('md:col-span-6', imageOnRight && 'md:order-2')}>
            <Reveal>
              <figure className="relative aspect-[4/3] w-full overflow-hidden bg-black/15">
                <Image
                  src={now.photo.src}
                  alt={now.photo.alt}
                  fill
                  sizes="(min-width: 768px) 48vw, 100vw"
                  style={toImageStyle(now.photo)}
                  className="documentary-image"
                />
              </figure>
            </Reveal>
          </div>
        )}

        <div
          className={cn(
            hasPhoto ? 'md:col-span-6' : 'md:col-span-9',
            imageOnRight && 'md:order-1',
          )}
        >
          <Reveal>
            <dl className={`grid grid-cols-[auto_1fr] gap-x-8 gap-y-4 border-t pt-5 font-mono text-[10px] uppercase tracking-[0.2em] md:text-[11px] ${inverse ? 'border-white/25 text-white/55' : 'border-foreground/20 text-muted'}`}>
              <dt>Registro</dt>
              <dd className={`text-right ${inverse ? 'text-white' : 'text-foreground'}`}>{now.period}</dd>
              <dt>Presente</dt>
              <dd className={`text-right ${inverse ? 'text-white' : 'text-foreground'}`}>{locationLine || now.country}</dd>
            </dl>
          </Reveal>
          {now.journeyState && (
            <p className={`mt-6 font-mono text-[10px] uppercase tracking-[0.2em] ${inverse ? 'text-white/60' : 'text-muted'}`}>
              {now.journeyState}
            </p>
          )}

          {now.dayCount !== null && <Reveal delay={0.12}>
            <div className="mt-8 border-t border-white/25 pt-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary md:text-[11px]">
                Dia da jornada
              </p>
              <p className="mt-2 font-display text-[76px] font-medium leading-[0.9] tracking-[-0.03em] text-white md:text-[112px]">
                {now.dayCount}
              </p>
            </div>
          </Reveal>}

          <Reveal delay={0.18}>
            <p className={`mt-10 font-display text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl ${inverse ? 'text-white' : 'text-foreground'}`}>
              {now.city}
            </p>
            <p className={`mt-6 max-w-2xl text-base leading-relaxed md:text-lg md:leading-[1.7] ${inverse ? 'text-white/80' : 'text-foreground/75'}`}>
              {now.caption}
            </p>
          </Reveal>

          {now.secondaryPhoto?.src && (
            <Reveal delay={0.22}>
              <figure className="mt-10 ml-auto w-3/4 md:w-2/3">
                <div className="relative aspect-[4/3] overflow-hidden bg-black/20">
                  <Image
                    src={now.secondaryPhoto.src}
                    alt={now.secondaryPhoto.alt}
                    fill
                    sizes="(min-width: 768px) 28vw, 75vw"
                    style={toImageStyle(now.secondaryPhoto)}
                    className="documentary-image"
                  />
                </div>
                {now.secondaryPhoto.caption && (
                  <figcaption className={`mt-3 text-xs leading-relaxed ${inverse ? 'text-white/55' : 'text-muted'}`}>
                    {now.secondaryPhoto.caption}
                  </figcaption>
                )}
              </figure>
            </Reveal>
          )}

          {ctaHref && (
            <Reveal delay={0.24}>
              <div className="mt-8 border-t border-white/20 pt-5">
                <Link
                  href={ctaHref}
                  target={ctaHref.startsWith('http') ? '_blank' : undefined}
                  rel={ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group inline-flex min-h-11 items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary transition-colors hover:text-white"
                >
                  {ctaLabel}
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
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
