import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'
import { safeEditorialRedirect } from '@/lib/editorial-preview'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const draft = await draftMode()
  draft.disable()

  const formData = await request.formData()
  const redirectTo = safeEditorialRedirect(formData.get('redirectTo')?.toString())
  const response = NextResponse.redirect(new URL(redirectTo, request.url), 303)
  response.headers.set('Cache-Control', 'private, no-store, max-age=0')
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
  return response
}
