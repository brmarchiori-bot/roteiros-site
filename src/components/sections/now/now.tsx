import Image from 'next/image'
import Link from 'next/link'
import { Section } from '@/components/layout/section'
import { SectionHeader } from '@/components/layout/section-header'
import { PhotoPlaceholder } from '@/components/shared/photo-placeholder'
import { Reveal } from '@/components/shared/reveal'
import { now as nowFallback } from '@/content'
import { cn } from '@/lib/utils'
import { toContainerSize, toImageStyle } from '@/lib/sanity-styles'
import { getNowFromSanity } from '@/sanity/queries'

export async function NowSection() {
  const now = (await getNowFromSanity()) ?? nowFallback
  const ctaHref = now.cta?.href ?? now.link
  const ctaLabel = now.cta?.label ?? 'Ver no Instagram'
  const containerSize = toContainerSize(now.layout?.contentWidth)
  const imageOnRight = now.layout?.imagePosition === 'right'

  return (
    <Section id="now" spacing="xl" size={containerSize}>
      <SectionHeader meta={now.meta} className="mb-14 md:mb-20" />

      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        {/* Coluna da foto */}
        <div className={cn('md:col-span-7', imageOnRight && 'md:order-2')}>
          <Reveal>
            {now.photo?.src ? (
              <figure className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-surface md:aspect-[5/4]">
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
          <Reveal delay={0.1}>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
              Agora
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-4 font-display text-6xl font-medium leading-none tracking-tight text-foreground md:text-7xl lg:text-8xl">
              Dia {now.dayCount}
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="mt-8 space-y-1">
              <p className="font-display text-3xl font-medium leading-tight tracking-tight text-foreground md:text-4xl">
                {now.city}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                {[now.state, now.country].filter(Boolean).join(' · ')} · {now.period}
              </p>
              {now.coordinates && (
                <p className="pt-1 font-mono text-[11px] tracking-wide text-muted/70">
                  {now.coordinates}
                </p>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="mt-8 text-base leading-relaxed text-foreground/80 md:text-lg md:leading-[1.7]">
              {now.caption}
            </p>
          </Reveal>

          {ctaHref && (
            <Reveal delay={0.4}>
              <div className="mt-10 border-t border-subtle pt-6">
                <Link
                  href={ctaHref}
                  target={ctaHref.startsWith('http') ? '_blank' : undefined}
                  rel={ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary transition-colors hover:text-foreground"
                >
                  {ctaLabel} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  )
}
