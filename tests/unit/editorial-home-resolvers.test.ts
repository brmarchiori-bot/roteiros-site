import { readFileSync } from 'node:fs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { pillars as pillarsFallback } from '@/content'

vi.mock('server-only', () => ({}))
vi.mock('next-sanity', () => ({
  createClient: vi.fn(),
  stegaClean: (value: string) => value.replace(/::stega$/, ''),
}))

const allowedPillars = new Set(['pillars'] as const)
const validPillars = {
  _id: 'pillars-singleton',
  _type: 'pillars',
  meta: { kicker: '04 · Forma de olhar', title: 'Quatro pilares' },
  items: Array.from({ length: 4 }, (_, index) => ({
    _key: `pilar-${index + 1}`,
    title: `Título ${index + 1}`,
    description: `Descrição ${index + 1}`,
  })),
}

beforeEach(() => vi.restoreAllMocks())

describe('resolvers editoriais seguros por seção', () => {
  it('bloqueia Hero, Agora, História e FAQ antigos por padrão sem consultá-los', async () => {
    const fetch = vi.fn().mockResolvedValue([])
    const { resolveEditorialHome } = await import('@/sanity/editorial/home')
    const result = await resolveEditorialHome(true, { fetch })

    for (const section of ['hero', 'now', 'about', 'faq'] as const) {
      expect(result.sections[section].source).toBe('fallback')
      expect(result.sections[section].reason).toBe('not-authorized')
    }
    const params = fetch.mock.calls[0][1] as { ids: string[] }
    expect(params.ids).not.toContain('hero-singleton')
    expect(params.ids).not.toContain('now-singleton')
    expect(params.ids).not.toContain('about-singleton')
    expect(params.ids).not.toContain('faq-singleton')
  })

  it('usa documento autorizado somente quando ele é integralmente válido', async () => {
    const { resolveEditorialHome } = await import('@/sanity/editorial/home')
    const result = await resolveEditorialHome(true, {
      allowlist: allowedPillars,
      fetch: vi.fn().mockResolvedValue([validPillars]),
    })

    expect(result.sections.pillars.source).toBe('sanity')
    expect(result.sections.pillars.content._id).toBe('pillars-singleton')
    expect(result.sections.pillars.content._type).toBe('pillars')
    expect(result.sections.pillars.content.items.map((item) => item._key)).toEqual(
      validPillars.items.map((item) => item._key),
    )
  })

  it.each([
    ['parcial', { ...validPillars, meta: { kicker: '' } }],
    ['vazio', { ...validPillars, items: [] }],
    ['item sem chave', { ...validPillars, items: validPillars.items.map((item, index) => index ? item : { ...item, _key: '' }) }],
  ])('usa fallback integral para documento %s', async (_label, document) => {
    const { resolveEditorialHome } = await import('@/sanity/editorial/home')
    const result = await resolveEditorialHome(true, {
      allowlist: allowedPillars,
      fetch: vi.fn().mockResolvedValue([document]),
    })
    expect(result.sections.pillars.content).toBe(pillarsFallback)
    expect(result.sections.pillars.source).toBe('invalid')
    expect(result.sections.pillars.reason).toBe('document-invalid')
  })

  it('usa fallback integral quando documento está ausente', async () => {
    const { resolveEditorialHome } = await import('@/sanity/editorial/home')
    const result = await resolveEditorialHome(true, {
      allowlist: allowedPillars,
      fetch: vi.fn().mockResolvedValue([]),
    })
    expect(result.sections.pillars.content).toBe(pillarsFallback)
    expect(result.sections.pillars.reason).toBe('document-missing')
  })

  it('calcula origem independente e composição mista no servidor', async () => {
    const { resolveEditorialHome } = await import('@/sanity/editorial/home')
    const result = await resolveEditorialHome(true, {
      allowlist: allowedPillars,
      fetch: vi.fn().mockResolvedValue([validPillars]),
    })
    expect(result.sections.pillars.source).toBe('sanity')
    expect(result.sections.hero.source).toBe('fallback')
    expect(result.source).toBe('mixed')
  })

  it('limpa enums com stega sem limpar textos editoriais', async () => {
    const { resolveEditorialHome } = await import('@/sanity/editorial/home')
    const heroDocument = {
      _id: 'hero-singleton', _type: 'hero',
      meta: { kicker: 'Texto::stega' }, headline: 'Título::stega', subheadline: 'Apoio::stega',
      primaryCta: { label: 'Abrir::stega', href: '#now::stega' },
      contentWidth: 'wide::stega',
    }
    const result = await resolveEditorialHome(true, {
      allowlist: new Set(['hero']), fetch: vi.fn().mockResolvedValue([heroDocument]),
    })
    expect(result.sections.hero.content.headline).toBe('Título::stega')
    expect(result.sections.hero.content.layout?.contentWidth).toBe('wide')
    expect(result.sections.hero.content.ctas.primary.href).toBe('#now')
  })
})

describe('fronteira pública', () => {
  it('nenhuma seção visual consulta o Sanity e Pilares usa fallback direto', () => {
    const files = [
      'hero/hero.tsx', 'now/now.tsx', 'about/about.tsx', 'pillars/pillars.tsx',
      'content-bridge/content-bridge.tsx', 'partnerships/partnerships.tsx',
    ].map((name) => readFileSync(`src/components/sections/${name}`, 'utf8')).join('\n')
    expect(files).not.toContain('@/sanity/queries')
    expect(files).not.toMatch(/get[A-Za-z]+FromSanity/)
    expect(readFileSync('src/components/sections/pillars/pillars.tsx', 'utf8')).toContain(
      'content ?? pillarsFallback',
    )
  })

  it('allowlist é server-only e não usa variável pública', () => {
    const source = readFileSync('src/sanity/editorial/home.ts', 'utf8')
    expect(source.startsWith("import 'server-only'")).toBe(true)
    expect(source).toContain('SANITY_EDITORIAL_ALLOWED_SECTIONS')
    expect(source).not.toContain('NEXT_PUBLIC_SANITY_EDITORIAL')
  })

  it('initial values não possuem undefined nem campo removido de Pilares', async () => {
    const values = await import('@/sanity/initial-values')
    const visit = (value: unknown): boolean => {
      if (value === undefined) return false
      if (Array.isArray(value)) return value.every(visit)
      if (value && typeof value === 'object') return Object.values(value).every(visit)
      return true
    }
    expect(Object.values(values).every(visit)).toBe(true)
    expect(JSON.stringify(values.initialPillars)).not.toContain('"href"')
  })
})
