import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'
import {
  readBearerToken,
  safeEditorialRedirect,
  secretsMatch,
} from '@/lib/editorial-preview'
import { editorialPreviewServerEnv } from '@/lib/editorial-preview.server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const configuredSecret = editorialPreviewServerEnv.previewSecret

  if (!configuredSecret) {
    return privateResponse('Prévia editorial indisponível.', 503)
  }

  const suppliedSecret = readBearerToken(request.headers.get('authorization'))
  if (!secretsMatch(suppliedSecret, configuredSecret)) {
    return privateResponse('Não foi possível iniciar a prévia editorial.', 401)
  }

  const draft = await draftMode()
  draft.enable()

  return privateRedirect(
    new URL(safeEditorialRedirect(requestUrl.searchParams.get('redirectTo')), requestUrl.origin),
  )
}

function privateResponse(message: string, status: number) {
  return new NextResponse(message, {
    status,
    headers: privateHeaders(),
  })
}

function privateRedirect(destination: URL) {
  const response = NextResponse.redirect(destination, 307)
  for (const [name, value] of Object.entries(privateHeaders())) {
    response.headers.set(name, value)
  }
  return response
}

function privateHeaders() {
  return {
    'Cache-Control': 'private, no-store, max-age=0',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    'Referrer-Policy': 'no-referrer',
  }
}
