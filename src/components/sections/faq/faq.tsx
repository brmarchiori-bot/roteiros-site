import { Section } from '@/components/layout/section'
import { Reveal } from '@/components/shared/reveal'
import { faq } from '@/content'

export function FaqSection() {
  return (
    <Section id="faq" spacing="xl" bordered={false}>
      {/* Header editorial consistente */}
      <header className="mb-12 md:mb-16">
        <Reveal>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-primary md:w-12" />
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary md:text-[11px]">
              {faq.meta.kicker}
            </p>
          </div>
        </Reveal>

        {faq.meta.title && (
          <Reveal delay={0.08}>
            <h2 className="mt-8 max-w-3xl font-display text-3xl font-medium leading-[1.05] tracking-tight text-foreground md:text-5xl">
              {faq.meta.title}
            </h2>
          </Reveal>
        )}
      </header>

      <div>
        {faq.items.map((item, i) => (
          <Reveal key={item.question} delay={i * 0.04}>
            <details
              className="group border-t border-foreground/20 last:border-b"
              data-faq-index={i}
            >
              <summary className="cursor-pointer list-none py-7 [&::-webkit-details-marker]:hidden md:py-9">
                <div className="grid grid-cols-[2.5rem_1fr_2rem] items-baseline gap-4 md:grid-cols-[3rem_1fr_2.5rem]">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted md:text-[11px]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-xl font-medium leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary md:text-2xl">
                    {item.question}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="justify-self-end text-3xl leading-none text-muted transition-transform duration-300 group-open:rotate-45 md:text-4xl"
                  >
                    +
                  </span>
                </div>
              </summary>
              <div className="grid grid-cols-[2.5rem_1fr_2rem] gap-4 pb-7 md:grid-cols-[3rem_1fr_2.5rem] md:pb-9">
                <span aria-hidden="true" />
                <p className="text-base leading-relaxed text-foreground/80 md:text-lg md:leading-[1.75]">
                  {item.answer}
                </p>
                <span aria-hidden="true" />
              </div>
            </details>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
