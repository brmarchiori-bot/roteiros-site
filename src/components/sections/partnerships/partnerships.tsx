import Link from 'next/link'
import { Section } from '@/components/layout/section'
import { SectionHeader } from '@/components/layout/section-header'
import { Reveal } from '@/components/shared/reveal'
import { buttonStyles } from '@/components/ui/button'
import { partnerships } from '@/content'

export function PartnershipsSection() {
  return (
    <Section id="partnerships" spacing="xl">
      <SectionHeader meta={partnerships.meta} className="mb-12 md:mb-16" />

      {/* 1. Filosofia — filtro silencioso */}
      <Reveal delay={0.1}>
        <p className="max-w-3xl font-display text-2xl italic leading-snug text-foreground/85 md:text-[28px] md:leading-[1.4]">
          “{partnerships.philosophy}”
        </p>
      </Reveal>

      {/* 2. Formatos — vertical, layout 3/9 */}
      <div className="mt-20 space-y-12 md:mt-28 md:space-y-16">
        {partnerships.formats.map((format, i) => (
          <Reveal key={format.id} delay={i * 0.08}>
            <article className="grid gap-6 border-t border-foreground/15 pt-10 md:grid-cols-12 md:gap-12">
              <div className="md:col-span-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                  {format.number}
                </p>
                <h3 className="mt-3 font-display text-2xl font-medium leading-tight tracking-tight text-foreground md:text-[28px]">
                  {format.name}
                </h3>
              </div>
              <div className="md:col-span-9">
                <p className="text-base leading-relaxed text-foreground/85 md:text-lg md:leading-[1.7]">
                  {format.description}
                </p>
                <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  Indicado para: {format.audience}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* 3. Números — honestos e datados */}
      <div className="mt-20 border-t border-foreground/15 pt-10 md:mt-28">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Nossos números — atualizado em {partnerships.numbers.updatedAt}
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          {partnerships.numbers.items.map((stat, i) => (
            <Reveal key={stat.label} delay={0.05 + i * 0.06}>
              <li>
                <p className="font-display text-4xl font-medium leading-none tracking-tight text-foreground md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  {stat.label}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* 4. CTAs duplos */}
      <div className="mt-20 md:mt-24">
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
