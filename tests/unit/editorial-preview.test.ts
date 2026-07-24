import { describe, expect, it } from 'vitest'
import {
  EDITORIAL_STATES,
  readBearerToken,
  safeEditorialRedirect,
  secretsMatch,
  shouldShowEditorialPreview,
} from '@/lib/editorial-preview'

describe('contrato editorial', () => {
  it('mantém os três estados conceituais explícitos', () => {
    expect(EDITORIAL_STATES).toEqual({
      siteCurrent: 'site-current',
      sanityPublished: 'sanity-published',
      sanityDraft: 'sanity-draft',
    })
  })

  it.each([
    ['/', '/'],
    ['/studio', '/studio'],
    ['%2Fstudio', '/studio'],
    ['', '/'],
    ['https://dominio-malicioso.com', '/'],
    ['//dominio-malicioso.com', '/'],
    ['%2F%2Fdominio-malicioso.com', '/'],
    ['javascript:alert(1)', '/'],
    ['/conteudo', '/'],
    ['%252Fstudio', '/'],
  ])('normaliza o destino %s para %s', (input, expected) => {
    expect(safeEditorialRedirect(input)).toBe(expected)
  })

  it('aceita apenas o segredo completo correto', () => {
    expect(secretsMatch('segredo-editorial', 'segredo-editorial')).toBe(true)
    expect(secretsMatch('segredo-incorreto', 'segredo-editorial')).toBe(false)
    expect(secretsMatch(null, 'segredo-editorial')).toBe(false)
    expect(secretsMatch('segredo-editorial', undefined)).toBe(false)
  })

  it('aceita o segredo somente no formato Bearer', () => {
    expect(readBearerToken('Bearer segredo-editorial')).toBe('segredo-editorial')
    expect(readBearerToken('Basic segredo-editorial')).toBeNull()
    expect(readBearerToken('Bearer ')).toBeNull()
    expect(readBearerToken(null)).toBeNull()
  })

  it('exibe o indicador somente quando Draft Mode foi confirmado', () => {
    expect(shouldShowEditorialPreview(false)).toBe(false)
    expect(shouldShowEditorialPreview(true)).toBe(true)
  })
})
