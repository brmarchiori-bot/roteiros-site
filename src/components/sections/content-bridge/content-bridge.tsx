import Image from 'next/image'
import Link from 'next/link'
import { Section } from '@/components/layout/section'
import { SectionHeader } from '@/components/layout/section-header'
import { PhotoPlaceholder } from '@/components/shared/photo-placeholder'
import { Reveal } from '@/components/shared/reveal'
import { contentHighlights as contentFallback } from '@/content'
import { getContentHighlightsFromSanity } from '@/sanity/queries'
import type { ContentChannel, ContentHighlight } from '@/types/content'

const PLATFORM_LABEL: Record<ContentHighlight['platform'], string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
}

export async function ContentBridgeSection() {
  const contentHighlights = (await getContentHighlightsFromSanity()) ?? contentFallback

  return (
    <Section id="content" spacing="xl">
      <SectionHeader meta={contentHighlights.meta} className="mb-10 md:mb-14" />

      {contentHighlights.pullQuote && (
        <Reveal delay={0.1}>
          <p className="mb-16 max-w-3xl font-display text-2xl italic leading-snug text-foreground/85 md:mb-20 md:text-[28px] md:leading-[1.35]">
            “{contentHighlights.pullQuote}”
          </p>
        </Reveal>
      )}

      {/* Grid de destaques */}
      <ul className="grid gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-4">
        {contentHighlights.highlights.map((highlight, i) => (
          <Reveal key={highlight.id} delay={i * 0.06}>
            <li>
              <Link
                href={highlight.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                {highlight.thumbnail ? (
                  <figure className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-surface">
                    <Image
                      src={highlight.thumbnail}
                      alt={highlight.title}
                      fill
                      sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </figure>
                ) : (
                  <PhotoPlaceholder aspect="aspect-[3/4]" caption={highlight.title} />
                )}
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {PLATFORM_LABEL[highlight.platform]}
                </p>
                <p className="mt-2 text-base leading-snug text-foreground/85 transition-colors group-hover:text-primary md:text-lg">
                  {highlight.title}
                </p>
              </Link>
            </li>
          </Reveal>
        ))}
      </ul>

      {/* Blocos de canal — Instagram + YouTube */}
      <div className="mt-20 grid gap-px overflow-hidden rounded-md bg-foreground/10 md:mt-28 md:grid-cols-2">
        <ChannelBlock
          platform="Instagram"
          channel={contentHighlights.channels.instagram}
          delay={0}
        />
        <ChannelBlock
          platform="YouTube"
          channel={contentHighlights.channels.youtube}
          delay={0.08}
        />
      </div>
    </Section>
  )
}

function ChannelBlock({
  platform,
  channel,
  delay,
}: {
  platform: string
  channel: ContentChannel
  delay: number
}) {
  return (
    <Reveal delay={delay}>
      <Link
        href={channel.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-col gap-6 bg-background p-8 transition-colors hover:bg-surface md:p-12"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{platform}</p>
        {channel.note && (
          <p className="font-display text-xl italic leading-snug text-foreground md:text-2xl">
            “{channel.note}”
          </p>
        )}
        <p className="mt-auto inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary transition-colors group-hover:text-foreground">
          {channel.cta} <span aria-hidden="true">→</span>
        </p>
      </Link>
    </Reveal>
  )
}
