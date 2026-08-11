import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Proxy (ex-middleware) do Next.js 16.
 *
 * Protege o site inteiro com Basic Auth quando ENABLE_PASSWORD === 'true'.
 * /studio fica DE FORA — Sanity Studio segue acessível.
 *
 * Para desativar: basta remover/mudar ENABLE_PASSWORD na Vercel.
 * Nenhum outro arquivo precisa mudar.
 */
export async function proxy(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/portfolio/')) {
    const configuredKey = process.env.PRIVATE_PORTFOLIO_SLUG ?? ''
    const expectedPath = `/portfolio/${configuredKey}`

    if (configuredKey.length < 24 || !constantTimeEqual(req.nextUrl.pathname, expectedPath)) {
      return secureResponse(new NextResponse('Não encontrado', {
        status: 404,
        headers: {
          'X-Robots-Tag': 'noindex, nofollow, noarchive, noimageindex',
          'Cache-Control': 'private, no-store, max-age=0',
        },
      }))
    }
  }

  // Toggle principal — se não tiver ENABLE_PASSWORD=true, libera tudo
  if (process.env.ENABLE_PASSWORD !== 'true') {
    return routeEditorialPreview(req)
  }

  const expectedUser = process.env.BASIC_AUTH_USER ?? ''
  const expectedPassword = process.env.BASIC_AUTH_PASSWORD ?? ''

  // Falha segura: se as credenciais não estiverem configuradas no ambiente,
  // ninguém passa (em vez de abrir o site por engano)
  if (!expectedUser || !expectedPassword) {
    return unauthorized()
  }

  const auth = req.headers.get('authorization')
  if (auth?.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6))
      const sep = decoded.indexOf(':')
      if (sep !== -1) {
        const user = decoded.slice(0, sep)
        const password = decoded.slice(sep + 1)
        if (
          constantTimeEqual(user, expectedUser) &&
          constantTimeEqual(password, expectedPassword)
        ) {
          return routeEditorialPreview(req)
        }
      }
    } catch {
      // base64 malformado — cai no 401 abaixo
    }
  }

  return secureResponse(unauthorized())
}

async function routeEditorialPreview(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/portfolio/')) {
    const configuredKey = process.env.PRIVATE_PORTFOLIO_SLUG ?? ''
    const expectedPath = `/portfolio/${configuredKey}`
    if (configuredKey.length < 24 || !constantTimeEqual(req.nextUrl.pathname, expectedPath)) {
      return secureResponse(new NextResponse('Não encontrado', { status: 404 }))
    }

    const destination = req.nextUrl.clone()
    destination.pathname = '/portfolio'
    const response = NextResponse.redirect(destination)
    response.cookies.set('__portfolio_access', await privateAccessToken(configuredKey), {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/portfolio',
    })
    response.headers.set('Cache-Control', 'private, no-store, max-age=0')
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, noimageindex')
    return secureResponse(response)
  }

  if (req.nextUrl.pathname === '/portfolio') {
    const configuredKey = process.env.PRIVATE_PORTFOLIO_SLUG ?? ''
    const suppliedToken = req.cookies.get('__portfolio_access')?.value ?? ''
    const expectedToken = configuredKey.length >= 24 ? await privateAccessToken(configuredKey) : ''
    if (!expectedToken || !constantTimeEqual(suppliedToken, expectedToken)) {
      return secureResponse(new NextResponse('Não encontrado', {
        status: 404,
        headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive, noimageindex', 'Cache-Control': 'private, no-store, max-age=0' },
      }))
    }

    const destination = req.nextUrl.clone()
    destination.pathname = '/portfolio/view'
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-private-portfolio-auth', expectedToken)
    const response = NextResponse.rewrite(destination, { request: { headers: requestHeaders } })
    response.headers.set('Cache-Control', 'private, no-store, max-age=0')
    response.headers.set('CDN-Cache-Control', 'no-store')
    response.headers.set('Vercel-CDN-Cache-Control', 'no-store')
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, noimageindex')
    return secureResponse(response)
  }

  if (req.nextUrl.pathname.startsWith('/editorial-internal/')) {
    if (req.headers.get('x-editorial-internal-rewrite') === '1') {
      const response = NextResponse.next()
      response.headers.set('Cache-Control', 'private, no-store, max-age=0')
      response.headers.set('CDN-Cache-Control', 'no-store')
      response.headers.set('Vercel-CDN-Cache-Control', 'no-store')
      response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
      return secureResponse(response)
    }
    return secureResponse(new NextResponse('Não encontrado', { status: 404 }))
  }

  if (req.nextUrl.pathname === '/' && req.cookies.has('__prerender_bypass')) {
    const destination = req.nextUrl.clone()
    destination.pathname = '/editorial-internal/home'
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-editorial-internal-rewrite', '1')
    const response = NextResponse.rewrite(destination, {
      request: { headers: requestHeaders },
    })
    response.headers.set('Cache-Control', 'private, no-store, max-age=0')
    response.headers.set('CDN-Cache-Control', 'no-store')
    response.headers.set('Vercel-CDN-Cache-Control', 'no-store')
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
    return secureResponse(response)
  }

  return secureResponse(NextResponse.next())
}

async function privateAccessToken(key: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`menos-roteiro:${key}`))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function unauthorized() {
  return new NextResponse('Autenticação necessária', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Menos Roteiros (preview privado)"',
    },
  })
}

const isVercelPreview = process.env.VERCEL_ENV === 'preview'
const vercelPreviewSource = isVercelPreview ? ' https://vercel.live' : ''
const developmentEvalSource = process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${developmentEvalSource} https://va.vercel-scripts.com${vercelPreviewSource}`,
  `style-src 'self' 'unsafe-inline'${vercelPreviewSource}`,
  `img-src 'self' data: blob: https://cdn.sanity.io${isVercelPreview ? ' https://vercel.live https://vercel.com' : ''}`,
  `font-src 'self' data:${isVercelPreview ? ' https://assets.vercel.com' : ''}`,
  `connect-src 'self' https://*.sanity.io https://*.apicdn.sanity.io https://vitals.vercel-insights.com https://*.vercel-insights.com${isVercelPreview ? ' https://vercel.live wss://ws-us3.pusher.com' : ''}`,
  "media-src 'self' blob: https:",
  `frame-src https://www.youtube-nocookie.com https://player.vimeo.com${vercelPreviewSource}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join('; ')

function secureResponse(response: NextResponse) {
  response.headers.set('Content-Security-Policy', CONTENT_SECURITY_POLICY)
  return response
}

function constantTimeEqual(left: string, right: string) {
  const size = Math.max(left.length, right.length)
  let difference = left.length ^ right.length

  for (let index = 0; index < size; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0)
  }

  return difference === 0
}

export const config = {
  /**
   * Roda em TODAS as rotas EXCETO:
   *  - /studio*   → Sanity Studio precisa ficar livre
   *  - /api/*     → API routes (nenhuma usada hoje, mas previne surpresa)
   *  - /_next/static, /_next/image → assets do Next
   *  - /favicon, /apple-icon, /icon, /manifest, /opengraph-image, /robots, /sitemap → metadata
   *  - /_vercel   → internals da Vercel
   */
  matcher: [
    '/((?!studio|api|_next/static|_next/image|favicon.ico|apple-icon|icon|manifest|robots|sitemap|opengraph-image|_vercel).*)',
  ],
}
