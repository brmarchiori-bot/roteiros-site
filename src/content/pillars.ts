import type { PillarsContent } from '@/types/content'

/**
 * PILARES — 4 linhas editoriais do Menos Roteiros.
 * Regra: 4 pilares, não 5, não 6. Clareza > completude.
 */
export const pillars: PillarsContent = {
  meta: {
    kicker: '05 · Pilares',
    title: 'O que você vai encontrar aqui.',
  },
  items: [
    {
      id: 'viagens-sem-maquiagem',
      title: 'Viagens sem maquiagem',
      description: 'Destinos reais, com preço, perrengue e o que ninguém te conta.',
    },
    {
      id: 'vida-entre-viagens',
      title: 'A vida entre as viagens',
      description:
        'Rotina nômade, trabalho remoto, casal em movimento, segunda-feira em hostel.',
    },
    {
      id: 'mapas-de-custo-real',
      title: 'Mapas de custo real',
      description: 'Quanto custou, o que valeu, o que não valeu — em reais e em horas.',
    },
    {
      id: 'sair-do-automatico',
      title: 'Sair do automático',
      description:
        'Decisões, processos e mentalidade pra quem tá pensando em virar a chave também.',
    },
  ],
}
