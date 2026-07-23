import { describe, expect, it } from 'vitest'
import { validateLeadSubmission } from '@/lib/forms/lead'

describe('validateLeadSubmission', () => {
  it('normaliza uma inscrição válida sem depender de provedor', () => {
    const result = validateLeadSubmission({
      email: '  Pessoa@Exemplo.com ',
      purpose: 'newsletter',
      consent: true,
      interests: ['caderno', ' caderno ', 'jornada'],
      companyWebsite: '',
    })

    expect(result).toEqual({
      ok: true,
      data: {
        email: 'pessoa@exemplo.com',
        purpose: 'newsletter',
        consent: true,
        interests: ['caderno', 'jornada'],
        companyWebsite: '',
      },
    })
  })

  it('rejeita email inválido', () => {
    expect(
      validateLeadSubmission({
        email: 'sem-arroba',
        purpose: 'newsletter',
        consent: true,
      }),
    ).toMatchObject({ ok: false, code: 'invalid_email' })
  })

  it('exige consentimento explícito', () => {
    expect(
      validateLeadSubmission({
        email: 'pessoa@example.com',
        purpose: 'newsletter',
        consent: false,
      }),
    ).toMatchObject({ ok: false, code: 'consent_required' })
  })

  it('rejeita o honeypot preenchido sem registrar o valor', () => {
    expect(
      validateLeadSubmission({
        email: 'bot@example.com',
        purpose: 'interest',
        consent: true,
        companyWebsite: 'https://spam.example',
      }),
    ).toEqual({
      ok: false,
      code: 'spam_detected',
      message: 'Não foi possível processar a solicitação.',
    })
  })
})
