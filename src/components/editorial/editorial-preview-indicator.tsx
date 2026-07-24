'use client'

import { useEffect, useState } from 'react'

export function EditorialPreviewIndicator() {
  const [isEnabled, setIsEnabled] = useState(false)

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
      <p className="text-xs leading-snug md:text-sm">
        Prévia editorial — o público não está vendo esta versão
      </p>
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
