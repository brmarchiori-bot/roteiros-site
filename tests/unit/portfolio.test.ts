import { describe, expect, it } from 'vitest'
import { emptyPortfolio } from '@/content/portfolio-empty'
import { featuredPortfolioProject, filterPortfolioProjects, hasProjectMedia, visiblePortfolioProjects, youtubePrivacyUrl } from '@/lib/portfolio'
import { PORTFOLIO_CATEGORIES, PORTFOLIO_RESPONSIBILITIES, type PortfolioProject } from '@/types/portfolio'

const base = (partial: Partial<PortfolioProject>): PortfolioProject => ({
  id: 'fixture', title: 'Projeto', category: 'brands', projectType: 'hybrid', visible: true,
  featured: false, order: 1, responsibilities: [], modules: [], ...partial,
})
const image = { src: '/fixture.jpg', alt: 'Descrição objetiva da imagem' }

describe('arquitetura comercial do portfólio privado', () => {
  const fixtures: PortfolioProject[] = [
    base({ id: 'direct-video', projectType: 'audiovisual', primaryVideo: { url: 'https://cdn.example/video.mp4' } }),
    base({ id: 'youtube', projectType: 'audiovisual', primaryVideo: { url: 'https://youtu.be/abc123XYZ' } }),
    base({ id: 'photo', projectType: 'photography', cover: image, modules: [{ id: 'g', type: 'gallery', images: [image] }] }),
    base({ id: 'digital', category: 'digital', projectType: 'digital', modules: [{ id: 'ui', type: 'interfaces', images: [image] }, { id: 'link', type: 'link', label: 'Conhecer projeto', url: 'https://example.com' }] }),
    base({ id: 'hybrid', projectType: 'hybrid', cover: image, modules: [{ id: 'copy', type: 'text', text: 'Contexto do projeto.' }] }),
    base({ id: 'no-cover', projectType: 'audiovisual', primaryVideo: { url: 'https://cdn.example/video.mp4' } }),
    base({ id: 'no-video', projectType: 'photography', cover: image }),
    base({ id: 'no-gallery', projectType: 'digital', externalLink: { label: 'Abrir experiência', url: 'https://example.com' } }),
    base({ id: 'script-only', projectType: 'audiovisual', primaryVideo: { url: 'https://cdn.example/final.mp4' }, responsibilities: ['Roteiro'] }),
  ]

  it.each(fixtures)('aceita a variante $id sem depender de campos irrelevantes', (project) => {
    expect(project.title).toBeTruthy()
    expect(project.projectType).toBeTruthy()
    expect(project.modules).toBeDefined()
  })

  it('ordena e exclui projetos ocultos', () => {
    const result = visiblePortfolioProjects([base({ id: 'later', order: 2 }), base({ id: 'hidden', visible: false }), base({ id: 'first', order: 1 })])
    expect(result.map(({ id }) => id)).toEqual(['first', 'later'])
  })

  it('reconhece mídia sem obrigar capa', () => {
    expect(hasProjectMedia(fixtures[0])).toBe(true)
    expect(hasProjectMedia(fixtures[7])).toBe(false)
  })

  it('usa o domínio de incorporação do YouTube com privacidade reforçada', () => {
    expect(youtubePrivacyUrl('https://www.youtube.com/watch?v=abc123XYZ')).toBe('https://www.youtube-nocookie.com/embed/abc123XYZ')
    expect(youtubePrivacyUrl('https://cdn.example/video.mp4')).toBeNull()
  })

  it('não contém CTA vazio na variante digital', () => {
    const links = fixtures[3].modules.filter((module) => module.type === 'link')
    expect(links).toEqual([{ id: 'link', type: 'link', label: 'Conhecer projeto', url: 'https://example.com' }])
  })

  it('trata zero projetos sem fallback fictício ou destaque inexistente', () => {
    expect(emptyPortfolio.projects).toEqual([])
    expect(featuredPortfolioProject([], 'inexistente')).toBeNull()
    expect(JSON.stringify(emptyPortfolio)).not.toMatch(/Pousada Alto|Maré Restaurante|Festival Verão|Vancy/i)
  })

  it('seleciona o destaque a partir do próprio projeto, sem duplicar dados', () => {
    const featured = base({ id: 'principal', featured: true, title: 'Trabalho principal' })
    expect(featuredPortfolioProject([featured], 'inexistente')).toBe(featured)
  })

  it('filtra categoria digital, vídeo e fotografia', () => {
    expect(filterPortfolioProjects(fixtures, 'digital', 'all').map(({ id }) => id)).toEqual(['digital'])
    expect(filterPortfolioProjects(fixtures, 'all', 'video').map(({ id }) => id)).toEqual(['direct-video', 'youtube', 'no-cover', 'script-only'])
    expect(filterPortfolioProjects(fixtures, 'all', 'photo').map(({ id }) => id)).toEqual(['photo', 'digital', 'hybrid', 'no-video'])
  })

  it('mantém exatamente as categorias comerciais controladas', () => {
    expect(PORTFOLIO_CATEGORIES).toEqual(['hospitality', 'gastronomy', 'events', 'brands', 'digital'])
  })

  it('oferece todas as responsabilidades audiovisuais e digitais exigidas', () => {
    expect(PORTFOLIO_RESPONSIBILITIES).toEqual(expect.arrayContaining([
      'Direção criativa', 'Roteiro', 'Captação', 'Fotografia', 'Edição', 'Narração', 'Apresentação',
      'Estratégia', 'Produto', 'Arquitetura da experiência', 'UX/UI', 'Direção visual',
      'Desenvolvimento', 'CMS', 'Automações', 'Integrações',
    ]))
  })

  it('suporta um projeto digital completo somente por módulos', () => {
    const digital = base({
      id: 'digital-complete', category: 'digital', projectType: 'digital', cover: image,
      primaryVideo: { url: 'https://cdn.example/demo.mp4', poster: image },
      responsibilities: ['Estratégia', 'Produto', 'UX/UI', 'Direção visual', 'Desenvolvimento'],
      modules: [
        { id: 'context', type: 'text', text: 'Contexto.' },
        { id: 'screen', type: 'image', image },
        { id: 'interfaces', type: 'interfaces', images: [image, image] },
        { id: 'work', type: 'work' },
        { id: 'link', type: 'link', label: 'Conhecer projeto', url: 'https://example.com' },
      ],
    })
    expect(digital.modules.map(({ type }) => type)).toEqual(['text', 'image', 'interfaces', 'work', 'link'])
    expect(digital.responsibilities).toHaveLength(5)
  })

  it('suporta hospedagem, restaurante, evento, fotografia e híbrido sem mudar o frontend', () => {
    const formats = [
      base({ category: 'hospitality', primaryVideo: { url: 'https://cdn.example/main.mp4' }, modules: [{ id: 'gallery', type: 'gallery', images: [image] }, { id: 'other-video', type: 'video', video: { url: 'https://cdn.example/other.mp4' } }] }),
      base({ category: 'gastronomy', primaryVideo: { url: 'https://cdn.example/food.mp4' }, modules: [{ id: 'photos', type: 'gallery', images: [image] }] }),
      base({ category: 'events', projectType: 'audiovisual', primaryVideo: { url: 'https://cdn.example/event.mp4' } }),
      fixtures.find(({ id }) => id === 'photo')!,
      base({ projectType: 'hybrid', primaryVideo: { url: 'https://cdn.example/hybrid.mp4' }, modules: [{ id: 'photos', type: 'gallery', images: [image] }, { id: 'ui', type: 'interfaces', images: [image] }] }),
    ]
    expect(formats).toHaveLength(5)
    expect(formats.every((project) => project.modules && project.projectType)).toBe(true)
  })

  it('não cria links vazios quando WhatsApp, email ou link externo estão ausentes', () => {
    expect(emptyPortfolio.contact.contactUrl).toBeUndefined()
    expect(emptyPortfolio.contact.email).toBeUndefined()
    expect(fixtures[6].externalLink).toBeUndefined()
  })
})
