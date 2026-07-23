'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          background: '#f3eee5',
          color: '#0e0e0d',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <main
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '520px' }}>
            <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Erro inesperado
            </p>
            <h1 style={{ marginTop: '16px', fontSize: '36px', lineHeight: 1.1 }}>
              A estrada sumiu por um instante.
            </h1>
            <p style={{ marginTop: '20px', lineHeight: 1.7, opacity: 0.7 }}>
              Nenhum dado foi enviado. Tente carregar novamente; se o problema continuar, volte
              em alguns minutos.
            </p>
            <button
              type="button"
              onClick={reset}
              style={{
                marginTop: '28px',
                border: 0,
                borderRadius: '999px',
                background: '#c4512a',
                color: '#f3eee5',
                padding: '12px 22px',
                cursor: 'pointer',
              }}
            >
              Tentar novamente
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}
