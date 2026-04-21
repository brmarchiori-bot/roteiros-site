import { ImageResponse } from 'next/og'
import { now } from '@/content/now'
import { siteConfig } from '@/content/site.config'

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Open Graph image — gerada em build time pelo Next.
 * Aparece quando o link do site é compartilhado (WhatsApp, IG, Twitter, e-mail).
 *
 * Uso de Georgia (system serif) por simplicidade — para upgrade pra Fraunces:
 *   1. Baixar fraunces-500.ttf de fonts.google.com
 *   2. Salvar em src/app/fraunces.ttf
 *   3. await fetch(new URL('./fraunces.ttf', import.meta.url)).then(r => r.arrayBuffer())
 *   4. Passar como `fonts: [{ name: 'Fraunces', data, weight: 500 }]` no ImageResponse
 *   5. Trocar fontFamily abaixo de 'Georgia' pra 'Fraunces'
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'radial-gradient(900px 700px at 75% 25%, rgba(196,81,42,0.14), transparent 60%), radial-gradient(700px 600px at 15% 85%, rgba(61,74,43,0.10), transparent 55%), #F3EEE5',
          padding: '70px 90px',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Topo — brand + URL */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <p
            style={{
              fontSize: 18,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#0E0E0D',
              fontFamily: 'monospace',
              margin: 0,
            }}
          >
            {siteConfig.name}
          </p>
          <p
            style={{
              fontSize: 16,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: '#C4512A',
              fontFamily: 'monospace',
              margin: 0,
            }}
          >
            menosroteiros.com.br
          </p>
        </div>

        {/* Centro — tagline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1
            style={{
              fontSize: 88,
              lineHeight: 1.04,
              color: '#0E0E0D',
              margin: 0,
              maxWidth: 980,
              fontWeight: 500,
            }}
          >
            {siteConfig.tagline}
          </h1>
        </div>

        {/* Rodapé — short tagline + journey marker */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            width: '100%',
          }}
        >
          <p
            style={{
              fontSize: 24,
              color: '#8A8175',
              margin: 0,
              maxWidth: 600,
              fontStyle: 'italic',
            }}
          >
            {siteConfig.shortTagline}
          </p>
          <p
            style={{
              fontSize: 16,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: '#8A8175',
              fontFamily: 'monospace',
              margin: 0,
            }}
          >
            Dia {now.dayCount} · {now.city} · {now.period}
          </p>
        </div>
      </div>
    ),
    { ...size },
  )
}
