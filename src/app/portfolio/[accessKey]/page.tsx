import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/container'
import { siteConfig } from '@/content/site.config'
import { toImageStyle } from '@/lib/sanity-styles'
import { getPrivatePortfolio } from '@/sanity/portfolio'
import type { PortfolioMedia } from '@/types/portfolio'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: `Portfólio privado · ${siteConfig.name}`,
  description: 'Apresentação privada de trabalhos selecionados.',
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

  const portfolio = await getPrivatePortfolio()

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

      {!portfolio ? (
        <Container size="narrow" className="py-28 text-center md:py-40">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
            Portfólio privado
          </p>
          <h1 className="mt-6 font-display text-4xl font-medium tracking-tight md:text-6xl">
            Conteúdo ainda não publicado.
          </h1>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-foreground/70">
            Esta apresentação existe, mas ainda não recebeu trabalhos publicados no painel.
          </p>
        </Container>
      ) : (
        <>
          <Container size="wide" className="py-20 md:py-28">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
              Trabalhos selecionados
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
                          {project.client && (
                            <p className="mt-3 text-sm text-foreground/60">{project.client}</p>
                          )}
                        </div>

                        <div className="space-y-8 md:col-span-8">
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
                </section>
              ))}
            </div>

            {portfolio.contactLabel && portfolio.contactUrl && (
              <div className="mt-28 border-t border-foreground/20 pt-12 text-center md:mt-40 md:pt-16">
                <a
                  href={portfolio.contactUrl}
                  target={portfolio.contactUrl.startsWith('http') ? '_blank' : undefined}
                  rel={
                    portfolio.contactUrl.startsWith('http')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  className="inline-flex rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-foreground"
                >
                  {portfolio.contactLabel}
                </a>
              </div>
            )}
          </Container>
        </>
      )}
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
