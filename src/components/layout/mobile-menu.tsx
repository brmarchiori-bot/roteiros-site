'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { JourneyMarker } from '@/components/shared/journey-marker'
import { buttonStyles } from '@/components/ui/button'
import { siteConfig } from '@/content/site.config'
import { cn } from '@/lib/utils'
import type { NowContent } from '@/types/content'

type MobileMenuProps = {
  journey: Pick<NowContent, 'dayCount' | 'city' | 'period'>
}

export function MobileMenu({ journey }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  // Fechar com ESC + bloquear scroll do body
  useEffect(() => {
    if (!open) return

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        aria-expanded={open}
        className="font-mono text-sm uppercase tracking-widest text-foreground/70 transition-colors hover:text-primary md:hidden"
      >
        Menu
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
            className="fixed inset-0 z-[60] flex flex-col bg-background"
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
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className="font-mono text-xs uppercase tracking-widest text-foreground/60 transition-colors hover:text-primary"
              >
                Fechar
              </button>
            </div>

            <nav
              aria-label="Principal"
              className="flex flex-1 flex-col items-start justify-center gap-6 px-6 md:px-10"
            >
              {siteConfig.nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: 'easeOut' }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-4xl font-medium tracking-tight transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="space-y-5 border-t border-subtle px-6 py-6 md:px-10"
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
