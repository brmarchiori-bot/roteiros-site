import { afterEach, describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { proxy } from '@/proxy'

const originalEnv = {
  portfolio: process.env.PRIVATE_PORTFOLIO_SLUG,
  enabled: process.env.ENABLE_PASSWORD,
  user: process.env.BASIC_AUTH_USER,
  password: process.env.BASIC_AUTH_PASSWORD,
}

afterEach(() => {
  restore('PRIVATE_PORTFOLIO_SLUG', originalEnv.portfolio)
  restore('ENABLE_PASSWORD', originalEnv.enabled)
  restore('BASIC_AUTH_USER', originalEnv.user)
  restore('BASIC_AUTH_PASSWORD', originalEnv.password)
})

describe('proxy', () => {
  it('responde 404 para uma chave privada inválida', () => {
    process.env.PRIVATE_PORTFOLIO_SLUG = 'portfolio-teste-1234567890abcdef'
    process.env.ENABLE_PASSWORD = 'false'

    const response = proxy(
      new NextRequest('https://menosroteiros.com.br/portfolio/chave-invalida'),
    )

    expect(response.status).toBe(404)
    expect(response.headers.get('x-robots-tag')).toContain('noindex')
    expect(response.headers.get('cache-control')).toContain('no-store')
  })

  it('permite a chave privada válida com CSP e sem cache público', () => {
    const key = 'portfolio-teste-1234567890abcdef'
    process.env.PRIVATE_PORTFOLIO_SLUG = key
    process.env.ENABLE_PASSWORD = 'false'

    const response = proxy(
      new NextRequest(`https://menosroteiros.com.br/portfolio/${key}`),
    )

    expect(response.status).toBe(200)
    expect(response.headers.get('content-security-policy')).toContain("object-src 'none'")
    expect(response.headers.get('content-security-policy')).not.toContain("'unsafe-eval'")
  })

  it('falha fechado quando Basic Auth está ativo sem credenciais', () => {
    process.env.ENABLE_PASSWORD = 'true'
    delete process.env.BASIC_AUTH_USER
    delete process.env.BASIC_AUTH_PASSWORD

    const response = proxy(new NextRequest('https://menosroteiros.com.br/'))

    expect(response.status).toBe(401)
    expect(response.headers.get('www-authenticate')).toContain('Basic')
  })

  it('aceita credenciais Basic Auth válidas', () => {
    process.env.ENABLE_PASSWORD = 'true'
    process.env.BASIC_AUTH_USER = 'preview'
    process.env.BASIC_AUTH_PASSWORD = 'segredo'

    const response = proxy(
      new NextRequest('https://menosroteiros.com.br/', {
        headers: {
          authorization: `Basic ${Buffer.from('preview:segredo').toString('base64')}`,
        },
      }),
    )

    expect(response.status).toBe(200)
  })
})

function restore(key: string, value: string | undefined) {
  if (value === undefined) delete process.env[key]
  else process.env[key] = value
}
