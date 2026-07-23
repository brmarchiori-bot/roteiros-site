import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/container'
import { portfolioPreview } from '@/content/preview-content'
import { siteConfig } from '@/content/site.config'
import { toImageStyle } from '@/lib/sanity-styles'
import { getPrivatePortfolio } from '@/sanity/portfolio'
import type { PortfolioMedia } from '@/types/portfolio'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: `Portfólio privado · ${siteConfig.name}`,
  description: 'Apresentação privada de trabalhos selecionados.',
  alternates: { canonical: null },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  referrer: 'no-referrer',
}

type PrivatePortfolioPageProps = {
  params: Promise<{ accessKey: string }>
}

export default async function PrivatePortfolioPage({
  params,
}: PrivatePortfolioPageProps) {
  const { accessKey } = await params
  const configuredKey = process.env.PRIVATE_PORTFOLIO_SLUG

  if (!configuredKey || configuredKey.length < 24 || accessKey !== configuredKey) {
    notFound()
  }

  const publishedPortfolio = await getPrivatePortfolio()
  const portfolio = publishedPortfolio ?? portfolioPreview
  const isPreview = !publishedPortfolio
  const contactLabel = portfolio?.contactLabel || 'Conversar sobre um projeto'
  const contactUrl =
    portfolio?.contactUrl ||
    `mailto:${siteConfig.contact.partnerships}?subject=${encodeURIComponent(
      'Contato pelo portfólio privado',
    )}`

  return (
    <main className="min-h-screen bg-background pb-24 text-foreground md:pb-32">
      <header className="border-b border-subtle py-8">
        <Container size="wide" className="flex items-center justify-between gap-6">
          <p className="font-display text-xl font-medium tracking-tight md:text-2xl">
            {siteConfig.name}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            Apresentação privada
          </p>
        </Container>
      </header>

      <>
          {isPreview && (
            <div className="border-b border-primary/25 bg-primary px-6 py-3 text-center text-primary-foreground">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] md:text-[10px]">
                Preview Editorial · demonstração fictícia · nenhum cliente ou resultado real
              </p>
            </div>
          )}
          <Container size="wide" className="py-20 md:py-28">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
              {isPreview ? 'Preview Editorial' : 'Trabalhos selecionados'}
            </p>
            <h1 className="mt-6 max-w-5xl font-display text-5xl font-medium leading-[0.98] tracking-tight md:text-8xl">
              {portfolio.title}
            </h1>
            {portfolio.introduction && (
              <p className="mt-10 max-w-3xl text-lg leading-relaxed text-foreground/75 md:text-xl">
                {portfolio.introduction}
              </p>
            )}
          </Container>

          <Container size="wide">
            {portfolio.categories.length === 0 ? (
              <div className="border-y border-foreground/15 py-16 text-center md:py-24">
                <p className="font-display text-3xl font-medium tracking-tight md:text-5xl">
                  Seleção em preparação.
                </p>
                <p className="mx-auto mt-5 max-w-xl leading-relaxed text-foreground/65">
                  Os trabalhos estão sendo organizados antes da publicação nesta apresentação.
                </p>
              </div>
            ) : (
              <div className="space-y-28 md:space-y-40">
                {portfolio.categories.map((category, categoryIndex) => (
                <section key={category.id} aria-labelledby={`category-${category.id}`}>
                  <div className="border-t border-foreground/20 pt-8 md:grid md:grid-cols-12 md:gap-12">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary md:col-span-2">
                      {String(categoryIndex + 1).padStart(2, '0')}
                    </p>
                    <div className="mt-5 md:col-span-8 md:mt-0">
                      <h2
                        id={`category-${category.id}`}
                        className="font-display text-4xl font-medium tracking-tight md:text-6xl"
                      >
                        {category.title}
                      </h2>
                      {category.description && (
                        <p className="mt-5 max-w-2xl leading-relaxed text-foreground/70">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {category.projects.length === 0 ? (
                    <p className="mt-12 border-t border-subtle pt-8 text-sm leading-relaxed text-muted">
                      Os trabalhos desta categoria ainda não foram publicados.
                    </p>
                  ) : (
                    <div className="mt-14 space-y-16 md:mt-20 md:space-y-24">
                      {category.projects.map((project, projectIndex) => (
                      <article
                        key={project.id}
                        className="grid gap-10 border-t border-subtle pt-10 md:grid-cols-12 md:gap-12"
                      >
                        <div className="md:col-span-4">
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                            Trabalho {String(projectIndex + 1).padStart(2, '0')}
                          </p>
                          <h3 className="mt-4 font-display text-3xl font-medium tracking-tight md:text-4xl">
                            {project.title}
                          </h3>
                          {project.featured && (
                            <p className="mt-4 inline-flex rounded-full border border-primary/30 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-primary">
                              Destaque
                            </p>
                          )}
                          {project.client && (
                            <p className="mt-3 text-sm text-foreground/60">{project.client}</p>
                          )}
                          {(project.city || project.date || project.format) && (
                            <dl className="mt-7 space-y-3 border-t border-foreground/10 pt-5 text-sm">
                              {project.city && (
                                <MetaRow label="Local" value={project.city} />
                              )}
                              {project.date && (
                                <MetaRow
                                  label="Data"
                                  value={formatPortfolioDate(project.date)}
                                />
                              )}
                              {project.format && (
                                <MetaRow label="Formato" value={project.format} />
                              )}
                            </dl>
                          )}
                        </div>

                        <div className="space-y-8 md:col-span-8">
                          {project.cover && (
                            <figure>
                              <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                                <Image
                                  src={project.cover.src}
                                  alt={project.cover.alt}
                                  fill
                                  sizes="(min-width: 768px) 65vw, 100vw"
                                  style={toImageStyle(project.cover)}
                                />
                              </div>
                              {project.cover.caption && (
                                <figcaption className="mt-3 text-sm text-muted">
                                  {project.cover.caption}
                                </figcaption>
                              )}
                            </figure>
                          )}
                          <div className="grid gap-7 md:grid-cols-2">
                            {project.objective && (
                              <ProjectText label="Objetivo" text={project.objective} />
                            )}
                            {project.result && (
                              <ProjectText label="Resultado" text={project.result} />
                            )}
                          </div>
                          {project.description && (
                            <p className="max-w-3xl text-base leading-relaxed text-foreground/75 md:text-lg">
                              {project.description}
                            </p>
                          )}

                          {project.services.length > 0 && (
                            <div>
                              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                                Serviços executados
                              </p>
                              <ul className="mt-4 flex flex-wrap gap-2">
                                {project.services.map((service) => (
                                  <li
                                    key={service}
                                    className="rounded-full border border-foreground/15 px-3 py-1.5 text-xs text-foreground/70"
                                  >
                                    {service}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {project.testimonial && (
                            <blockquote className="border-l-2 border-primary pl-6">
                              <p className="font-display text-xl italic leading-relaxed text-foreground/80 md:text-2xl">
                                “{project.testimonial.quote}”
                              </p>
                              {(project.testimonial.author || project.testimonial.role) && (
                                <footer className="mt-4 text-sm text-muted">
                                  {[project.testimonial.author, project.testimonial.role]
                                    .filter(Boolean)
                                    .join(' · ')}
                                </footer>
                              )}
                            </blockquote>
                          )}

                          {project.media.length > 0 && (
                            <div className="grid gap-5 sm:grid-cols-2">
                              {project.media.map((media) => (
                                <PortfolioMediaCard key={media.id} media={media} />
                              ))}
                            </div>
                          )}

                          {project.links.length > 0 && (
                            <ul className="flex flex-wrap gap-x-6 gap-y-3">
                              {project.links.map((link) => (
                                <li key={`${link.label}-${link.url}`}>
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-foreground"
                                  >
                                    {link.label} ↗
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </article>
                      ))}
                    </div>
                  )}
                </section>
                ))}
              </div>
            )}

            <div className="mt-28 border-t border-foreground/20 pt-12 text-center md:mt-40 md:pt-16">
              <p className="mx-auto mb-7 max-w-xl leading-relaxed text-foreground/65">
                Se algum trabalho daqui conversa com o que você está construindo, a próxima
                conversa pode começar sem formulário e sem roteiro pronto.
              </p>
                <a
                  href={contactUrl}
                  target={contactUrl.startsWith('http') ? '_blank' : undefined}
                  rel={
                    contactUrl.startsWith('http')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  className="inline-flex rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-foreground"
                >
                  {contactLabel}
                </a>
            </div>
          </Container>
      </>
    </main>
  )
}

function ProjectText({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
        {label}
      </p>
      <p className="mt-3 leading-relaxed text-foreground/75">{text}</p>
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
        {label}
      </dt>
      <dd className="text-right text-foreground/70">{value}</dd>
    </div>
  )
}

function PortfolioMediaCard({ media }: { media: PortfolioMedia }) {
  if (media.kind === 'image' && media.image) {
    return (
      <figure>
        <div className="relative aspect-[4/3] overflow-hidden bg-surface">
          <Image
            src={media.image.src}
            alt={media.image.alt}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            style={toImageStyle(media.image)}
          />
        </div>
        {(media.title || media.image.caption) && (
          <figcaption className="mt-3 text-sm leading-relaxed text-muted">
            {media.title || media.image.caption}
          </figcaption>
        )}
      </figure>
    )
  }

  if (!media.url) return null

  const youtubeEmbed = media.kind === 'youtube' ? getYouTubeEmbedUrl(media.url) : null
  if (youtubeEmbed) {
    return (
      <figure>
        <div className="relative aspect-video overflow-hidden bg-foreground">
          <iframe
            src={youtubeEmbed}
            title={media.title || 'Vídeo do portfólio'}
            loading="lazy"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full"
          />
        </div>
        {media.title && (
          <figcaption className="mt-3 text-sm text-muted">{media.title}</figcaption>
        )}
      </figure>
    )
  }

  if (
    media.kind === 'video' ||
    media.kind === 'verticalVideo' ||
    media.kind === 'horizontalVideo'
  ) {
    return (
      <figure className={media.kind === 'verticalVideo' ? 'sm:max-w-sm' : undefined}>
        <video
          controls
          playsInline
          preload="metadata"
          className={
            media.kind === 'verticalVideo'
              ? 'aspect-[9/16] w-full bg-foreground object-contain'
              : 'aspect-video w-full bg-foreground object-contain'
          }
        >
          <source src={media.url} />
          Seu navegador não conseguiu reproduzir este vídeo.
        </video>
        {media.title && (
          <figcaption className="mt-3 text-sm text-muted">{media.title}</figcaption>
        )}
      </figure>
    )
  }

  return (
    <a
      href={media.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-h-48 flex-col justify-between border border-foreground/15 bg-surface/40 p-6 transition-colors hover:border-primary"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
        {media.kind}
      </p>
      <div>
        <p className="font-display text-2xl font-medium tracking-tight">
          {media.title || 'Abrir conteúdo'}
        </p>
        <p className="mt-3 text-sm text-muted transition-colors group-hover:text-foreground">
          Assistir em nova aba ↗
        </p>
      </div>
    </a>
  )
}

function getYouTubeEmbedUrl(value: string) {
  try {
    const url = new URL(value)
    let id = ''

    if (url.hostname === 'youtu.be') {
      id = url.pathname.slice(1).split('/')[0] ?? ''
    } else if (url.hostname.endsWith('youtube.com')) {
      id =
        url.searchParams.get('v') ??
        (url.pathname.startsWith('/shorts/') || url.pathname.startsWith('/embed/')
          ? url.pathname.split('/')[2] ?? ''
          : '')
    }

    return /^[\w-]{6,20}$/.test(id)
      ? `https://www.youtube-nocookie.com/embed/${id}`
      : null
  } catch {
    return null
  }
}

function formatPortfolioDate(value: string) {
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('pt-BR', {
        month: 'long',
        year: 'numeric',
      }).format(date)
}
