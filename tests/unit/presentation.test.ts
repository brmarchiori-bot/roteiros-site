import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('Presentation Tool', () => {
  it('registra a ferramenta em português e aponta para a Home', () => {
    const config = readFileSync('sanity.config.ts', 'utf8')

    expect(config).toContain("from 'sanity/presentation'")
    expect(config).toContain("name: 'visualizar'")
    expect(config).toContain("title: 'Visualizar página'")
    expect(config).toContain("initial: '/'")
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

  it('preserva os campos e _key necessários para click-to-edit de Pilares', () => {
    const query = readFileSync('src/sanity/editorial/pillars.ts', 'utf8')

    expect(query).toContain('_id,')
    expect(query).toContain('_type,')
    expect(query).toContain('_key,')
    expect(query).toContain('title,')
    expect(query).toContain('description,')
    expect(query).toContain('href')
    expect(query).toContain('_key: item._key')
  })

  it('não adiciona operações de escrita à camada editorial', () => {
    const source = [
      readFileSync('src/sanity/editorial/client.server.ts', 'utf8'),
      readFileSync('src/sanity/editorial/pillars.ts', 'utf8'),
    ].join('\n')

    expect(source).not.toContain('.mutate(')
    expect(source).not.toContain('.create(')
    expect(source).not.toContain('.patch(')
    expect(source).not.toContain('.delete(')
  })
})
