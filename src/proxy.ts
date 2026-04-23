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
export function proxy(req: NextRequest) {
  // Toggle principal — se não tiver ENABLE_PASSWORD=true, libera tudo
  if (process.env.ENABLE_PASSWORD !== 'true') {
    return NextResponse.next()
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
        if (user === expectedUser && password === expectedPassword) {
          return NextResponse.next()
        }
      }
    } catch {
      // base64 malformado — cai no 401 abaixo
    }
  }

  return unauthorized()
}

function unauthorized() {
  return new NextResponse('Autenticação necessária', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Menos Roteiros (preview privado)"',
    },
  })
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
