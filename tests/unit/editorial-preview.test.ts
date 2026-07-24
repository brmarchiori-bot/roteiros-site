import { describe, expect, it } from 'vitest'
import {
  EDITORIAL_STATES,
  safeEditorialRedirect,
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

  it('exibe o indicador somente quando Draft Mode foi confirmado', () => {
    expect(shouldShowEditorialPreview(false)).toBe(false)
    expect(shouldShowEditorialPreview(true)).toBe(true)
  })
})
