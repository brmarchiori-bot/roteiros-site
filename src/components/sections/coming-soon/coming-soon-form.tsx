'use client'

import { useState, type FormEvent } from 'react'
import { Reveal } from '@/components/shared/reveal'
import { cn } from '@/lib/utils'
import type { ComingSoonItem } from '@/types/content'

type Status = 'idle' | 'submitting' | 'success' | 'error'

type ComingSoonFormProps = {
  items: ComingSoonItem[]
}

export function ComingSoonForm({ items }: ComingSoonFormProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (selected.size === 0) return
    setStatus('submitting')

    // TODO: substituir por chamada real ao endpoint /api/subscribe com tags
    await new Promise((resolve) => setTimeout(resolve, 600))
    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-md border border-foreground/15 bg-surface/60 p-8 text-center md:p-10"
      >
        <p className="font-display text-2xl text-foreground md:text-3xl">
          Anotado.
        </p>
        <p className="mt-3 text-base leading-relaxed text-foreground/80 md:text-lg">
          Quando o que você marcou sair, a gente avisa.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Grid de cards-checkbox */}
      <ul className="grid gap-4 sm:grid-cols-2 md:gap-5">
        {items.map((item, i) => {
          const isSelected = selected.has(item.id)
          return (
            <Reveal key={item.id} delay={i * 0.06}>
              <li>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    'flex h-full w-full flex-col items-start gap-4 rounded-md border p-6 text-left transition-all md:p-7',
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-foreground/15 hover:border-foreground/35',
                  )}
                >
                  <span className="flex w-full items-start justify-between gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                      {item.tag}
                    </span>
                    <Checkmark checked={isSelected} />
                  </span>
                  <span className="font-display text-xl font-medium tracking-tight text-foreground md:text-2xl">
                    {item.title}
                  </span>
                  <span className="text-sm leading-relaxed text-foreground/75 md:text-base md:leading-[1.6]">
                    {item.description}
                  </span>
                </button>
              </li>
            </Reveal>
          )
        })}
      </ul>

      {/* Linha de email + submit */}
      <Reveal delay={0.3}>
        <div className="mt-12 border-t border-foreground/15 pt-8 md:mt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            {selected.size === 0
              ? 'Marque o que te interessa pra continuar'
              : `Selecionado: ${selected.size} ${selected.size === 1 ? 'item' : 'itens'}`}
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="coming-soon-email" className="sr-only">
              Seu email
            </label>
            <input
              id="coming-soon-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              disabled={status === 'submitting'}
              autoComplete="email"
              className="flex-1 rounded-full border border-subtle bg-transparent px-5 py-2.5 text-sm placeholder:text-muted/60 focus:border-primary focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={selected.size === 0 || status === 'submitting'}
              className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium tracking-tight text-primary-foreground transition-colors hover:bg-foreground disabled:pointer-events-none disabled:opacity-40"
            >
              {status === 'submitting' ? 'Enviando…' : 'Avisa quando sair'}
            </button>
          </div>
        </div>
      </Reveal>
    </form>
  )
}

function Checkmark({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border transition-colors',
        checked
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-foreground/30',
      )}
    >
      {checked && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 6.5L5 9L9.5 3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  )
}
