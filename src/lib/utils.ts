import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Concatena classes condicionalmente e resolve conflitos do Tailwind.
 * Exemplo: cn('px-4', condition && 'px-8') → 'px-8' (sem px-4 sobrando)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Monta a URL do WhatsApp Web/App com mensagem pré-preenchida opcional.
 * Adiciona o DDI 55 (Brasil) automaticamente se ainda não tiver.
 */
export function buildWhatsAppUrl(rawNumber: string, message?: string): string {
  const digits = rawNumber.replace(/\D/g, '')
  const phone = digits.startsWith('55') ? digits : `55${digits}`
  const base = `https://wa.me/${phone}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
