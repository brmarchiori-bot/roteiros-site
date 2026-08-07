import Image from 'next/image'
import Link from 'next/link'
import { Section } from '@/components/layout/section'
import { Reveal } from '@/components/shared/reveal'
import { cn } from '@/lib/utils'
import { toContainerSize, toImageStyle } from '@/lib/sanity-styles'
import { now as nowFallback } from '@/content'
import type { NowContent } from '@/types/content'

export function NowSection({ content }: { content?: NowContent } = {}) {
  const now = content ?? nowFallback
  const ctaHref = now.cta?.href ?? now.link
  const ctaLabel = now.cta?.label ?? 'Ver no Instagram'
  const hasPhoto = Boolean(now.photo?.src)
  const imageOnRight = now.layout?.imagePosition === 'right'
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
      spacing="sm"
      size={toContainerSize(now.layout?.contentWidth)}
      className={`now-master relative overflow-visible ${atmosphereClass}`}
      bordered={false}
    >
      <div className="relative grid gap-12 py-10 md:min-h-[500px] md:grid-cols-12 md:items-center md:gap-10 md:py-16">
        <div className={cn('md:col-span-4', imageOnRight && 'md:order-1')}>
          <Reveal>
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-primary">
              {now.meta.kicker}
            </p>
            {now.meta.title && (
              <h2 className={`mt-5 font-display text-4xl font-medium leading-[1.02] tracking-tight md:text-5xl ${inverse ? 'text-white' : 'text-foreground'}`}>
                {now.meta.title}
              </h2>
            )}
            <div className={`mt-8 border-y py-6 ${inverse ? 'border-white/15' : 'border-foreground/15'}`}>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">
                Local atual
              </p>
              <p className={`mt-3 font-display text-3xl ${inverse ? 'text-white' : 'text-foreground'}`}>
                {now.city}
              </p>
              <p className={`mt-4 max-w-sm text-sm leading-relaxed ${inverse ? 'text-white/70' : 'text-foreground/70'}`}>
                {now.caption}
              </p>
            </div>
            {ctaHref && (
              <Link
                href={ctaHref}
                target={ctaHref.startsWith('http') ? '_blank' : undefined}
                rel={ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="mt-6 inline-flex min-h-11 items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-primary"
              >
                {ctaLabel} <span aria-hidden="true">→</span>
              </Link>
            )}
          </Reveal>
        </div>

        <div className="md:col-span-5">
          <Reveal>
            <figure className="now-evidence-frame relative mx-auto w-[82%] max-w-[390px] bg-[#e8dfd0] p-5 pb-14">
              <span aria-hidden="true" className="now-evidence-tape" />
              {hasPhoto && now.photo?.src ? (
                <div className="relative aspect-square w-full overflow-hidden bg-black/20">
                  <Image
                    src={now.photo.src}
                    alt={now.photo.alt}
                    fill
                    sizes="390px"
                    style={toImageStyle(now.photo)}
                    className="documentary-image"
                  />
                </div>
              ) : (
                <div className="flex aspect-square w-full items-center justify-center bg-[#191b17] px-8 text-center">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">
                    Imagem do registro ainda não publicada
                  </p>
                </div>
              )}
              <figcaption className="absolute bottom-5 left-6 font-display text-sm italic text-foreground/70">
                {now.photo?.caption || 'em movimento'}
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <aside className="md:col-span-3">
          <Reveal delay={0.12}>
            <dl className="space-y-7 font-mono text-[9px] uppercase tracking-[0.2em]">
              <div>
                <dt className="text-white/40">Atualização</dt>
                <dd className="mt-2 text-white/80">{now.period || 'pendente'}</dd>
              </div>
              <div>
                <dt className="text-white/40">País</dt>
                <dd className="mt-2 text-white/80">{now.country}</dd>
              </div>
              {now.journeyState && (
                <div>
                  <dt className="text-primary">Estado</dt>
                  <dd className="mt-2 text-white/80">{now.journeyState}</dd>
                </div>
              )}
              {now.dayCount !== null && (
                <div>
                  <dt className="text-primary">Dia da jornada</dt>
                  <dd className="mt-2 text-white/80">{now.dayCount}</dd>
                </div>
              )}
            </dl>
          </Reveal>
        </aside>
      </div>
    </Section>
  )
}
