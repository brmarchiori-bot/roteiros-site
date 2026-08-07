'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { featuredPortfolioProject, filterPortfolioProjects, visiblePortfolioProjects, youtubePrivacyUrl, type PortfolioMediaFilter } from '@/lib/portfolio'
import { PORTFOLIO_CATEGORY_LABELS, type PortfolioCategory, type PortfolioModule, type PortfolioProject, type PrivatePortfolio } from '@/types/portfolio'
import { toImageStyle } from '@/lib/sanity-styles'

const TYPE_LABEL = { audiovisual: 'Audiovisual', photography: 'Fotografia', digital: 'Projeto digital', hybrid: 'Híbrido' }

export function PortfolioExperience({ portfolio }: { portfolio: PrivatePortfolio }) {
  const [category, setCategory] = useState<'all' | PortfolioCategory>('all')
  const [media, setMedia] = useState<PortfolioMediaFilter>('all')
  const [limit, setLimit] = useState(portfolio.initialProjectCount)
  const [selected, setSelected] = useState<string | null>(portfolio.projects.find((p) => p.featured)?.id ?? null)
  const projects = useMemo(() => visiblePortfolioProjects(portfolio.projects), [portfolio.projects])
  const filtered = useMemo(() => filterPortfolioProjects(projects, category, media), [projects, category, media])
  const visible = filtered.slice(0, limit)
  const featured = featuredPortfolioProject(projects, selected)

  return <main className="min-h-screen overflow-x-hidden bg-[#0b0c0a] text-[#eee8dc]">
    <section className="relative min-h-[82svh] border-b border-white/20">
      {portfolio.heroImage && <Image src={portfolio.heroImage.src} alt={portfolio.heroImage.alt} fill priority sizes="100vw" style={toImageStyle(portfolio.heroImage)} className="object-cover opacity-60" />}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-black/20" />
      <div className="relative z-10 flex min-h-[82svh] flex-col justify-between px-6 py-7 md:px-12 md:py-10">
        <header className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[.22em]"><span>Menos<br/>Roteiro</span><span>▱ {portfolio.privacyLabel}</span></header>
        <div className="max-w-2xl pb-12 md:pb-16"><p className="font-mono text-[10px] uppercase tracking-[.24em] text-[#d7a24a]">{portfolio.kicker}</p><h1 className="mt-5 font-display text-5xl uppercase leading-[.88] tracking-[-.04em] sm:text-7xl md:text-8xl">{portfolio.title}</h1>{portfolio.introduction && <p className="mt-7 max-w-lg text-base leading-relaxed text-white/75">{portfolio.introduction}</p>}{portfolio.heroVideo && portfolio.heroCtaLabel && <a href="#portfolio-reel" className="mt-8 inline-flex items-center gap-3 border-b border-[#d7a24a] pb-2 font-mono text-[9px] uppercase tracking-[.2em] text-[#e5bd6c]">{portfolio.heroCtaLabel} <span aria-hidden>▶</span></a>}</div>
      </div>
    </section>

    {portfolio.heroVideo && <section id="portfolio-reel" className="border-b border-white/20 px-5 py-10 md:px-10 md:py-16"><div className="mx-auto max-w-6xl"><Video video={portfolio.heroVideo} /></div></section>}

    <section className="px-5 py-8 md:px-10">
      <div className="flex flex-col gap-5 border-b border-white/20 pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex gap-6 overflow-x-auto font-mono text-[9px] uppercase tracking-[.16em]" role="tablist" aria-label="Filtrar por categoria">
          <Filter active={category === 'all'} onClick={() => { setCategory('all'); setLimit(portfolio.initialProjectCount) }}>Todos</Filter>
          {Object.entries(PORTFOLIO_CATEGORY_LABELS).map(([key, label]) => <Filter key={key} active={category === key} onClick={() => { setCategory(key as PortfolioCategory); setLimit(portfolio.initialProjectCount) }}>{label}</Filter>)}
        </div>
        <div className="flex gap-2 font-mono text-[9px] uppercase tracking-[.16em]" role="tablist" aria-label="Filtrar por formato">
          {([['video', 'Vídeo'], ['photo', 'Foto'], ['all', 'Todos']] as const).map(([key, label]) => <button key={key} role="tab" aria-selected={media === key} onClick={() => { setMedia(key); setLimit(portfolio.initialProjectCount) }} className={`border px-3 py-2 ${media === key ? 'border-[#d7a24a] text-[#e5bd6c]' : 'border-white/15 text-white/55'}`}>{label}</button>)}
        </div>
      </div>
      {visible.length ? <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{visible.map((project) => <ProjectCard key={project.id} project={project} onOpen={() => setSelected(project.id)} />)}</div> : <EmptyProjects hasPublishedProjects={projects.length > 0} />}
      {visible.length < filtered.length && <div className="mt-8 text-center"><button onClick={() => setLimit((v) => v + portfolio.initialProjectCount)} className="border border-[#d7a24a] px-8 py-3 font-mono text-[9px] uppercase tracking-[.2em] text-[#e5bd6c]">{portfolio.loadMoreLabel}</button></div>}
    </section>

    {featured && <ProjectDetail project={featured} />}
    <Contact portfolio={portfolio} />
    <footer className="flex flex-col gap-6 border-t border-white/15 px-6 py-8 font-mono text-[9px] uppercase tracking-[.16em] text-white/50 md:flex-row md:items-center md:justify-between"><span className="text-white">Menos<br/>Roteiro</span><nav className="flex flex-wrap gap-5" aria-label="Links do portfólio">{portfolio.footer.links.map((link) => <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#e5bd6c]">{link.label}</a>)}</nav><span>{portfolio.footer.text}</span></footer>
  </main>
}

function Filter({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) { return <button role="tab" aria-selected={active} onClick={onClick} className={`shrink-0 pb-3 ${active ? 'border-b-2 border-[#d7a24a] text-[#e5bd6c]' : 'text-white/65'}`}>{children}</button> }

function ProjectCard({ project, onOpen }: { project: PortfolioProject; onOpen: () => void }) {
  const hasVideo = Boolean(project.primaryVideo || project.modules.some((module) => module.type === 'video'))
  return <article className="group relative aspect-[16/10] min-h-[280px] overflow-hidden border border-white/20 bg-[#141512]">
    {project.cover && <Image src={project.cover.src} alt={project.cover.alt} fill sizes="(min-width:1024px) 33vw, 100vw" style={toImageStyle(project.cover)} className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" />}
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
    {hasVideo && <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-black/35 text-sm" aria-hidden>▶</span>}
    <button onClick={onOpen} className="absolute inset-0 z-10 text-left" aria-label={`Abrir projeto ${project.title}`} />
    <div className="absolute inset-x-0 bottom-0 p-5"><div className="flex gap-2 font-mono text-[8px] uppercase tracking-[.15em] text-[#e5bd6c]">{project.featured && <span>Destaque ·</span>}<span>{PORTFOLIO_CATEGORY_LABELS[project.category]}</span></div><h2 className="mt-2 font-display text-3xl">{project.title}</h2><p className="mt-2 text-xs text-white/65">{TYPE_LABEL[project.projectType]}{project.responsibilities.length ? ` · ${project.responsibilities.join(' · ')}` : ''}</p></div>
  </article>
}

function ProjectDetail({ project }: { project: PortfolioProject }) {
  const hasWorkModule = project.modules.some((module) => module.type === 'work')
  const hasLinkModule = project.modules.some((module) => module.type === 'link')
  return <section className="border-t border-white/20 px-5 py-14 md:px-10 md:py-20"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.7fr_1.8fr]">
    <aside><p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#e5bd6c]">Projeto em destaque</p><h2 className="mt-5 font-display text-5xl leading-none md:text-6xl">{project.title}</h2><p className="mt-4 font-mono text-[9px] uppercase text-[#e5bd6c]">{PORTFOLIO_CATEGORY_LABELS[project.category]}</p>{project.context && <p className="mt-7 text-sm leading-relaxed text-white/70">{project.context}</p>}{!hasWorkModule && <Work responsibilities={project.responsibilities} />}{project.externalLink && !hasLinkModule && <a href={project.externalLink.url} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex border-b border-[#d7a24a] pb-2 font-mono text-[9px] uppercase tracking-[.18em]">{project.externalLink.label} ↗</a>}</aside>
    <div className="space-y-8">{project.primaryVideo ? <Video video={project.primaryVideo} /> : project.cover && <ImageBlock image={project.cover} />}{project.modules.map((module) => <Module key={module.id} module={module} project={project} />)}</div>
  </div></section>
}

function Module({ module, project }: { module: PortfolioModule; project: PortfolioProject }) {
  if (module.type === 'text') return <div className="max-w-3xl">{module.title && <h3 className="font-display text-3xl">{module.title}</h3>}<p className="mt-3 leading-relaxed text-white/70">{module.text}</p></div>
  if (module.type === 'image') return <ImageBlock image={module.image} />
  if (module.type === 'video') return <Video video={module.video} />
  if (module.type === 'work') return <Work responsibilities={project.responsibilities} />
  if (module.type === 'link') return <a href={module.url} target="_blank" rel="noopener noreferrer" className="inline-flex border border-[#d7a24a] px-6 py-3 font-mono text-[9px] uppercase tracking-[.18em]">{module.label} ↗</a>
  if (module.type === 'credits') return <div><p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#e5bd6c]">Créditos</p><ul className="mt-4 grid gap-2 text-sm text-white/70">{module.credits.map((c) => <li key={`${c.name}-${c.role}`}>{c.name}{c.role ? ` · ${c.role}` : ''}</li>)}</ul></div>
  return <div><h3 className="mb-4 font-mono text-[9px] uppercase tracking-[.2em] text-[#e5bd6c]">{module.title || (module.type === 'interfaces' ? 'Interfaces' : 'Galeria')}</h3><div className={`grid gap-2 ${module.type === 'interfaces' ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>{module.images.map((image, i) => <ImageBlock key={`${image.src}-${i}`} image={image} compact />)}</div></div>
}

function Work({ responsibilities }: { responsibilities: string[] }) { return responsibilities.length ? <div className="mt-8"><p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#e5bd6c]">Nosso trabalho</p><p className="mt-3 text-sm leading-relaxed text-white/70">{responsibilities.join(' · ')}</p></div> : null }
function EmptyProjects({ hasPublishedProjects }: { hasPublishedProjects: boolean }) { return <div className="my-8 border border-white/15 px-6 py-20 text-center"><p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#e5bd6c]">{hasPublishedProjects ? 'Seleção atual' : 'Portfólio em preparação'}</p><h2 className="mx-auto mt-5 max-w-xl font-display text-4xl md:text-5xl">{hasPublishedProjects ? 'Nenhum projeto neste filtro.' : 'Os primeiros trabalhos serão apresentados aqui.'}</h2>{!hasPublishedProjects && <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/55">Esta área continua privada enquanto a seleção editorial está sendo organizada.</p>}</div> }
function ImageBlock({ image, compact = false }: { image: NonNullable<PortfolioProject['cover']>; compact?: boolean }) { return <figure><div className={`relative overflow-hidden bg-black ${compact ? 'aspect-[4/3]' : 'aspect-video'}`}><Image src={image.src} alt={image.alt} fill sizes="(min-width:768px) 65vw, 100vw" style={toImageStyle(image)} className="object-cover" /></div>{image.caption && <figcaption className="mt-2 text-xs text-white/50">{image.caption}</figcaption>}</figure> }
function Video({ video }: { video: NonNullable<PortfolioProject['primaryVideo']> }) { const youtube = youtubePrivacyUrl(video.url); return <figure>{youtube ? <iframe src={youtube} title={video.title || 'Vídeo do projeto'} loading="lazy" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="aspect-video w-full bg-black" /> : <video controls playsInline preload="none" poster={video.poster?.src} className="aspect-video w-full bg-black object-contain"><source src={video.url} /></video>}{video.title && <figcaption className="mt-2 text-xs text-white/50">{video.title}</figcaption>}</figure> }
function Contact({ portfolio }: { portfolio: PrivatePortfolio }) { const c = portfolio.contact; return <section className="grid border-t border-white/20 md:min-h-[430px] md:grid-cols-[.85fr_1.15fr]">{c.background ? <div className="relative min-h-[280px]"><Image src={c.background.src} alt={c.background.alt} fill sizes="(min-width:768px) 45vw, 100vw" style={toImageStyle(c.background)} className="object-cover opacity-75" /></div> : <div className="hidden bg-[#12130f] md:block" />}<div className="px-6 py-16 md:px-12 md:py-20"><p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#e5bd6c]">{c.kicker}</p><h2 className="mt-4 max-w-2xl font-display text-5xl leading-none md:text-6xl">{c.title}</h2>{c.text && <p className="mt-6 max-w-xl text-white/65">{c.text}</p>}<div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">{c.contactUrl && c.ctaLabel && <a href={c.contactUrl} target="_blank" rel="noopener noreferrer" className="border border-[#d7a24a] px-6 py-3 text-center font-mono text-[9px] uppercase tracking-[.18em]">{c.ctaLabel}</a>}{c.email && <a href={`mailto:${c.email}`} className="border-b border-white/30 px-2 py-3 text-sm">{c.email}</a>}</div></div></section> }
