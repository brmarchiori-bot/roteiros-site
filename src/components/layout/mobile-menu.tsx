'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { JourneyMarker } from '@/components/shared/journey-marker'
import { buttonStyles } from '@/components/ui/button'
import { siteConfig } from '@/content/site.config'
import { cn } from '@/lib/utils'
import type { NowContent } from '@/types/content'

type MobileMenuProps = {
  journey: Pick<NowContent, 'dayCount' | 'city' | 'period'>
}

export function MobileMenu({ journey }: MobileMenuProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const trigger = triggerRef.current

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }

      if (e.key !== 'Tab' || !dialogRef.current) return

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )
      const first = focusable[0]
      const last = focusable.at(-1)
      if (!first || !last) return

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus()
    }, 0)

    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      trigger?.focus()
    }
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        aria-expanded={open}
        className={cn(
          'inline-flex min-h-11 min-w-11 items-center justify-center font-mono text-[10px] uppercase tracking-[0.18em] transition-colors',
          pathname === '/'
            ? 'text-white/80 hover:text-white'
            : 'text-foreground/70 hover:text-primary',
        )}
      >
        Menu
      </button>

      {open && (
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-background"
          >
            <div className="flex items-center justify-between border-b border-subtle px-6 py-4 md:px-10">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="font-display text-xl font-medium tracking-tight"
              >
                {siteConfig.name}
              </Link>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className="inline-flex min-h-11 min-w-11 items-center justify-center font-mono text-xs uppercase tracking-widest text-foreground/70 transition-colors hover:text-primary"
              >
                Fechar
              </button>
            </div>

            <nav
              aria-label="Principal"
              className="flex flex-1 flex-col items-start justify-center gap-6 px-6 md:px-10"
            >
              {siteConfig.nav.map((item, i) => (
                <div
                  key={item.href}
                  className="mr-reveal"
                  style={{ animationDelay: `${0.06 + i * 0.05}s` }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-4xl font-medium tracking-tight transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>

            <div
              className="mr-reveal space-y-5 border-t border-subtle px-6 py-6 md:px-10"
              style={{ animationDelay: '0.25s' }}
            >
              <Link
                href={siteConfig.primaryCta.href}
                onClick={() => setOpen(false)}
                className={cn(buttonStyles({ variant: 'primary', size: 'lg' }), 'w-full')}
              >
                {siteConfig.primaryCta.label}
              </Link>
              <div className="flex justify-center">
                <JourneyMarker journey={journey} />
              </div>
            </div>
          </div>
      )}
    </>
  )
}
