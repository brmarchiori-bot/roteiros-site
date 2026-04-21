import type { ComingSoonContent } from '@/types/content'

/**
 * EM CONSTRUÇÃO — plantar futuro sem promessa vazia.
 * Cada item vira uma tag no email marketing (PASSO futuro),
 * segmentando a lista pra lançamentos com público já quente.
 */
export const comingSoon: ComingSoonContent = {
  meta: {
    kicker: '08 · Em construção',
    title: 'A gente tá construindo.',
  },
  intro: 'Construir em público é mais difícil — e mais divertido.',
  items: [
    {
      id: 'roteiros',
      title: 'Roteiros reais',
      description: 'Guias de destino com custo, tempo e honestidade — sem dica genérica.',
      tag: 'roteiros',
    },
    {
      id: 'comunidade',
      title: 'Comunidade',
      description: 'Espaço fechado de quem tá no mesmo caminho — dúvida, troca, encontro.',
      tag: 'comunidade',
    },
    {
      id: 'ferramentas',
      title: 'Ferramentas',
      description: 'Planilhas, templates e playbooks da vida em movimento — o que a gente usa de verdade.',
      tag: 'ferramentas',
    },
    {
      id: 'encontros',
      title: 'Encontros',
      description: 'Viagens em grupo e encontros presenciais — em breve.',
      tag: 'encontros',
    },
  ],
}
