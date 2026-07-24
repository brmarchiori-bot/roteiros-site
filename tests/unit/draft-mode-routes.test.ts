import { readFileSync } from 'node:fs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const enable = vi.fn()
const disable = vi.fn()
let isEnabled = false

vi.mock('server-only', () => ({}))
vi.mock('next/headers', () => ({
  draftMode: vi.fn(async () => ({ enable, disable, isEnabled })),
}))

beforeEach(() => {
  vi.resetModules()
  enable.mockReset()
  disable.mockReset()
  isEnabled = false
  process.env.SANITY_PREVIEW_SECRET = 'segredo-de-teste'
  delete process.env.NEXT_PUBLIC_SANITY_CONTENT_ENABLED
})

afterEach(() => {
  delete process.env.SANITY_PREVIEW_SECRET
  delete process.env.NEXT_PUBLIC_SANITY_CONTENT_ENABLED
})

describe('rotas de Draft Mode', () => {
  it('rejeita ativação sem segredo e não habilita Preview', async () => {
    const { GET } = await import('@/app/api/draft-mode/enable/route')
    const response = await GET(
      new Request('https://menosroteiros.com.br/api/draft-mode/enable'),
    )

    expect(response.status).toBe(401)
    expect(enable).not.toHaveBeenCalled()
    expect(await response.text()).not.toContain('segredo-de-teste')
  })

  it('rejeita segredo incorreto', async () => {
    const { GET } = await import('@/app/api/draft-mode/enable/route')
    const response = await GET(
      new Request(
        'https://menosroteiros.com.br/api/draft-mode/enable?secret=segredo-de-teste',
        { headers: { authorization: 'Bearer incorreto' } },
      ),
    )

    expect(response.status).toBe(401)
    expect(enable).not.toHaveBeenCalled()
  })

  it('habilita uma sessão válida e aceita somente redirect interno permitido', async () => {
    const { GET } = await import('@/app/api/draft-mode/enable/route')
    const response = await GET(
      new Request(
        'https://menosroteiros.com.br/api/draft-mode/enable?redirectTo=%2Fstudio',
        { headers: { authorization: 'Bearer segredo-de-teste' } },
      ),
    )

    expect(enable).toHaveBeenCalledOnce()
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('https://menosroteiros.com.br/studio')
    expect(response.headers.get('cache-control')).toContain('no-store')
  })

  it('bloqueia open redirect mesmo em uma sessão válida', async () => {
    const { GET } = await import('@/app/api/draft-mode/enable/route')
    const response = await GET(
      new Request(
        'https://menosroteiros.com.br/api/draft-mode/enable?redirectTo=https%3A%2F%2Fdominio-malicioso.com',
        { headers: { authorization: 'Bearer segredo-de-teste' } },
      ),
    )

    expect(enable).toHaveBeenCalledOnce()
    expect(response.headers.get('location')).toBe('https://menosroteiros.com.br/')
  })

  it('desabilita a sessão por POST mesmo quando ela já está inativa', async () => {
    const { POST } = await import('@/app/api/draft-mode/disable/route')
    const response = await POST(
      new Request('https://menosroteiros.com.br/api/draft-mode/disable', {
        method: 'POST',
        body: new URLSearchParams({ redirectTo: '/' }),
      }),
    )

    expect(disable).toHaveBeenCalledOnce()
    expect(response.status).toBe(303)
    expect(response.headers.get('location')).toBe('https://menosroteiros.com.br/')
  })

  it('reporta somente o estado booleano da sessão', async () => {
    isEnabled = true
    const { GET } = await import('@/app/api/draft-mode/status/route')
    const response = await GET()

    expect(await response.json()).toEqual({ isEnabled: true })
    expect(response.headers.get('cache-control')).toContain('no-store')
  })
})

describe('isolamento do cliente', () => {
  it('não expõe variáveis privadas no componente cliente', () => {
    const source = readFileSync(
      'src/components/editorial/editorial-preview-indicator.tsx',
      'utf8',
    )

    expect(source).not.toContain('SANITY_PREVIEW_SECRET')
    expect(source).not.toContain('SANITY_API_READ_TOKEN')
    expect(source).not.toContain('process.env')
  })

  it('mantém a flag pública ausente e o cliente Sanity protegido', () => {
    const client = readFileSync('src/sanity/client.ts', 'utf8')
    const queries = readFileSync('src/sanity/queries.ts', 'utf8')
    const enableRoute = readFileSync(
      'src/app/api/draft-mode/enable/route.ts',
      'utf8',
    )

    expect(process.env.NEXT_PUBLIC_SANITY_CONTENT_ENABLED).toBeUndefined()
    expect(client).toContain('hasSanityContent')
    expect(queries).toContain('if (!sanityClient) return')
    expect(enableRoute).not.toContain('@/sanity/queries')
    expect(enableRoute).not.toContain('sanityClient')
  })
})
