import { Reveal } from '@/components/shared/reveal'
import type { ComingSoonItem } from '@/types/content'

type ComingSoonFormProps = {
  items: ComingSoonItem[]
}

/**
 * Catálogo informativo enquanto não existe backend de lista de interesse.
 * Volta a ser formulário somente quando a inscrição puder ser persistida.
 */
export function ComingSoonForm({ items }: ComingSoonFormProps) {
  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-2 md:gap-5">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.06}>
            <li className="flex h-full flex-col items-start gap-4 rounded-md border border-foreground/15 p-6 md:p-7">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                {item.tag}
              </span>
              <span className="font-display text-xl font-medium tracking-tight text-foreground md:text-2xl">
                {item.title}
              </span>
              <span className="text-sm leading-relaxed text-foreground/75 md:text-base md:leading-[1.6]">
                {item.description}
              </span>
            </li>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={0.3}>
        <p
          role="status"
          className="mt-12 rounded-md border border-foreground/15 bg-surface/40 px-6 py-5 text-sm leading-relaxed text-foreground/70 md:mt-16"
        >
          A lista de interesse ainda não está aberta. Nenhum dado está sendo coletado neste
          momento.
        </p>
      </Reveal>
    </div>
  )
}
