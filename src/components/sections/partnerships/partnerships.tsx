import Link from 'next/link'
import { Section } from '@/components/layout/section'
import { Reveal } from '@/components/shared/reveal'
import { getPartnershipsFromSanity } from '@/sanity/queries'

export async function PartnershipsSection() {
  const partnerships = await getPartnershipsFromSanity()
  const publishedNumbers = partnerships.numbers.items.filter(
    (item) => item.value.trim() && item.value !== '—',
  )

  return (
    <Section id="partnerships" spacing="lg" className="bg-foreground text-background" bordered={false}>
      {/* Header editorial */}
      <header className="mb-10 md:mb-14">
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
            <h2 className="mt-6 max-w-4xl font-display text-4xl font-medium leading-[1.02] tracking-[-0.01em] text-background md:text-[60px]">
              {partnerships.meta.title}
            </h2>
          </Reveal>
        )}
      </header>

      {/* 1. Filosofia — filtro silencioso */}
      <Reveal delay={0.1}>
        <p className="max-w-3xl text-lg leading-relaxed text-background/75 md:text-xl">
          “{partnerships.philosophy}”
        </p>
      </Reveal>

      {/* 2. Formatos */}
      <Reveal>
        <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.25em] text-background/55 md:mt-16 md:text-[11px]">
          Possibilidades narrativas
        </p>
      </Reveal>
      <div className="mt-5 border-y border-white/20">

        {partnerships.formats.map((format, i) => (
          <Reveal key={format.id} delay={i * 0.08} className="h-full">
            <article className="grid h-full gap-6 border-b border-white/15 py-10 last:border-b-0 md:grid-cols-12 md:items-start md:gap-10 md:py-14">
              <div className="md:col-span-5">
                <h3 className="mt-4 max-w-[12ch] font-display text-3xl font-medium leading-tight tracking-tight text-background md:text-5xl">
                  {format.name}
                </h3>
              </div>
              <div className="md:col-span-6 md:col-start-7 md:pt-8">
                <p className="text-base leading-relaxed text-background/75 md:text-lg">
                  {format.description}
                </p>
                <p className="mt-5 border-t border-white/15 pt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-background/55 md:text-[10px]">
                  Para: <span className="text-background/75">{format.audience}</span>
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* 3. Números — grade escalonada, cada número enorme */}
      {publishedNumbers.length > 0 && (
        <div className="mt-24 md:mt-32">
          <Reveal>
            <div className="flex flex-col gap-3 border-t border-foreground/20 pt-10 sm:flex-row sm:items-end sm:justify-between md:pt-14">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted md:text-[11px]">
                Números
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted/70 md:text-[11px]">
                Atualizado em {partnerships.numbers.updatedAt}
              </p>
            </div>
          </Reveal>

          <ul className="mt-12 grid gap-12 sm:grid-cols-2 md:mt-16 md:grid-cols-4 md:gap-8">
            {publishedNumbers.map((stat, i) => (
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
      )}

      {/* Convite: links editoriais, sem aparência de funil. */}
      <div className="mt-12 border-t border-white/20 pt-8 md:mt-16">
        <Reveal>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
            <Link
              href={partnerships.ctas.mediaKit.href}
              className="group inline-flex min-h-11 items-center gap-4 border-b border-primary/70 font-mono text-[10px] uppercase tracking-[0.18em] text-background transition-colors hover:border-background"
            >
              {partnerships.ctas.mediaKit.label}
              <span aria-hidden="true" className="text-primary transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href={partnerships.ctas.whatsapp.href}
              target={partnerships.ctas.whatsapp.href.startsWith('http') ? '_blank' : undefined}
              rel={
                partnerships.ctas.whatsapp.href.startsWith('http')
                  ? 'noopener noreferrer'
                  : undefined
              }
              className="group inline-flex min-h-11 items-center gap-4 border-b border-white/25 font-mono text-[10px] uppercase tracking-[0.18em] text-background/70 transition-colors hover:border-white hover:text-background"
            >
              {partnerships.ctas.whatsapp.label}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">↗</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
