import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('Presentation Tool', () => {
  it('registra a ferramenta em português e aponta para a Home', () => {
    const config = readFileSync('sanity.config.ts', 'utf8')

    expect(config).toContain("from 'sanity/presentation'")
    expect(config).toContain("name: 'visualizar'")
    expect(config).toContain("title: 'Editar site ao vivo'")
    expect(config).toContain("initial: '/'")
    expect(config.indexOf('presentationTool({')).toBeLessThan(config.indexOf('structureTool({'))
  })

  it('oferece orientação didática nos sete documentos da Home', () => {
    const config = readFileSync('sanity.config.ts', 'utf8')
    const guide = readFileSync('src/sanity/components/editorial-document-guide.tsx', 'utf8')
    const initialValues = readFileSync('src/sanity/initial-values.ts', 'utf8')

    expect(config).toContain('input: EditorialDocumentGuide')
    for (const type of ['hero', 'now', 'about', 'pillars', 'contentHighlights', 'partnerships', 'faq']) {
      expect(guide).toContain(`${type}: {`)
    }
    expect(guide).toContain('clique no trecho da página')
    expect(initialValues).toContain('initialHero')
    expect(initialValues).toContain('initialFaq')
  })

  it('usa exclusivamente as rotas oficiais de ativação e saída', () => {
    const config = readFileSync('sanity.config.ts', 'utf8')
    const enable = readFileSync('src/app/api/draft-mode/enable/route.ts', 'utf8')
    const disable = readFileSync('src/app/api/draft-mode/disable/route.ts', 'utf8')

    expect(config).toContain("enable: '/api/draft-mode/enable'")
    expect(config).toContain("disable: '/api/draft-mode/disable'")
    expect(enable).toContain('defineEnableDraftMode')
    expect(enable).not.toContain('Bearer')
    expect(disable).toContain('export async function POST')
  })

  it('mapeia somente os sete singletons públicos da Home', () => {
    const source = readFileSync('src/sanity/presentation.ts', 'utf8')
    const types = [
      'hero',
      'now',
      'about',
      'pillars',
      'contentHighlights',
      'partnerships',
      'faq',
    ]

    for (const type of types) {
      expect(source).toContain(`${type}: defineLocations`)
      expect(source).toContain(`type: '${type}'`)
    }
    expect(source).not.toContain('privatePortfolio')
    expect(source).not.toContain('private-portfolio-singleton')
    expect(source).not.toContain('/portfolio/')
  })

  it('oferece Desktop, Tablet e Mobile com as larguras aprovadas', () => {
    const source = readFileSync('src/sanity/presentation-preview-header.tsx', 'utf8')

    expect(source).toContain("{ name: 'Desktop', width: 1440")
    expect(source).toContain("{ name: 'Tablet', width: 768")
    expect(source).toContain("{ name: 'Mobile', width: 390")
    expect(source).toContain('props.setViewport(viewport.mode)')
    expect(source).toContain("{ name: 'Mobile', width: 390, mode: 'desktop' }")
  })

  it('monta Visual Editing somente na rota editorial protegida', () => {
    const preview = readFileSync(
      'src/app/(marketing)/editorial-internal/home/page.tsx',
      'utf8',
    )
    const publicHome = readFileSync('src/app/(marketing)/page.tsx', 'utf8')

    expect(preview).toContain("from 'next-sanity/visual-editing'")
    expect(preview).toContain('<VisualEditing />')
    expect(preview).toContain('if (!isEnabled) notFound()')
    expect(publicHome).not.toContain('VisualEditing')
  })

  it('mantém stega e token fora do caminho público', () => {
    const publicHome = readFileSync('src/app/(marketing)/page.tsx', 'utf8')
    const composition = readFileSync('src/components/home/home-composition.tsx', 'utf8')
    const publicClient = readFileSync('src/sanity/client.ts', 'utf8')

    expect(publicHome).not.toContain('stega')
    expect(composition).not.toContain('stega')
    expect(publicClient).not.toContain('SANITY_API_READ_TOKEN')
  })

  it('carrega as sete seções com stega para click-to-edit', () => {
    const query = readFileSync('src/sanity/editorial/home.ts', 'utf8')

    expect(query).toContain('createEditorialClient({ stega: true })')
    expect(query).toContain("cache: 'no-store'")
    expect(query).toContain('getHeroFromSanity(options)')
    expect(query).toContain('getNowFromSanity(options)')
    expect(query).toContain('getAboutFromSanity(options)')
    expect(query).toContain('getPillarsFromSanity(options)')
    expect(query).toContain('getContentHighlightsFromSanity(options)')
    expect(query).toContain('getPartnershipsFromSanity(options)')
    expect(query).toContain('getFaqFromSanity(options)')
  })

  it('não adiciona operações de escrita à camada editorial', () => {
    const source = [
      readFileSync('src/sanity/editorial/client.server.ts', 'utf8'),
      readFileSync('src/sanity/editorial/home.ts', 'utf8'),
    ].join('\n')

    expect(source).not.toContain('.mutate(')
    expect(source).not.toContain('.create(')
    expect(source).not.toContain('.patch(')
    expect(source).not.toContain('.delete(')
  })
})
