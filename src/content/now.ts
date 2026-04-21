import type { NowContent } from '@/types/content'

/**
 * AGORA — entrada atual da jornada.
 * Fonte de verdade do JourneyMarker ("Dia 47 · Piauí · Abril/2026")
 * e da seção Now (foto + diário + localização).
 *
 * EDITAR TODA SEMANA. Substituir:
 *   - dayCount (incrementa)
 *   - city / state / country (se mudou de lugar)
 *   - date (ISO — pra SEO e sort)
 *   - period (display do JourneyMarker)
 *   - coordinates (opcional — detalhe tátil)
 *   - photo.src (substituir arquivo em /public/images/now/)
 *   - caption (3 linhas de diário recente)
 */
export const now: NowContent = {
  meta: {
    kicker: '04 · Agora',
    title: 'O caminho até aqui.',
  },
  city: 'Piauí',
  state: 'Sertão norte',
  country: 'Brasil',
  date: '2026-04-20',
  period: 'Abril/2026',
  dayCount: 47,
  coordinates: '−5.09° S · −42.80° W',
  photo: {
    src: '',
    alt: 'Cena recente do Piauí — sertão norte',
    caption: 'Piauí · Abril/2026',
  },
  caption:
    'Sertão norte, sem pressa. A semana foi de café no fogão a lenha, internet que vai e vem, e um pôr do sol que não cabe na câmera. Próxima parada: descer pra Parnaíba, encontrar o mar.',
  cta: {
    label: 'Ler os bastidores no Instagram',
    href: 'https://instagram.com/menosroteiros',
  },
  link: 'https://instagram.com/menosroteiros',
}
