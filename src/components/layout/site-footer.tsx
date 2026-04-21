import Link from 'next/link'
import { JourneyMarker } from '@/components/shared/journey-marker'
import { club } from '@/content/club'
import { siteConfig } from '@/content/site.config'
import { Container } from './container'
import { NewsletterForm } from './newsletter-form'

const SOCIAL_LABELS: Record<keyof typeof siteConfig.social, string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
}

export function SiteFooter() {
  const socials = (Object.entries(siteConfig.social) as [keyof typeof siteConfig.social, string][])
    .filter(([, url]) => Boolean(url))

  return (
    <footer className="mt-32 border-t border-subtle bg-background pb-16 pt-20 md:pt-24">
      <Container size="wide">
        {/* Bloco 1 — Marca + Caderno inline */}
        <div className="grid gap-12 md:grid-cols-12">
          <div className="space-y-5 md:col-span-6">
            <p className="font-display text-3xl font-medium tracking-tight md:text-4xl">
              {siteConfig.name}
            </p>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              {siteConfig.tagline}
            </p>
            <JourneyMarker />
          </div>

          <div className="space-y-4 md:col-span-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              {club.name}
            </p>
            <p className="max-w-md text-sm leading-relaxed text-foreground/80">
              {club.promise}
            </p>
            <NewsletterForm />
            <p className="text-xs text-muted">{club.rule}</p>
          </div>
        </div>

        {/* Bloco 2 — Nav + Canais (condicional) + Contato — flex auto-distribuído */}
        <div className="mt-16 flex flex-col gap-12 border-t border-subtle pt-12 md:flex-row md:flex-wrap md:gap-x-16 md:gap-y-12">
          <nav aria-label="Rodapé" className="space-y-4 md:flex-1 md:min-w-[180px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              Navegar
            </p>
            <ul className="space-y-3 text-sm">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-foreground/80 transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {socials.length > 0 && (
            <div className="space-y-4 md:flex-1 md:min-w-[180px]">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                Canais
              </p>
              <ul className="space-y-3 text-sm">
                {socials.map(([key, url]) => (
                  <li key={key}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/80 transition-colors hover:text-primary"
                    >
                      {SOCIAL_LABELS[key]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4 md:flex-1 md:min-w-[220px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              Contato
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${siteConfig.contact.general}`}
                  className="text-foreground/80 transition-colors hover:text-primary"
                >
                  {siteConfig.contact.general}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.partnerships}`}
                  className="text-foreground/80 transition-colors hover:text-primary"
                >
                  {siteConfig.contact.partnerships}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bloco 3 — Copyright + assinatura */}
        <div className="mt-16 flex flex-col gap-3 border-t border-subtle pt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {siteConfig.legal.copyrightYear} {siteConfig.name} — um diário em construção
          </p>
          <p>{siteConfig.shortTagline}</p>
        </div>
      </Container>
    </footer>
  )
}
