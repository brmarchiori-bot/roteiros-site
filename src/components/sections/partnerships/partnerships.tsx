import Link from 'next/link'
import { Section } from '@/components/layout/section'
import { Reveal } from '@/components/shared/reveal'
import { buttonStyles } from '@/components/ui/button'
import { partnerships } from '@/content'

export function PartnershipsSection() {
  return (
    <Section id="partnerships" spacing="xl">
      {/* Header editorial */}
      <header className="mb-16 md:mb-24">
        <Reveal>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-primary md:w-12" />
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary md:text-[11px]">
              {partnerships.meta.kicker}
            </p>
          </div>
        </Reveal>

        {partnerships.meta.title && (
          <Reveal delay={0.08}>
            <h2 className="mt-8 max-w-4xl font-display text-4xl font-medium leading-[1.02] tracking-[-0.01em] text-foreground md:text-[64px] lg:text-[76px]">
              {partnerships.meta.title}
            </h2>
          </Reveal>
        )}
      </header>

      {/* 1. Filosofia — filtro silencioso */}
      <Reveal delay={0.1}>
        <p className="max-w-3xl font-display text-2xl italic leading-snug text-foreground/80 md:text-[30px] md:leading-[1.4]">
          “{partnerships.philosophy}”
        </p>
      </Reveal>

      {/* 2. Formatos */}
      <div className="mt-24 space-y-16 md:mt-32 md:space-y-20">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted md:text-[11px]">
            Formatos
          </p>
        </Reveal>

        {partnerships.formats.map((format, i) => (
          <Reveal key={format.id} delay={i * 0.08}>
            <article className="grid gap-8 border-t border-foreground/20 pt-10 md:grid-cols-12 md:gap-12 md:pt-14">
              <div className="md:col-span-4">
                <p className="font-display text-5xl font-medium leading-none tracking-tight text-primary/80 md:text-7xl">
                  {format.number}
                </p>
                <h3 className="mt-5 font-display text-[26px] font-medium leading-tight tracking-tight text-foreground md:text-[32px]">
                  {format.name}
                </h3>
              </div>
              <div className="md:col-span-8">
                <p className="text-base leading-relaxed text-foreground/80 md:text-lg md:leading-[1.75]">
                  {format.description}
                </p>
                <p className="mt-6 border-t border-foreground/10 pt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted md:text-[11px]">
                  Indicado para: <span className="text-foreground/70">{format.audience}</span>
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* 3. Números — grade escalonada, cada número enorme */}
      <div className="mt-24 md:mt-32">
        <Reveal>
          <div className="flex items-end justify-between border-t border-foreground/20 pt-10 md:pt-14">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted md:text-[11px]">
              Números
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted/70 md:text-[11px]">
              Atualizado em {partnerships.numbers.updatedAt}
            </p>
          </div>
        </Reveal>

        <ul className="mt-12 grid gap-12 sm:grid-cols-2 md:mt-16 md:grid-cols-4 md:gap-8">
          {partnerships.numbers.items.map((stat, i) => (
            <Reveal key={stat.label} delay={0.05 + i * 0.06}>
              <li className="border-t border-foreground/15 pt-6">
                <p className="font-display text-5xl font-medium leading-none tracking-[-0.02em] text-foreground md:text-[64px]">
                  {stat.value}
                </p>
                <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted md:text-[11px]">
                  {stat.label}
                </p>
                {stat.note && (
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.15em] text-muted/60 md:text-[10px]">
                    ({stat.note})
                  </p>
                )}
              </li>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* 4. CTAs duplos */}
      <div className="mt-24 border-t border-foreground/20 pt-10 md:mt-32 md:pt-14">
        <Reveal>
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href={partnerships.ctas.mediaKit.href}
              className={buttonStyles({
                variant: 'primary',
                size: 'lg',
                className: 'w-full sm:w-auto',
              })}
            >
              {partnerships.ctas.mediaKit.label}
            </Link>
            <Link
              href={partnerships.ctas.whatsapp.href}
              target={partnerships.ctas.whatsapp.href.startsWith('http') ? '_blank' : undefined}
              rel={
                partnerships.ctas.whatsapp.href.startsWith('http')
                  ? 'noopener noreferrer'
                  : undefined
              }
              className={buttonStyles({
                variant: 'outline',
                size: 'lg',
                className: 'w-full sm:w-auto',
              })}
            >
              {partnerships.ctas.whatsapp.label}
            </Link>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
