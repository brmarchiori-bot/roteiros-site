import { readFileSync } from 'node:fs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  available: true,
  enabled: false,
  enable: vi.fn(),
  disable: vi.fn(),
}))

vi.mock('server-only', () => ({}))
vi.mock('@/sanity/editorial/client.server', () => ({
  createEditorialClient: () => (state.available ? { fetch: vi.fn() } : null),
}))
vi.mock('next-sanity/draft-mode', () => ({
  defineEnableDraftMode: () => ({
    GET: async (request: Request) => {
      const url = new URL(request.url)
      if (url.searchParams.get('sanity-preview-secret') !== 'segredo-oficial-de-teste') {
        return new Response('Invalid secret', { status: 401 })
      }
      state.enable()
      const redirectTo = url.searchParams.get('sanity-preview-pathname') || '/'
      const safeRedirect = redirectTo === '/' || redirectTo === '/studio' ? redirectTo : '/'
      return Response.redirect(new URL(safeRedirect, url.origin), 307)
    },
  }),
}))
vi.mock('next/headers', () => ({
  draftMode: vi.fn(async () => ({
    enable: state.enable,
    disable: state.disable,
    isEnabled: state.enabled,
  })),
}))

beforeEach(() => {
  vi.resetModules()
  state.available = true
  state.enabled = false
  state.enable.mockReset()
  state.disable.mockReset()
  delete process.env.NEXT_PUBLIC_SANITY_CONTENT_ENABLED
})

afterEach(() => {
  delete process.env.NEXT_PUBLIC_SANITY_CONTENT_ENABLED
})

describe('rotas de Draft Mode', () => {
  it('rejeita requisição sem segredo oficial', async () => {
    const { GET } = await import('@/app/api/draft-mode/enable/route')
    const response = await GET(
      new Request('https://menosroteiros.com.br/api/draft-mode/enable'),
    )

    expect(response.status).toBe(401)
    expect(state.enable).not.toHaveBeenCalled()
  })

  it('rejeita segredo oficial inválido', async () => {
    const { GET } = await import('@/app/api/draft-mode/enable/route')
    const response = await GET(
      new Request(
        'https://menosroteiros.com.br/api/draft-mode/enable?sanity-preview-secret=invalido',
      ),
    )

    expect(response.status).toBe(401)
    expect(state.enable).not.toHaveBeenCalled()
  })

  it('habilita sessão validada pelo fluxo oficial', async () => {
    const { GET } = await import('@/app/api/draft-mode/enable/route')
    const response = await GET(
      new Request(
        'https://menosroteiros.com.br/api/draft-mode/enable?sanity-preview-secret=segredo-oficial-de-teste&sanity-preview-pathname=%2F',
      ),
    )

    expect(state.enable).toHaveBeenCalledOnce()
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('https://menosroteiros.com.br/')
  })

  it('falha de forma controlada quando o cliente Viewer não está disponível', async () => {
    state.available = false
    const { GET } = await import('@/app/api/draft-mode/enable/route')
    const response = await GET(
      new Request('https://menosroteiros.com.br/api/draft-mode/enable'),
    )

    expect(response.status).toBe(503)
    expect(response.headers.get('cache-control')).toContain('no-store')
    expect(state.enable).not.toHaveBeenCalled()
  })

  it('desabilita a sessão por POST', async () => {
    const { POST } = await import('@/app/api/draft-mode/disable/route')
    const response = await POST(
      new Request('https://menosroteiros.com.br/api/draft-mode/disable', {
        method: 'POST',
        body: new URLSearchParams({ redirectTo: '/' }),
      }),
    )

    expect(state.disable).toHaveBeenCalledOnce()
    expect(response.status).toBe(303)
  })

  it('reporta somente o estado booleano da sessão', async () => {
    state.enabled = true
    const { GET } = await import('@/app/api/draft-mode/status/route')
    const response = await GET()

    expect(await response.json()).toEqual({ isEnabled: true })
    expect(response.headers.get('cache-control')).toContain('no-store')
  })
})

describe('isolamento do cliente', () => {
  it('registra o helper oficial e não mantém autenticação Bearer concorrente', () => {
    const source = readFileSync('src/app/api/draft-mode/enable/route.ts', 'utf8')

    expect(source).toContain("from 'next-sanity/draft-mode'")
    expect(source).toContain('defineEnableDraftMode')
    expect(source).not.toContain('authorization')
    expect(source).not.toContain('Bearer')
    expect(source).not.toContain('SANITY_PREVIEW_SECRET')
  })

  it('não expõe variáveis privadas no indicador cliente', () => {
    const source = readFileSync(
      'src/components/editorial/editorial-preview-indicator.tsx',
      'utf8',
    )

    expect(source).not.toContain('SANITY_PREVIEW_SECRET')
    expect(source).not.toContain('SANITY_API_READ_TOKEN')
    expect(source).not.toContain('process.env')
  })

  it('mantém a flag pública ausente e as queries públicas protegidas', () => {
    const client = readFileSync('src/sanity/client.ts', 'utf8')
    const queries = readFileSync('src/sanity/queries.ts', 'utf8')

    expect(process.env.NEXT_PUBLIC_SANITY_CONTENT_ENABLED).toBeUndefined()
    expect(client).toContain('hasSanityContent')
    expect(queries).toContain('if (!sanityClient) return')
  })
})
