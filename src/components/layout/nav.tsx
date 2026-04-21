'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/content/site.config'
import { cn } from '@/lib/utils'

type NavProps = {
  className?: string
  variant?: 'inline' | 'stacked'
}

export function Nav({ className, variant = 'inline' }: NavProps) {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Principal"
      className={cn(
        variant === 'inline' ? 'flex items-center gap-8' : 'flex flex-col gap-3',
        'text-sm tracking-tight',
        className,
      )}
    >
      {siteConfig.nav.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'transition-colors',
              active ? 'text-primary' : 'text-foreground/80 hover:text-primary',
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
