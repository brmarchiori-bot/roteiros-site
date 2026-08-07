'use client'

import { useEffect, useState } from 'react'

type EditorialSource = 'sanity' | 'fallback' | 'unavailable' | 'mixed'

export function EditorialPreviewIndicator() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [source, setSource] = useState<EditorialSource | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/draft-mode/status', {
      cache: 'no-store',
      credentials: 'same-origin',
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((result: { isEnabled?: boolean } | null) => {
        setIsEnabled(result?.isEnabled === true)
        if (result?.isEnabled === true) {
          const resolved = document
            .querySelector<HTMLElement>('[data-editorial-preview-source]')
            ?.dataset.editorialPreviewSource
          if (resolved === 'sanity' || resolved === 'fallback' || resolved === 'unavailable' || resolved === 'mixed') {
            setSource(resolved)
          }
        }
      })
      .catch(() => {
        // Falha fechada: sem confirmação do servidor, o indicador não aparece.
      })

    return () => controller.abort()
  }, [])

  if (!isEnabled) return null

  return (
    <aside
      role="status"
      aria-label="Sessão de prévia editorial ativa"
      className="fixed inset-x-3 bottom-3 z-[120] mx-auto flex max-w-xl items-center justify-between gap-4 rounded-sm border border-white/20 bg-[#171714] px-4 py-3 text-[#f3eee5] shadow-[0_12px_40px_rgba(0,0,0,0.35)] md:inset-x-auto md:right-5 md:bottom-5 md:px-5"
    >
      <div className="text-xs leading-snug md:text-sm">
        <p>{previewMessage(source)}</p>
        {source && (
          <p className="mt-0.5 text-[10px] text-[#f3eee5]/70 md:text-xs">
            O público não está vendo esta versão
          </p>
        )}
      </div>
      <form action="/api/draft-mode/disable" method="post">
        <input type="hidden" name="redirectTo" value="/" />
        <button
          type="submit"
          className="min-h-11 shrink-0 border-l border-white/20 pl-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#e3a17d] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Sair
        </button>
      </form>
    </aside>
  )
}

function previewMessage(source: EditorialSource | null) {
  if (source === 'sanity') return 'Prévia editorial — conteúdo do painel'
  if (source === 'fallback') return 'Prévia editorial — usando versão segura do site'
  if (source === 'mixed') return 'Prévia editorial — algumas seções usam conteúdo do painel'
  if (source === 'unavailable') return 'Prévia editorial — painel temporariamente indisponível'
  return 'Prévia editorial — o público não está vendo esta versão'
}
