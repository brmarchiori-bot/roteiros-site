import { Section } from '@/components/layout/section'
import { SectionHeader } from '@/components/layout/section-header'
import { Reveal } from '@/components/shared/reveal'
import { faq } from '@/content'

export function FaqSection() {
  return (
    <Section id="faq" spacing="xl" bordered={false}>
      <SectionHeader meta={faq.meta} className="mb-12 md:mb-16" />

      <div>
        {faq.items.map((item, i) => (
          <Reveal key={item.question} delay={i * 0.04}>
            <details
              className="group border-t border-foreground/15 last:border-b"
              data-faq-index={i}
            >
              <summary className="cursor-pointer list-none py-6 [&::-webkit-details-marker]:hidden md:py-8">
                <div className="grid grid-cols-[2.5rem_1fr_2rem] items-baseline gap-4 md:grid-cols-[3rem_1fr_2.5rem]">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-xl font-medium leading-snug tracking-tight text-foreground md:text-2xl">
                    {item.question}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="justify-self-end text-3xl leading-none text-muted transition-transform duration-200 group-open:rotate-45 md:text-4xl"
                  >
                    +
                  </span>
                </div>
              </summary>
              <div className="grid grid-cols-[2.5rem_1fr_2rem] gap-4 pb-6 md:grid-cols-[3rem_1fr_2.5rem] md:pb-8">
                <span aria-hidden="true" />
                <p className="text-base leading-relaxed text-foreground/80 md:text-lg md:leading-[1.7]">
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
