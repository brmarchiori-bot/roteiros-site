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

  return (
    <Section
      id="now"
      spacing="lg"
      size={toContainerSize(now.layout?.contentWidth)}
      className="bg-secondary text-secondary-foreground"
      bordered={false}
    >
      <header className="mb-10 md:mb-14">
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
            <h2 className="mt-5 max-w-3xl font-display text-3xl font-medium leading-[1.05] tracking-tight text-white md:text-5xl">
              {now.meta.title}
            </h2>
          </Reveal>
        )}
      </header>

      <div className="grid gap-10 md:grid-cols-12 md:gap-14">
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
            <dl className="grid grid-cols-2 gap-y-4 border-t border-white/25 pt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 md:text-[11px]">
              <dt>Período</dt>
              <dd className="text-right text-white">{now.period}</dd>
              <dt>Local</dt>
              <dd className="text-right text-white">{locationLine || now.country}</dd>
            </dl>
          </Reveal>

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
            <p className="mt-5 font-display text-3xl font-medium leading-tight tracking-tight text-white md:text-4xl">
              {now.city}
            </p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg md:leading-[1.7]">
              {now.caption}
            </p>
          </Reveal>

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
