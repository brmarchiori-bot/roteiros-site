import { cn } from '@/lib/utils'

type NewsletterFormProps = {
  className?: string
  variant?: 'inline' | 'stacked'
  theme?: 'light' | 'dark'
}

/**
 * Estado honesto enquanto o backend de inscrições não está configurado.
 * Não coleta email e não comunica sucesso sem persistência real.
 */
export function NewsletterForm({
  className,
  variant = 'inline',
  theme = 'light',
}: NewsletterFormProps) {
  return (
    <div
      role="status"
      className={cn(
        'border px-5 py-4 text-sm leading-relaxed',
        variant === 'inline' ? 'rounded-md' : 'rounded-md md:px-6 md:py-5',
        theme === 'dark'
          ? 'border-background/20 text-background/75'
          : 'border-foreground/15 text-foreground/70',
        className,
      )}
    >
      Inscrições ainda não estão abertas. Quando o Caderno estiver pronto, o formulário será
      ativado aqui.
    </div>
  )
}
