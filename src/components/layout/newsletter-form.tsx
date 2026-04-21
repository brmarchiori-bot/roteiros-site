'use client'

import { useState, type FormEvent } from 'react'
import { club } from '@/content/club'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'submitting' | 'success' | 'error'

type NewsletterFormProps = {
  className?: string
  /** Variante visual: 'inline' (rodapé) ou 'stacked' (seção dedicada) */
  variant?: 'inline' | 'stacked'
  /** Tema visual — 'dark' usa cores invertidas pra fundos escuros */
  theme?: 'light' | 'dark'
}

/**
 * Form de inscrição no Caderno de Viagem.
 * UI funcional. Backend (Resend/Loops) entra em PASSO posterior —
 * por enquanto simula sucesso após 600ms.
 */
export function NewsletterForm({
  className,
  variant = 'inline',
  theme = 'light',
}: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  const isDark = theme === 'dark'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setStatus('submitting')

    try {
      // TODO: substituir por chamada real ao endpoint /api/subscribe
      await new Promise((resolve) => setTimeout(resolve, 600))
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
      setError('Algo travou. Tenta de novo em instantes.')
    }
  }

  if (status === 'success') {
    return (
      <p
        role="status"
        aria-live="polite"
        className={cn(
          'text-sm leading-relaxed',
          isDark ? 'text-background/85' : 'text-foreground/80',
          className,
        )}
      >
        Pronto. Próximo domingo a primeira carta cai.
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        variant === 'inline' ? 'flex flex-col gap-3 sm:flex-row' : 'flex flex-col gap-3',
        className,
      )}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Seu email
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
        disabled={status === 'submitting'}
        autoComplete="email"
        className={cn(
          'flex-1 rounded-full bg-transparent px-5 py-2.5 text-sm focus:outline-none disabled:opacity-50',
          isDark
            ? 'border border-background/20 text-background placeholder:text-background/40 focus:border-primary'
            : 'border border-subtle text-foreground placeholder:text-muted/60 focus:border-primary',
        )}
      />
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium tracking-tight text-primary-foreground transition-colors hover:bg-foreground disabled:pointer-events-none disabled:opacity-50"
      >
        {status === 'submitting' ? 'Enviando…' : club.cta.label}
      </button>
      {error && (
        <p role="alert" className="text-xs text-primary sm:basis-full">
          {error}
        </p>
      )}
    </form>
  )
}
