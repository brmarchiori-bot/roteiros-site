import type { HeroContent } from '@/types/content'

/**
 * HERO — primeiro vislumbre da marca.
 * Quebra em 3 segundos: pergunta + promessa + convite.
 */
export const hero: HeroContent = {
  meta: {
    kicker: '01 · Hero',
  },
  headline: 'Onde o roteiro acaba, a gente começa.',
  subheadline:
    'Um diário público de dois que trocaram o balcão pelo caminho. Viagem real, rotina em movimento, perrengue traduzido — sem filtro e sem manual.',
  ctas: {
    primary: { label: 'Entrar na jornada', href: '/#club' },
    secondary: { label: 'Ver onde a gente tá', href: '#now' },
  },
  media: {
    // Placeholders — subir arquivo real em public/videos/hero/ e public/images/og/
    videoSrc: '/videos/hero/loop.mp4',
    posterSrc: '/images/og/hero-poster.jpg',
    alt: 'Estrada de chão no sertão do Piauí ao entardecer',
  },
}
