import Link from 'next/link'
import { Section } from '@/components/layout/section'
import { Reveal } from '@/components/shared/reveal'
import { partnerships as partnershipsFallback } from '@/content'
import type { PartnershipsContent } from '@/types/content'
import type { EditorialSectionResult } from '@/sanity/editorial/home'
import { editorialDataAttribute } from '@/sanity/editorial/data-attribute'

export function PartnershipsSection({
  content,
  editorial,
}: {
  content?: PartnershipsContent
  editorial?: EditorialSectionResult<'partnerships'>
} = {}) {
  const partnerships = content ?? partnershipsFallback
  const publishedNumbers = partnerships.numbers.items.filter(
    (item) => item.value.trim() && item.value !== '—',
  )

  return (
    <Section id="partnerships" spacing="lg" className="bg-foreground text-background" bordered={false}>
      <div className="grid gap-12 md:grid-cols-12 md:gap-10">
      <div className="md:col-span-5">
      <header className="mb-10">
        <Reveal>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-primary md:w-12" />
            <p data-sanity={editorialDataAttribute(editorial, 'meta.kicker')} className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary md:text-[11px]">
              {partnerships.meta.kicker}
            </p>
          </div>
        </Reveal>

        {partnerships.meta.title && (
          <Reveal delay={0.08}>
            <h2 data-sanity={editorialDataAttribute(editorial, 'meta.title')} className="mt-6 max-w-4xl font-display text-4xl font-medium leading-[1.02] tracking-[-0.01em] text-background md:text-[60px]">
              {partnerships.meta.title}
            </h2>
          </Reveal>
        )}
      </header>

      {/* 1. Filosofia — filtro silencioso */}
      <Reveal delay={0.1}>
        <p data-sanity={editorialDataAttribute(editorial, 'philosophy')} className="max-w-xl text-base leading-relaxed text-background/70">
          “{partnerships.philosophy}”
        </p>
      </Reveal>
      </div>
      <ol className="grid gap-0 border-y border-white/20 md:col-span-7 md:grid-cols-3">
        {partnerships.principles.map((principle, i) => (
          <Reveal key={principle.id} delay={i * 0.08} className="h-full">
            <li className="h-full border-b border-white/15 px-6 py-9 md:border-r md:border-b-0">
              <p className="font-mono text-[10px] tracking-[0.2em] text-primary">{String(i + 1).padStart(2, '0')}</p>
              <h3 data-sanity={editorialDataAttribute(editorial, partnershipPath(editorial, 'principles', i, 'title'))} className="mt-7 font-display text-2xl text-background">{principle.title}</h3>
              <p data-sanity={editorialDataAttribute(editorial, partnershipPath(editorial, 'principles', i, 'body'))} className="mt-4 text-sm leading-relaxed text-background/60">{principle.body}</p>
            </li>
          </Reveal>
        ))}
      </ol>
      </div>

      <p data-sanity={editorialDataAttribute(editorial, 'formats')} className="mt-10 font-mono text-[9px] uppercase tracking-[0.2em] text-background/40">
        {partnerships.formats.map((format) => format.name).join(' · ')}
      </p>

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
              data-sanity={editorialDataAttribute(editorial, 'contactEmailLabel')}
              href={partnerships.ctas.mediaKit.href}
              className="group inline-flex min-h-11 items-center gap-4 border-b border-primary/70 font-mono text-[10px] uppercase tracking-[0.18em] text-background transition-colors hover:border-background"
            >
              {partnerships.ctas.mediaKit.label}
              <span aria-hidden="true" className="text-primary transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              data-sanity={editorialDataAttribute(editorial, 'whatsappLabel')}
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

function partnershipPath(
  editorial: EditorialSectionResult<'partnerships'> | undefined,
  collection: 'principles' | 'formats',
  index: number,
  field: string,
) {
  const key = editorial?.editMetadata?.arrayKeys[collection]?.[index]
  return key ? `${collection}[_key=="${key}"].${field}` : collection
}
