import type { ContentBridgeContent } from '@/types/content'

/**
 * CONTEÚDO EM MOVIMENTO — ponte para YouTube + Instagram.
 * URLs e thumbnails são placeholders por enquanto — substituir conforme postar.
 */
export const contentHighlights: ContentBridgeContent = {
  meta: {
    kicker: '06 · Conteúdo',
    title: 'Isso aqui não é feed. É continuidade.',
  },
  pullQuote:
    'A gente não produz highlights. A gente escreve a viagem enquanto acontece — no ritmo de quem tá vivendo, não de quem tá performando.',
  highlights: [
    {
      id: 'h1',
      platform: 'instagram',
      url: 'https://instagram.com/menosroteiros',
      title: 'O ônibus quebrou no meio do nada. Foi a melhor parte da semana.',
      thumbnail: '/images/content/01.jpg',
    },
    {
      id: 'h2',
      platform: 'instagram',
      url: 'https://instagram.com/menosroteiros',
      title: 'Quanto custou viver 7 dias no Piauí — a conta aberta.',
      thumbnail: '/images/content/02.jpg',
    },
    {
      id: 'h3',
      platform: 'youtube',
      url: 'https://youtube.com/@menosroteiros',
      title: 'A primeira semana fora de casa: o que ninguém te conta.',
      thumbnail: '/images/content/03.jpg',
    },
    {
      id: 'h4',
      platform: 'instagram',
      url: 'https://instagram.com/menosroteiros',
      title: 'Trabalhar em movimento: 4 erros que a gente cometeu e como resolveu.',
      thumbnail: '/images/content/04.jpg',
    },
  ],
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
