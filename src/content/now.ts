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
  city: 'Na estrada',
  state: undefined,
  country: 'Brasil',
  date: '2026-07-23',
  period: 'Atualização pendente',
  dayCount: null,
  coordinates: undefined,
  photo: {
    src: '',
    alt: 'Cena atual da jornada',
    caption: 'Atualização da jornada',
  },
  caption:
    'A próxima nota de estrada ainda não foi publicada. Enquanto isso, os canais guardam os registros mais recentes.',
  cta: {
    label: 'Ler os bastidores no Instagram',
    href: 'https://instagram.com/menosroteiros',
  },
  link: 'https://instagram.com/menosroteiros',
}
