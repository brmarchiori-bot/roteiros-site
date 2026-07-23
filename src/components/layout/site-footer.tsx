import Link from 'next/link'
import { JourneyMarker } from '@/components/shared/journey-marker'
import { SocialIcon, type SocialPlatform } from '@/components/shared/social-icon'
import { siteConfig } from '@/content/site.config'
import { getNowFromSanity } from '@/sanity/queries'
import { Container } from './container'

const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
}

export async function SiteFooter() {
  const journey = await getNowFromSanity()
  const socials = (Object.entries(siteConfig.social) as [SocialPlatform, string][])
    .filter(([, url]) => Boolean(url))

  return (
    <footer className="border-t border-white/10 bg-foreground pb-16 pt-24 text-background md:pt-32">
      <Container size="wide">
        {/* Marca e contexto — sem formulário enquanto não existe coleta real. */}
        <div className="grid gap-12 md:grid-cols-12">
          <div className="space-y-5 md:col-span-7">
            <p className="max-w-3xl font-display text-4xl font-medium leading-[1.02] tracking-tight text-background md:text-7xl">
              A estrada continua depois que a tela termina.
            </p>
            <p className="max-w-md text-sm leading-relaxed text-background/55">
              {siteConfig.tagline}
            </p>
            <JourneyMarker journey={journey} className="text-primary" />
          </div>

          <div className="space-y-4 md:col-span-4 md:col-start-9">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-background/45">
              Próximo capítulo
            </p>
            <p className="max-w-md text-sm leading-relaxed text-background/70">
              A viagem continua nos canais. O site guarda o essencial e muda quando existe algo
              que vale a pena registrar.
            </p>
          </div>
        </div>

        {/* Bloco 2 — Nav + Canais (condicional) + Contato — flex auto-distribuído */}
        <div className="mt-20 flex flex-col gap-12 border-t border-white/15 pt-12 md:flex-row md:flex-wrap md:gap-x-16 md:gap-y-12">
          <nav aria-label="Rodapé" className="space-y-4 md:flex-1 md:min-w-[180px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              Navegar
            </p>
            <ul className="space-y-3 text-sm">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-background/65 transition-colors hover:text-primary"
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
              <ul className="flex items-center gap-5">
                {socials.map(([key, url]) => (
                  <li key={key}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={SOCIAL_LABELS[key]}
                      className="inline-flex text-background/65 transition-colors hover:text-primary"
                    >
                      <SocialIcon platform={key} className="h-5 w-5" />
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
                  className="text-background/65 transition-colors hover:text-primary"
                >
                  {siteConfig.contact.general}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.partnerships}`}
                  className="text-background/65 transition-colors hover:text-primary"
                >
                  {siteConfig.contact.partnerships}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bloco 3 — Copyright + assinatura */}
        <div className="mt-16 flex flex-col gap-3 border-t border-white/15 pt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-background/40 md:flex-row md:items-center md:justify-between">
          <p>
            © {siteConfig.legal.copyrightYear} {siteConfig.name} — um diário em construção
          </p>
          <p>{siteConfig.shortTagline}</p>
        </div>
      </Container>
    </footer>
  )
}
