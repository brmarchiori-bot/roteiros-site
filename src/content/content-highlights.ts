import type { ContentBridgeContent } from '@/types/content'

/**
 * CONTEÚDO EM MOVIMENTO — ponte para YouTube + Instagram.
 * Sem cards fictícios no fallback. Destaques reais entram manualmente pelo Studio.
 */
export const contentHighlights: ContentBridgeContent = {
  meta: {
    kicker: '06 · Conteúdo',
    title: 'Isso aqui não é feed. É continuidade.',
  },
  pullQuote:
    'A gente não produz highlights. A gente escreve a viagem enquanto acontece — no ritmo de quem tá vivendo, não de quem tá performando.',
  highlights: [],
  channels: {
    instagram: {
      url: 'https://instagram.com/menosroteiros',
      cta: 'Acompanhar dia a dia',
      note: 'O diário curto mora aqui',
    },
    youtube: {
      url: 'https://youtube.com/@menosroteiros',
      cta: 'Ver no YouTube',
      note: 'A história inteira, quando dá pra contar direito',
    },
  },
}
