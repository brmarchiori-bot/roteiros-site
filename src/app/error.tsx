'use client'

import { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-foreground/40">erro</p>
        <h2 className="mt-4 text-3xl font-medium tracking-tight">
          Algo saiu do roteiro.
        </h2>
        <p className="mt-4 text-foreground/60">
          A gente já tá olhando. Tenta de novo em instantes.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 underline underline-offset-4 hover:opacity-70"
        >
          Tentar de novo
        </button>
      </div>
    </div>
  )
}
