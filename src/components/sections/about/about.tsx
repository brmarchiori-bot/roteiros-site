import Image from 'next/image'
import Link from 'next/link'
import { Section } from '@/components/layout/section'
import { SectionHeader } from '@/components/layout/section-header'
import { PhotoPlaceholder } from '@/components/shared/photo-placeholder'
import { Reveal } from '@/components/shared/reveal'
import { about as aboutFallback } from '@/content'
import { cn } from '@/lib/utils'
import { toContainerSize, toImageStyle } from '@/lib/sanity-styles'
import { getAboutFromSanity } from '@/sanity/queries'

export async function AboutSection() {
  const about = (await getAboutFromSanity()) ?? aboutFallback
  const containerSize = toContainerSize(about.layout?.contentWidth)
  const imageOnRight = about.layout?.imagePosition === 'right'

  return (
    <Section id="about" spacing="xl" size={containerSize}>
      <SectionHeader meta={about.meta} className="mb-14 md:mb-20" />

      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        {/* Coluna da foto */}
        <div className={cn('md:col-span-5', imageOnRight && 'md:order-2')}>
          <div className="lg:sticky lg:top-28">
            <Reveal>
              {about.photo?.src ? (
                <figure className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-surface">
                  <Image
                    src={about.photo.src}
                    alt={about.photo.alt}
                    fill
                    sizes="(min-width: 768px) 40vw, 100vw"
                    style={toImageStyle(about.photo)}
                    priority={false}
                  />
                </figure>
              ) : (
                <PhotoPlaceholder caption={about.photo?.caption ?? ''} />
              )}
            </Reveal>
          </div>
        </div>

        {/* Coluna dos textos */}
        <div
          className={cn(
            'space-y-12 md:col-span-7 md:space-y-16',
            imageOnRight && 'md:order-1',
          )}
        >
          {about.chapters.map((chapter, i) => (
            <Reveal key={chapter.number} delay={i * 0.08}>
              <article>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  {chapter.number}
                </p>
                <h3 className="mt-3 font-display text-2xl font-medium leading-tight tracking-tight text-foreground md:text-[32px]">
                  {chapter.title}
                </h3>
                <p className="mt-5 text-base leading-relaxed text-foreground/80 md:text-lg md:leading-[1.7]">
                  {chapter.body}
                </p>
                {chapter.image?.src && (
                  <figure className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-md bg-surface">
                    <Image
                      src={chapter.image.src}
                      alt={chapter.image.alt}
                      fill
                      sizes="(min-width: 768px) 55vw, 100vw"
                      style={toImageStyle(chapter.image)}
                    />
                  </figure>
                )}
              </article>
            </Reveal>
          ))}

          {about.closingCta && (
            <Reveal delay={0.3}>
              <Link
                href={about.closingCta.href}
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary transition-colors hover:text-foreground"
              >
                {about.closingCta.label} <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  )
}
