import Link from 'next/link'
import { siteConfig } from '@/content/site.config'
import { Container } from './container'
import { MobileMenu } from './mobile-menu'
import { Nav } from './nav'
import { getNowFromSanity } from '@/sanity/queries'

export async function SiteHeader() {
  const journey = await getNowFromSanity()

  return (
    <header className="site-header sticky top-0 z-50 w-full border-b border-subtle bg-background/90 text-foreground backdrop-blur-md">
      <Container size="wide" className="flex h-16 items-center justify-between md:h-20">
        <Link
          href="/"
          className="site-header-logo font-display text-xl font-medium tracking-tight transition-opacity hover:opacity-75 md:text-2xl"
        >
          {siteConfig.name}
        </Link>

        <div className="hidden items-center gap-12 md:flex">
          <Nav />
          <Link
            href={siteConfig.primaryCta.href}
            className="site-header-cta group inline-flex min-h-11 items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/70 transition-colors hover:text-primary"
          >
            {siteConfig.primaryCta.label}
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">↓</span>
          </Link>
        </div>

        <MobileMenu journey={journey} />
      </Container>
    </header>
  )
}
