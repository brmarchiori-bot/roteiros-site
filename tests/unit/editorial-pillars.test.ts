import { readFileSync } from 'node:fs'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { pillars as pillarsFallback } from '@/content'

vi.mock('server-only', () => ({}))

const validDocument = {
  _id: 'pillars-singleton',
  _type: 'pillars',
  meta: {
    kicker: '05 · Pilares',
    title: 'Conteúdo editorial válido',
  },
  items: Array.from({ length: 4 }, (_, index) => ({
    _key: `item-${index + 1}`,
    title: `Pilar ${index + 1}`,
    description: `Descrição editorial ${index + 1}`,
  })),
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('resolução editorial de Pilares', () => {
  it('não executa leitura quando Draft Mode está desligado', async () => {
    const fetchPillars = vi.fn()
    const { resolveEditorialPillars } = await import('@/sanity/editorial/pillars')

    const result = await resolveEditorialPillars(false, fetchPillars)

    expect(fetchPillars).not.toHaveBeenCalled()
    expect(result.content).toBe(pillarsFallback)
    expect(result.source).toBe('fallback')
  })

  it('usa fallback seguro quando a configuração editorial está ausente', async () => {
    const { resolveEditorialPillars } = await import('@/sanity/editorial/pillars')

    const result = await resolveEditorialPillars(true)

    expect(result.content).toBe(pillarsFallback)
    expect(result.source).toBe('unavailable')
    expect(result.reason).toBe('configuration-unavailable')
  })

  it.each([
    ['documento inexistente', null],
    ['documento vazio', {}],
    ['tipo inesperado', { ...validDocument, _type: 'faq' }],
    ['ID inesperado', { ...validDocument, _id: 'outro-documento' }],
    ['metadados incompletos', { ...validDocument, meta: { kicker: '' } }],
    ['array vazio', { ...validDocument, items: [] }],
    [
      'item inválido',
      {
        ...validDocument,
        items: validDocument.items.map((item, index) =>
          index === 2 ? { ...item, description: '' } : item,
        ),
      },
    ],
  ])('usa fallback integral para %s', async (_label, document) => {
    const { resolveEditorialPillars } = await import('@/sanity/editorial/pillars')

    const result = await resolveEditorialPillars(true, vi.fn().mockResolvedValue(document))

    expect(result.content).toBe(pillarsFallback)
    expect(result.source).toBe('fallback')
  })

  it('usa fallback e registra somente mensagem sanitizada em erro de autenticação ou rede', async () => {
    const error = new Error('token-privado-de-teste')
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const { resolveEditorialPillars } = await import('@/sanity/editorial/pillars')

    const result = await resolveEditorialPillars(true, vi.fn().mockRejectedValue(error))

    expect(result.content).toBe(pillarsFallback)
    expect(result.reason).toBe('request-failed')
    expect(consoleError).toHaveBeenCalledWith(
      '[Preview editorial] Leitura de Pilares indisponível; usando fallback seguro.',
    )
    expect(consoleError.mock.calls.flat().join(' ')).not.toContain(error.message)
  })

  it('aceita a seção remota inteira e preserva metadados de origem', async () => {
    const fetchPillars = vi.fn().mockResolvedValue(validDocument)
    const { EDITORIAL_PILLARS_QUERY, resolveEditorialPillars } = await import(
      '@/sanity/editorial/pillars'
    )

    const result = await resolveEditorialPillars(true, fetchPillars)

    expect(fetchPillars).toHaveBeenCalledOnce()
    expect(fetchPillars).toHaveBeenCalledWith(EDITORIAL_PILLARS_QUERY)
    expect(result.source).toBe('sanity')
    expect(result.content._id).toBe('pillars-singleton')
    expect(result.content._type).toBe('pillars')
    expect(result.content.items.map((item) => item._key)).toEqual(
      validDocument.items.map((item) => item._key),
    )
    expect(result.content.items).not.toContainEqual(expect.objectContaining(pillarsFallback.items[0]))
  })
})

describe('isolamento e contrato da camada editorial', () => {
  it('usa o singleton exato e preserva _id, _type e _key na query', () => {
    const source = readFileSync('src/sanity/editorial/pillars.ts', 'utf8')

    expect(source).toContain('*[_id == "pillars-singleton"][0]')
    expect(source).toMatch(/\n\s+_id,/)
    expect(source).toMatch(/\n\s+_type,/)
    expect(source).toMatch(/\n\s+_key,/)
  })

  it('configura drafts, sem CDN, com stega e sem cache apenas no cliente editorial', () => {
    const source = readFileSync('src/sanity/editorial/home.ts', 'utf8')
    const client = readFileSync('src/sanity/editorial/client.server.ts', 'utf8')

    expect(client).toContain("perspective: 'drafts'")
    expect(client).toContain('useCdn: false')
    expect(client).toContain('enabled: true')
    expect(source).toContain('createEditorialClient({ stega: true })')
    expect(source).toContain("cache: 'no-store'")
  })

  it('é server-only, não exporta cliente e não oferece operação de escrita', () => {
    const source = readFileSync('src/sanity/editorial/home.ts', 'utf8')

    expect(source.startsWith("import 'server-only'")).toBe(true)
    expect(source).not.toMatch(/export\s+const\s+client/)
    expect(source).not.toContain('.mutate(')
    expect(source).not.toContain('.create(')
    expect(source).not.toContain('.createOrReplace(')
    expect(source).not.toContain('.patch(')
    expect(source).not.toContain('.delete(')
  })

  it('não depende da flag pública nem altera as queries legadas', () => {
    const editorial = readFileSync('src/sanity/editorial/home.ts', 'utf8')
    const publicPage = readFileSync('src/app/(marketing)/page.tsx', 'utf8')
    const home = readFileSync('src/components/home/home-composition.tsx', 'utf8')

    expect(editorial).not.toContain('NEXT_PUBLIC_SANITY_CONTENT_ENABLED')
    expect(publicPage).not.toContain('@/sanity/')
    expect(home).not.toContain('@/sanity/')
  })

  it('conecta a Home inteira no caminho editorial', () => {
    const previewPage = readFileSync(
      'src/app/(marketing)/editorial-internal/home/page.tsx',
      'utf8',
    )

    expect(previewPage).toContain('resolveEditorialHome')
    expect(previewPage).toContain('<HomeComposition content={home.content} />')
  })

  it('mantém o token fora de componentes cliente e da composição pública', () => {
    const clientFiles = [
      'src/components/editorial/editorial-preview-indicator.tsx',
      'src/components/home/home-composition.tsx',
      'src/components/sections/pillars/pillars.tsx',
    ].map((path) => readFileSync(path, 'utf8')).join('\n')

    expect(clientFiles).not.toContain('SANITY_API_READ_TOKEN')
    expect(clientFiles).not.toContain('token-privado-de-teste')
  })

  it('faz Draft Mode no servidor ser a autoridade da rota editorial', () => {
    const source = readFileSync(
      'src/app/(marketing)/editorial-internal/home/page.tsx',
      'utf8',
    )

    expect(source).toContain("import { draftMode } from 'next/headers'")
    expect(source).toContain('if (!isEnabled) notFound()')
    expect(source).toContain('resolveEditorialHome(true)')
  })

  it('oferece as três mensagens editoriais sem detalhes técnicos', () => {
    const source = readFileSync(
      'src/components/editorial/editorial-preview-indicator.tsx',
      'utf8',
    )

    expect(source).toContain('Prévia editorial — conteúdo do painel')
    expect(source).toContain('Prévia editorial — usando versão segura do site')
    expect(source).toContain('Prévia editorial — painel temporariamente indisponível')
    expect(source).toContain('O público não está vendo esta versão')
    expect(source).not.toContain('SANITY_API_READ_TOKEN')
  })
})
