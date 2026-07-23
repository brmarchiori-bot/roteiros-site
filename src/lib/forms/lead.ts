export type LeadPurpose = 'newsletter' | 'interest' | 'partnership'

export type LeadSubmission = {
  email: string
  purpose: LeadPurpose
  consent: boolean
  interests?: string[]
  message?: string
  /** Campo invisível para bots. Uma submissão humana deve enviá-lo vazio. */
  companyWebsite?: string
}

export type ValidLeadSubmission = Omit<LeadSubmission, 'email' | 'interests' | 'message'> & {
  email: string
  interests: string[]
  message?: string
}

export type LeadValidationResult =
  | { ok: true; data: ValidLeadSubmission }
  | {
      ok: false
      code: 'invalid_email' | 'consent_required' | 'spam_detected' | 'invalid_payload'
      message: string
    }

export type LeadProviderResult =
  | { ok: true; reference?: string }
  | { ok: false; retryable: boolean; message: string }

/**
 * Contrato independente de fornecedor. Brevo, Loops, Resend ou outro adaptador
 * deve implementar esta interface sem contaminar componentes ou rotas.
 */
export interface LeadProvider {
  subscribe(submission: ValidLeadSubmission): Promise<LeadProviderResult>
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_EMAIL_LENGTH = 254
const MAX_MESSAGE_LENGTH = 2000
const MAX_INTERESTS = 20

export function validateLeadSubmission(input: unknown): LeadValidationResult {
  if (!input || typeof input !== 'object') {
    return invalid('invalid_payload', 'Dados inválidos.')
  }

  const raw = input as Partial<LeadSubmission>
  if (raw.companyWebsite?.trim()) {
    return invalid('spam_detected', 'Não foi possível processar a solicitação.')
  }

  const email = typeof raw.email === 'string' ? raw.email.trim().toLowerCase() : ''
  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return invalid('invalid_email', 'Informe um email válido.')
  }

  if (raw.consent !== true) {
    return invalid('consent_required', 'Confirme o consentimento para continuar.')
  }

  if (!isLeadPurpose(raw.purpose)) {
    return invalid('invalid_payload', 'Finalidade inválida.')
  }

  const message = typeof raw.message === 'string' ? raw.message.trim() : ''
  if (message.length > MAX_MESSAGE_LENGTH) {
    return invalid('invalid_payload', 'A mensagem ultrapassa o limite permitido.')
  }

  const interests = Array.isArray(raw.interests)
    ? raw.interests
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, MAX_INTERESTS)
    : []

  return {
    ok: true,
    data: {
      email,
      purpose: raw.purpose,
      consent: true,
      interests: [...new Set(interests)],
      message: message || undefined,
      companyWebsite: '',
    },
  }
}

function isLeadPurpose(value: unknown): value is LeadPurpose {
  return value === 'newsletter' || value === 'interest' || value === 'partnership'
}

function invalid(
  code: Extract<LeadValidationResult, { ok: false }>['code'],
  message: string,
): LeadValidationResult {
  return { ok: false, code, message }
}
