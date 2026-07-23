import Image from 'next/image'
import Link from 'next/link'
import { Section } from '@/components/layout/section'
import { Reveal } from '@/components/shared/reveal'
import { SocialIcon, type SocialPlatform } from '@/components/shared/social-icon'
import { toContainerSize, toImageStyle } from '@/lib/sanity-styles'
import { getContentHighlightsFromSanity } from '@/sanity/queries'
import type { ContentChannel } from '@/types/content'

const PLATFORM_LABEL: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
}

export async function ContentBridgeSection() {
  const contentHighlights = await getContentHighlightsFromSanity()
  const containerSize = toContainerSize(contentHighlights.layout?.contentWidth)

  return (
    <Section
      id="content"
      spacing="xl"
      size={containerSize}
      className="bg-secondary"
      containerClassName="relative bg-background py-12 shadow-[0_28px_80px_rgba(14,14,13,0.18)] md:px-20 md:py-20 lg:-rotate-[0.35deg]"
      bordered={false}
    >
      {/* Header editorial */}
      <header className="mb-10 border-b border-foreground/15 pb-10 md:mb-14 md:pb-14">
        <Reveal>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-primary md:w-12" />
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary md:text-[11px]">
              {contentHighlights.meta.kicker}
            </p>
          </div>
        </Reveal>

        {contentHighlights.meta.title && (
          <Reveal delay={0.08}>
            <h2 className="mt-6 max-w-4xl font-display text-4xl font-medium leading-[1.02] tracking-[-0.01em] text-foreground md:text-[60px]">
              {contentHighlights.meta.title}
            </h2>
          </Reveal>
        )}

        {contentHighlights.pullQuote && (
          <Reveal delay={0.18}>
            <p className="mt-7 max-w-3xl font-display text-xl italic leading-snug text-foreground/75 md:text-2xl md:leading-[1.4]">
              “{contentHighlights.pullQuote}”
            </p>
          </Reveal>
        )}
      </header>

      {/* Grade de cards com moldura editorial */}
      {contentHighlights.highlights.length > 0 && (
      <ul className="grid gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-3">
        {contentHighlights.highlights.slice(0, 3).map((highlight, i) => (
          <Reveal key={highlight.id} delay={i * 0.06}>
            <li>
              <Link
                href={highlight.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                {highlight.thumbnail ? (
                  <figure className="relative aspect-[3/4] w-full overflow-hidden bg-surface">
                    <Image
                      src={highlight.thumbnail}
                      alt={highlight.thumbnailAlt ?? highlight.title}
                      fill
                      sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                      className="transition-transform duration-700 group-hover:scale-[1.04]"
                      style={toImageStyle(highlight.thumbnailControls)}
                    />
                  </figure>
                ) : null}

                {/* Linha de metadados editorial: nº + ícone + rede */}
                <div className="mt-5 flex items-center justify-between border-t border-foreground/15 pt-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted md:text-[11px]">
                    Nº {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex items-center gap-2 text-muted">
                    <SocialIcon platform={highlight.platform} className="h-4 w-4" />
                    <span className="sr-only">{PLATFORM_LABEL[highlight.platform]}</span>
                  </span>
                </div>

                <p className="mt-3 font-display text-lg leading-snug text-foreground/85 transition-colors group-hover:text-primary md:text-xl">
                  {highlight.title}
                </p>
              </Link>
            </li>
          </Reveal>
        ))}
      </ul>
      )}

      {/* ChannelBlocks — dois blocos com frase de destaque em itálico */}
      <div className={contentHighlights.highlights.length > 0
        ? 'mt-16 grid gap-px overflow-hidden bg-foreground/15 md:mt-20 md:grid-cols-2'
        : 'grid gap-px overflow-hidden bg-foreground/15 md:grid-cols-2'}>
        <ChannelBlock
          platform="instagram"
          channel={contentHighlights.channels.instagram}
          delay={0}
        />
        <ChannelBlock
          platform="youtube"
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
  platform: SocialPlatform
  channel: ContentChannel
  delay: number
}) {
  return (
    <Reveal delay={delay}>
      <Link
        href={channel.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${PLATFORM_LABEL[platform]} — ${channel.cta}`}
        className="group relative flex h-full min-h-[220px] flex-col gap-6 bg-background p-8 transition-colors hover:bg-surface md:min-h-[260px] md:p-12"
      >
        {/* Cabeçalho: ícone + rótulo da rede */}
        <div className="flex items-center gap-3">
          <SocialIcon platform={platform} className="h-5 w-5 text-primary" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted md:text-[11px]">
            {PLATFORM_LABEL[platform]}
          </span>
        </div>

        {/* Frase em destaque — o coração do bloco */}
        {channel.note && (
          <p className="font-display text-[26px] italic leading-[1.2] tracking-tight text-foreground md:text-[34px]">
            “{channel.note}”
          </p>
        )}

        {/* CTA no rodapé do card */}
        <p className="mt-auto inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-primary transition-colors group-hover:text-foreground">
          {channel.cta}
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </p>
      </Link>
    </Reveal>
  )
}
