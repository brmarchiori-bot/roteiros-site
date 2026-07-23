import Link from 'next/link'
import { siteConfig } from '@/content/site.config'
import { buttonStyles } from '@/components/ui/button'
import { Container } from './container'
import { MobileMenu } from './mobile-menu'
import { Nav } from './nav'
import { getNowFromSanity } from '@/sanity/queries'

export async function SiteHeader() {
  const journey = await getNowFromSanity()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-subtle bg-background/85 backdrop-blur-md">
      <Container size="wide" className="flex h-16 items-center justify-between md:h-20">
        <Link
          href="/"
          className="font-display text-xl font-medium tracking-tight transition-opacity hover:opacity-80 md:text-2xl"
        >
          {siteConfig.name}
        </Link>

        <div className="hidden items-center gap-12 md:flex">
          <Nav />
          <Link
            href={siteConfig.primaryCta.href}
            className={buttonStyles({ variant: 'outline', size: 'sm' })}
          >
            {siteConfig.primaryCta.label}
          </Link>
        </div>

        <MobileMenu journey={journey} />
      </Container>
    </header>
  )
}
