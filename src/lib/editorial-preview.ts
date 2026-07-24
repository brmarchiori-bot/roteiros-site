export const EDITORIAL_STATES = {
  siteCurrent: 'site-current',
  sanityPublished: 'sanity-published',
  sanityDraft: 'sanity-draft',
} as const

export type EditorialState = (typeof EDITORIAL_STATES)[keyof typeof EDITORIAL_STATES]

const SAFE_REDIRECTS = new Set(['/', '/studio'])

export function safeEditorialRedirect(value: string | null | undefined): string {
  if (!value) return '/'

  try {
    const decoded = decodeURIComponent(value)
    if (!decoded.startsWith('/') || decoded.startsWith('//')) return '/'
    return SAFE_REDIRECTS.has(decoded) ? decoded : '/'
  } catch {
    return '/'
  }
}

export function secretsMatch(received: string | null, expected: string | undefined): boolean {
  if (!received || !expected) return false

  const size = Math.max(received.length, expected.length)
  let difference = received.length ^ expected.length

  for (let index = 0; index < size; index += 1) {
    difference |=
      (received.charCodeAt(index) || 0) ^ (expected.charCodeAt(index) || 0)
  }

  return difference === 0
}

export function readBearerToken(authorization: string | null): string | null {
  if (!authorization?.startsWith('Bearer ')) return null
  const token = authorization.slice('Bearer '.length)
  return token.length > 0 ? token : null
}

export function shouldShowEditorialPreview(isEnabled: boolean): boolean {
  return isEnabled
}
