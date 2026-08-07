import type { HeroContent } from '@/types/content'

/**
 * HERO — primeiro vislumbre da marca.
 * Quebra em 3 segundos: pergunta + promessa + convite.
 *
 * Título em duas camadas:
 *   - titlePrefix  → parte fixa, sempre visível
 *   - dynamicWords → frases que alternam com fade suave (min. 2 pra ativar)
 *
 * headline é o backup estático: só aparece quando titlePrefix OU
 * dynamicWords estiverem vazios (tanto no Sanity quanto aqui).
 */
export const hero: HeroContent = {
  meta: {
    kicker: '01 · Hero',
  },
  titlePrefix: '',
  dynamicWords: [],
  headline: 'Onde o roteiro acaba, a gente começa.',
  subheadline:
    'A gente largou a vida que tinha para viver uma história em movimento.',
  ctas: {
    primary: { label: 'Ver onde a gente tá', href: '#now' },
    secondary: { label: 'Conhecer nossa história', href: '#about' },
  },
  media: {
    // Placeholders — subir arquivo real em public/videos/hero/ e public/images/og/
    videoSrc: '/videos/hero/loop.mp4',
    posterSrc: '/images/og/hero-poster.jpg',
    alt: 'Estrada de chão no sertão do Piauí ao entardecer',
  },
  coverImage: {
    src: '/images/about/andressa-bruno.jpg',
    alt: 'Andressa e Bruno juntos durante a jornada do Menos Roteiros',
    objectPosition: 'center',
    fitMode: 'cover',
  },
  showJourneyCredits: true,
}
