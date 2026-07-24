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

export function shouldShowEditorialPreview(isEnabled: boolean): boolean {
  return isEnabled
}
