import Image from 'next/image'
import Link from 'next/link'
import { Section } from '@/components/layout/section'
import { PhotoPlaceholder } from '@/components/shared/photo-placeholder'
import { Reveal } from '@/components/shared/reveal'
import { cn } from '@/lib/utils'
import { toContainerSize, toImageStyle } from '@/lib/sanity-styles'
import { getAboutFromSanity } from '@/sanity/queries'

export async function AboutSection() {
  const about = await getAboutFromSanity()
  const containerSize = toContainerSize(about.layout?.contentWidth)
  const imageOnRight = about.layout?.imagePosition === 'right'

  return (
    <Section id="about" spacing="lg" size={containerSize}>
      {/* Header editorial: rótulo + título enorme + linha divisória */}
      <header className="mb-12 md:mb-16">
        <Reveal>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-primary md:w-12" />
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary md:text-[11px]">
              {about.meta.kicker}
            </p>
          </div>
        </Reveal>
        {about.meta.title && (
          <Reveal delay={0.08}>
            <h2 className="mt-6 max-w-4xl font-display text-4xl font-medium leading-[1.02] tracking-[-0.01em] text-foreground md:text-[60px]">
              {about.meta.title}
            </h2>
          </Reveal>
        )}
      </header>

      <div className="grid gap-10 md:grid-cols-12 md:gap-x-14">
        {/* Coluna da foto — sticky no desktop */}
        <div className={cn('md:col-span-5', imageOnRight && 'md:order-2')}>
          <div className="lg:sticky lg:top-28">
            <Reveal>
              {about.photo?.src ? (
                <figure className="relative aspect-[4/5] w-full overflow-hidden bg-surface">
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
              {about.photo?.caption && (
                <figcaption className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted md:text-[11px]">
                  {about.photo.caption}
                </figcaption>
              )}
            </Reveal>
          </div>
        </div>

        {/* Coluna dos capítulos */}
        <div
          className={cn(
            'md:col-span-7 md:col-start-6',
            imageOnRight && 'md:order-1 md:col-start-1',
          )}
        >
          <ul className="space-y-12 md:space-y-14">
            {about.chapters.map((chapter, i) => (
              <Reveal key={chapter.number} delay={i * 0.06}>
                <li className="relative">
                  {/* Numeração grande à esquerda, fora do fluxo */}
                  <div className="grid grid-cols-[auto_1fr] gap-x-6 md:gap-x-10">
                    <p className="font-display text-5xl font-medium leading-none tracking-tight text-primary/80 md:text-7xl">
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <div className="min-w-0 pt-2 md:pt-3">
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted md:text-[11px]">
                        {chapter.number}
                      </p>
                      <h3 className="mt-3 font-display text-[26px] font-medium leading-[1.15] tracking-tight text-foreground md:text-[34px]">
                        {chapter.title}
                      </h3>
                      <p className="mt-4 text-base leading-relaxed text-foreground/80 md:leading-[1.7]">
                        {chapter.body}
                      </p>
                    </div>
                  </div>

                  {chapter.image?.src && (
                    <figure className="relative mt-8 aspect-[16/10] w-full overflow-hidden bg-surface md:mt-12">
                      <Image
                        src={chapter.image.src}
                        alt={chapter.image.alt}
                        fill
                        sizes="(min-width: 768px) 55vw, 100vw"
                        style={toImageStyle(chapter.image)}
                      />
                    </figure>
                  )}
                </li>
              </Reveal>
            ))}
          </ul>

          {about.closingCta && (
            <Reveal delay={0.3}>
              <div className="mt-14 border-t border-foreground/15 pt-8">
                <Link
                  href={about.closingCta.href}
                  className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-primary transition-colors hover:text-foreground"
                >
                  {about.closingCta.label}
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
