import Image from 'next/image'
import Link from 'next/link'
import { Section } from '@/components/layout/section'
import { SectionHeader } from '@/components/layout/section-header'
import { PhotoPlaceholder } from '@/components/shared/photo-placeholder'
import { Reveal } from '@/components/shared/reveal'
import { about as aboutFallback } from '@/content'
import { getAboutFromSanity } from '@/sanity/queries'

export async function AboutSection() {
  const about = (await getAboutFromSanity()) ?? aboutFallback

  return (
    <Section id="about" spacing="xl">
      <SectionHeader meta={about.meta} className="mb-14 md:mb-20" />

      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        {/* Coluna esquerda — foto sticky no scroll */}
        <div className="md:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              {about.photo?.src ? (
                <figure className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-surface">
                  <Image
                    src={about.photo.src}
                    alt={about.photo.alt}
                    fill
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: about.photo.objectPosition ?? 'center' }}
                    priority={false}
                  />
                </figure>
              ) : (
                <PhotoPlaceholder caption={about.photo?.caption ?? ''} />
              )}
            </Reveal>
          </div>
        </div>

        {/* Coluna direita — 3 capítulos + CTA */}
        <div className="space-y-12 md:col-span-7 md:space-y-16">
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
