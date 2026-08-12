'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { featuredPortfolioProject, filterPortfolioProjects, visiblePortfolioProjects, vimeoPrivacyUrl, youtubePrivacyUrl, type PortfolioMediaFilter } from '@/lib/portfolio'
import { PORTFOLIO_CATEGORY_LABELS, type PortfolioCategory, type PortfolioModule, type PortfolioProject, type PrivatePortfolio } from '@/types/portfolio'
import { toImageStyle } from '@/lib/sanity-styles'

const TYPE_LABEL = { audiovisual: 'Audiovisual', photography: 'Fotografia', digital: 'Projeto digital', hybrid: 'Híbrido' }

export function PortfolioExperience({ portfolio }: { portfolio: PrivatePortfolio }) {
  const [category, setCategory] = useState<'all' | PortfolioCategory>('all')
  const [media, setMedia] = useState<PortfolioMediaFilter>('all')
  const [limit, setLimit] = useState(portfolio.initialProjectCount)
  const [selected, setSelected] = useState<string | null>(portfolio.projects.find((p) => p.featured)?.id ?? null)
  const detailRef = useRef<HTMLElement>(null)
  const shouldScrollToDetail = useRef(false)
  const projects = useMemo(() => visiblePortfolioProjects(portfolio.projects), [portfolio.projects])
  const filtered = useMemo(() => filterPortfolioProjects(projects, category, media), [projects, category, media])
  const visible = filtered.slice(0, limit)
  const featured = featuredPortfolioProject(projects, selected)

  useEffect(() => {
    if (!selected || !shouldScrollToDetail.current) return
    shouldScrollToDetail.current = false
    const detail = detailRef.current
    if (!detail) return
    detail.scrollIntoView({ behavior: 'smooth', block: 'start' })
    detail.focus({ preventScroll: true })
  }, [selected])

  const openProject = (projectId: string) => {
    shouldScrollToDetail.current = true
    setSelected(projectId)
  }

  return <main className="min-h-screen overflow-x-hidden bg-[#0b0c0a] text-[#eee8dc]">
    <section className="relative min-h-[82svh] border-b border-white/20">
      {portfolio.heroImage && <Image src={portfolio.heroImage.src} alt={portfolio.heroImage.alt} fill priority sizes="100vw" style={toImageStyle(portfolio.heroImage)} className="object-cover opacity-60" />}
      {portfolio.heroBackgroundVideoUrl && <HeroBackgroundVideo src={portfolio.heroBackgroundVideoUrl} poster={portfolio.heroImage?.src} />}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-black/20" />
      <div className="relative z-10 flex min-h-[82svh] flex-col justify-between px-6 py-7 md:px-12 md:py-10">
        <header className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[.22em]"><span>Menos<br/>Roteiros</span><span>▱ {portfolio.privacyLabel}</span></header>
        <div className="max-w-2xl pb-12 md:pb-16"><p className="font-mono text-[10px] uppercase tracking-[.24em] text-[#d7a24a]">{portfolio.kicker}</p><h1 className="mt-5 font-display text-5xl uppercase leading-[.88] tracking-[-.04em] sm:text-7xl md:text-8xl">{portfolio.title}</h1>{portfolio.introduction && <p className="mt-7 max-w-lg text-base leading-relaxed text-white/75">{portfolio.introduction}</p>}{portfolio.heroVideo && portfolio.heroCtaLabel && <a href="#portfolio-reel" className="mt-8 inline-flex items-center gap-3 border-b border-[#d7a24a] pb-2 font-mono text-[9px] uppercase tracking-[.2em] text-[#e5bd6c]">{portfolio.heroCtaLabel} <span aria-hidden>▶</span></a>}</div>
      </div>
    </section>

    {portfolio.heroVideo && <section id="portfolio-reel" className="border-b border-white/20 px-5 py-10 md:px-10 md:py-16"><div className="mx-auto max-w-6xl"><Video video={portfolio.heroVideo} /></div></section>}

    <section className="w-full min-w-0 overflow-hidden px-5 py-8 md:px-10">
      <div className="flex flex-col gap-5 border-b border-white/20 pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="mb-3 flex items-center justify-between font-mono text-[8px] uppercase tracking-[.16em] text-white/45 lg:hidden"><span>Escolha uma categoria</span><span className="text-[#e5bd6c]">Deslize para ver mais →</span></p>
          <div className="relative -mr-5 lg:mr-0">
            <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pr-14 font-mono text-[9px] uppercase tracking-[.16em] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Filtrar por categoria">
              <Filter active={category === 'all'} onClick={() => { setCategory('all'); setLimit(portfolio.initialProjectCount) }}>Todos</Filter>
              {Object.entries(PORTFOLIO_CATEGORY_LABELS).map(([key, label]) => <Filter key={key} active={category === key} onClick={() => { setCategory(key as PortfolioCategory); setLimit(portfolio.initialProjectCount) }}>{label}</Filter>)}
            </div>
            <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-r from-transparent to-[#0b0c0a] lg:hidden" />
          </div>
        </div>
        <div className="flex gap-2 font-mono text-[9px] uppercase tracking-[.16em]" role="tablist" aria-label="Filtrar por formato">
          {([['video', 'Vídeo'], ['photo', 'Foto'], ['all', 'Todos']] as const).map(([key, label]) => <button key={key} role="tab" aria-selected={media === key} onClick={() => { setMedia(key); setLimit(portfolio.initialProjectCount) }} className={`border px-3 py-2 ${media === key ? 'border-[#d7a24a] text-[#e5bd6c]' : 'border-white/15 text-white/55'}`}>{label}</button>)}
        </div>
      </div>
      {visible.length ? <div className="mt-7 grid w-full min-w-0 max-w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{visible.map((project) => <ProjectCard key={project.id} project={project} onOpen={() => openProject(project.id)} />)}</div> : <EmptyProjects hasPublishedProjects={projects.length > 0} />}
      {visible.length < filtered.length && <div className="mt-8 text-center"><button onClick={() => setLimit((v) => v + portfolio.initialProjectCount)} className="border border-[#d7a24a] px-8 py-3 font-mono text-[9px] uppercase tracking-[.2em] text-[#e5bd6c]">{portfolio.loadMoreLabel}</button></div>}
    </section>

    {featured && <ProjectDetail key={featured.id} ref={detailRef} project={featured} />}
    <Contact portfolio={portfolio} />
    <footer className="flex flex-col gap-6 border-t border-white/15 px-6 py-8 font-mono text-[9px] uppercase tracking-[.16em] text-white/50 md:flex-row md:items-center md:justify-between"><span className="text-white">Menos<br/>Roteiros</span><nav className="flex flex-wrap gap-5" aria-label="Links do portfólio">{portfolio.footer.links.map((link) => <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#e5bd6c]">{link.label}</a>)}</nav><span>{portfolio.footer.text}</span></footer>
  </main>
}

function HeroBackgroundVideo({ src, poster }: { src: string; poster?: string }) {
  return <video src={src} muted loop autoPlay playsInline preload="metadata" poster={poster} aria-hidden="true" className="absolute inset-0 size-full object-cover opacity-65 motion-reduce:hidden" />
}

function Filter({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) { return <button role="tab" aria-selected={active} onClick={onClick} className={`shrink-0 snap-start pb-3 ${active ? 'border-b-2 border-[#d7a24a] text-[#e5bd6c]' : 'text-white/65'}`}>{children}</button> }

function ProjectCard({ project, onOpen }: { project: PortfolioProject; onOpen: () => void }) {
  const hasVideo = Boolean(project.primaryVideo || project.modules.some((module) => module.type === 'video'))
  return <article className="group relative aspect-[16/10] min-h-[280px] w-full min-w-0 max-w-full overflow-hidden border border-white/20 bg-[#141512]">
    {project.cover && <Image src={project.cover.src} alt={project.cover.alt} fill sizes="(min-width:1024px) 33vw, 100vw" style={toImageStyle(project.cover)} className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" />}
    {project.previewVideoUrl && <CardPreview src={project.previewVideoUrl} poster={project.cover?.src} />}
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
    {hasVideo && <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/65 bg-black/35 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105" aria-hidden><svg viewBox="0 0 24 24" className="ml-0.5 size-4 fill-white" focusable="false"><path d="M8.5 5.7v12.6L18 12 8.5 5.7Z" /></svg></span>}
    <button onClick={onOpen} className="absolute inset-0 z-10 text-left" aria-label={`Abrir projeto ${project.title}`} />
    <div className="absolute inset-x-0 bottom-0 min-w-0 p-5"><div className="flex min-w-0 gap-2 font-mono text-[8px] uppercase tracking-[.15em] text-[#e5bd6c]">{project.featured && <span>Destaque ·</span>}<span className="min-w-0">{PORTFOLIO_CATEGORY_LABELS[project.category]}</span></div><h2 className="mt-2 font-display text-3xl">{project.title}</h2><p className="mt-2 max-w-full text-xs text-white/65">{TYPE_LABEL[project.projectType]}{project.responsibilities.length ? ` · ${project.responsibilities.join(' · ')}` : ''}</p></div>
  </article>
}

function CardPreview({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) void video.play().catch(() => undefined)
      else video.pause()
    }, { threshold: 0.35 })
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return <video ref={videoRef} src={src} muted loop playsInline preload="metadata" poster={poster} aria-hidden="true" className="absolute inset-0 size-full object-cover motion-reduce:hidden" />
}

function ProjectDetail({ project, ref }: { project: PortfolioProject; ref: React.Ref<HTMLElement> }) {
  const hasWorkModule = project.modules.some((module) => module.type === 'work')
  const hasLinkModule = project.modules.some((module) => module.type === 'link')
  return <section ref={ref} tabIndex={-1} aria-labelledby={`portfolio-project-${project.id}`} className="scroll-mt-4 border-t border-white/20 px-5 py-14 outline-none md:px-10 md:py-20"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.7fr_1.8fr]">
    <aside><p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#e5bd6c]">Projeto em destaque</p><h2 id={`portfolio-project-${project.id}`} className="mt-5 font-display text-5xl leading-none md:text-6xl">{project.title}</h2><p className="mt-4 font-mono text-[9px] uppercase text-[#e5bd6c]">{PORTFOLIO_CATEGORY_LABELS[project.category]}</p>{project.context && <p className="mt-7 text-sm leading-relaxed text-white/70">{project.context}</p>}{!hasWorkModule && <Work responsibilities={project.responsibilities} />}{project.externalLink && !hasLinkModule && <a href={project.externalLink.url} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex border-b border-[#d7a24a] pb-2 font-mono text-[9px] uppercase tracking-[.18em]">{project.externalLink.label} ↗</a>}</aside>
    <div className="space-y-8">{project.primaryVideo ? <Video video={project.primaryVideo} /> : project.cover && <ImageBlock image={project.cover} />}{project.modules.map((module) => <Module key={module.id} module={module} project={project} />)}</div>
  </div></section>
}

function Module({ module, project }: { module: PortfolioModule; project: PortfolioProject }) {
  if (module.type === 'text') return <div className="max-w-3xl">{module.title && <h3 className="font-display text-3xl">{module.title}</h3>}<p className="mt-3 leading-relaxed text-white/70">{module.text}</p></div>
  if (module.type === 'image') return <ImageBlock image={module.image} />
  if (module.type === 'video') return <Video video={module.video} />
  if (module.type === 'socialCarousel') return <SocialCarousel module={module} />
  if (module.type === 'work') return <Work responsibilities={project.responsibilities} />
  if (module.type === 'link') return <a href={module.url} target="_blank" rel="noopener noreferrer" className="inline-flex border border-[#d7a24a] px-6 py-3 font-mono text-[9px] uppercase tracking-[.18em]">{module.label} ↗</a>
  if (module.type === 'credits') return <div><p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#e5bd6c]">Créditos</p><ul className="mt-4 grid gap-2 text-sm text-white/70">{module.credits.map((c) => <li key={`${c.name}-${c.role}`}>{c.name}{c.role ? ` · ${c.role}` : ''}</li>)}</ul></div>
  return <div><h3 className="mb-4 font-mono text-[9px] uppercase tracking-[.2em] text-[#e5bd6c]">{module.title || (module.type === 'interfaces' ? 'Interfaces' : 'Galeria')}</h3><div className={`grid gap-2 ${module.type === 'interfaces' ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>{module.images.map((image, i) => <ImageBlock key={`${image.src}-${i}`} image={image} compact />)}</div></div>
}

function Work({ responsibilities }: { responsibilities: string[] }) { return responsibilities.length ? <div className="mt-8"><p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#e5bd6c]">Nosso trabalho</p><p className="mt-3 text-sm leading-relaxed text-white/70">{responsibilities.join(' · ')}</p></div> : null }
function EmptyProjects({ hasPublishedProjects }: { hasPublishedProjects: boolean }) { return <div className="my-8 border border-white/15 px-6 py-20 text-center"><p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#e5bd6c]">{hasPublishedProjects ? 'Seleção atual' : 'Portfólio em preparação'}</p><h2 className="mx-auto mt-5 max-w-xl font-display text-4xl md:text-5xl">{hasPublishedProjects ? 'Nenhum projeto neste filtro.' : 'Os primeiros trabalhos serão apresentados aqui.'}</h2>{!hasPublishedProjects && <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/55">Esta área continua privada enquanto a seleção editorial está sendo organizada.</p>}</div> }
function ImageBlock({ image, compact = false }: { image: NonNullable<PortfolioProject['cover']>; compact?: boolean }) { return <figure><div className={`relative overflow-hidden bg-black ${compact ? 'aspect-[4/3]' : 'aspect-video'}`}><Image src={image.src} alt={image.alt} fill sizes="(min-width:768px) 65vw, 100vw" style={toImageStyle(image)} className="object-cover" /></div>{image.caption && <figcaption className="mt-2 text-xs text-white/50">{image.caption}</figcaption>}</figure> }
const VIDEO_RATIO = { horizontal: 'aspect-video', vertical: 'aspect-[9/16] max-h-[78svh]', square: 'aspect-square max-h-[78svh]' }
function Video({ video }: { video: NonNullable<PortfolioProject['primaryVideo']> }) {
  const embed = youtubePrivacyUrl(video.url) ?? vimeoPrivacyUrl(video.url)
  const ratio = VIDEO_RATIO[video.format]
  return <figure className={video.format === 'horizontal' ? '' : 'mx-auto max-w-md'}><div className={`mx-auto overflow-hidden bg-black ${ratio}`}>{embed ? <iframe src={embed} title={video.title || 'Vídeo do projeto'} loading="lazy" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="size-full bg-black" /> : <video controls playsInline preload="none" poster={video.poster?.src} className="size-full bg-black object-contain"><source src={video.url} />Seu navegador não oferece suporte a este vídeo.</video>}</div>{video.title && <figcaption className="mt-2 text-xs text-white/50">{video.title}</figcaption>}</figure>
}

const CAROUSEL_RATIO = { portrait: 'aspect-[4/5]', square: 'aspect-square', landscape: 'aspect-[1.91/1]' }
function SocialCarousel({ module }: { module: Extract<PortfolioModule, { type: 'socialCarousel' }> }) {
  const [active, setActive] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const current = module.images[active]
  const move = (direction: number) => setActive((value) => (value + direction + module.images.length) % module.images.length)
  return <section aria-label={module.title || 'Carrossel para Instagram'} className="border-y border-white/15 py-8">
    {module.title && <h3 className="mb-6 font-display text-3xl">{module.title}</h3>}
    <div className={`grid gap-8 ${module.showAllSlides ? 'lg:grid-cols-[minmax(300px,440px)_1fr]' : 'place-items-center'}`}>
      <div className="w-full max-w-[440px] overflow-hidden rounded-sm border border-white/20 bg-[#11120f] shadow-2xl">
        <header className="flex items-center gap-3 px-4 py-3"><span className="grid size-8 place-items-center rounded-full border border-[#d7a24a]/60 bg-[#25251f] font-mono text-[9px] text-[#e5bd6c]">MR</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{module.profileName || 'Menos Roteiro'}</p><p className="font-mono text-[8px] uppercase tracking-[.15em] text-white/45">Projeto editorial</p></div><span className="font-mono text-xs text-white/45" aria-hidden>•••</span></header>
        <div className={`relative touch-pan-y bg-black ${CAROUSEL_RATIO[module.format]}`} onTouchStart={(event) => setTouchStart(event.touches[0]?.clientX ?? null)} onTouchEnd={(event) => { const end = event.changedTouches[0]?.clientX; if (touchStart !== null && end !== undefined && Math.abs(end - touchStart) > 45) move(end < touchStart ? 1 : -1); setTouchStart(null) }}>
          <Image src={current.src} alt={current.alt} fill sizes="(min-width:1024px) 440px, 100vw" className="object-contain" />
          <span className="absolute right-3 top-3 rounded-full bg-black/65 px-2 py-1 font-mono text-[9px] text-white">{active + 1}/{module.images.length}</span>
          <button type="button" onClick={() => move(-1)} aria-label="Página anterior" className="absolute left-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-xl text-white">‹</button>
          <button type="button" onClick={() => move(1)} aria-label="Próxima página" className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-xl text-white">›</button>
        </div>
        <div className="px-4 py-4"><div className="flex items-center justify-between"><div className="flex gap-4 text-lg" aria-hidden><span>♡</span><span>○</span><span>⌁</span></div><span aria-hidden>▱</span></div><div className="mt-3 flex justify-center gap-1.5" aria-label={`Página ${active + 1} de ${module.images.length}`}>{module.images.map((_, index) => <button key={index} type="button" onClick={() => setActive(index)} aria-label={`Ir para página ${index + 1}`} className={`size-1.5 rounded-full ${index === active ? 'bg-[#d7a24a]' : 'bg-white/30'}`} />)}</div>{module.caption && <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-white/70"><strong className="text-white">{module.profileName || 'Menos Roteiro'}</strong> {module.caption}</p>}</div>
      </div>
      {module.showAllSlides && <div><p className="mb-4 font-mono text-[9px] uppercase tracking-[.18em] text-[#e5bd6c]">Sequência completa · {module.images.length} páginas</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{module.images.map((image, index) => <button type="button" key={`${image.src}-${index}`} onClick={() => setActive(index)} className={`relative overflow-hidden border ${CAROUSEL_RATIO[module.format]} ${index === active ? 'border-[#d7a24a]' : 'border-white/15'}`} aria-label={`Visualizar página ${index + 1}`}><Image src={image.src} alt={image.alt} fill sizes="(min-width:1024px) 18vw, 45vw" className="object-contain" /><span className="absolute left-2 top-2 grid size-5 place-items-center rounded-full bg-black/70 font-mono text-[8px]">{index + 1}</span></button>)}</div></div>}
    </div>
  </section>
}
function Contact({ portfolio }: { portfolio: PrivatePortfolio }) { const c = portfolio.contact; return <section className="grid border-t border-white/20 md:min-h-[430px] md:grid-cols-[.85fr_1.15fr]">{c.background ? <div className="relative min-h-[280px]"><Image src={c.background.src} alt={c.background.alt} fill sizes="(min-width:768px) 45vw, 100vw" style={toImageStyle(c.background)} className="object-cover opacity-75" /></div> : <div className="hidden bg-[#12130f] md:block" />}<div className="px-6 py-16 md:px-12 md:py-20"><p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#e5bd6c]">{c.kicker}</p><h2 className="mt-4 max-w-2xl font-display text-5xl leading-none md:text-6xl">{c.title}</h2>{c.text && <p className="mt-6 max-w-xl text-white/65">{c.text}</p>}<div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">{c.contactUrl && c.ctaLabel && <a href={c.contactUrl} target="_blank" rel="noopener noreferrer" className="border border-[#d7a24a] px-6 py-3 text-center font-mono text-[9px] uppercase tracking-[.18em]">{c.ctaLabel}</a>}{c.email && <a href={`mailto:${c.email}`} className="border-b border-white/30 px-2 py-3 text-sm">{c.email}</a>}</div></div></section> }
