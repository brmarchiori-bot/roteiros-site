import type { FaqContent } from '@/types/content'

/**
 * FAQ — remover fricção sem dar sermão.
 * 5 perguntas. Não 12. Curtas, com personalidade.
 */
export const faq: FaqContent = {
  meta: {
    kicker: '10 · Perguntas',
    title: 'O básico que tira dúvida.',
  },
  items: [
    {
      question: 'Vocês são influenciadores?',
      answer:
        'Não. A gente publica o que vive. Quem chama isso de influência, é com você.',
    },
    {
      question: 'Como vocês se sustentam?',
      answer:
        'Hoje: parcerias, conteúdo, e um pouco do que sobrou da vida anterior. Daqui pra frente: clube, roteiros, comunidade.',
    },
    {
      question: 'Vocês viajam o tempo todo?',
      answer:
        'Não. Tem semana que a gente fica num lugar só. A vida em movimento tem mais segunda-feira do que parece.',
    },
    {
      question: 'Posso viajar com vocês?',
      answer:
        'Por enquanto, não. Mas a gente tá construindo encontros e viagens em grupo — tem como avisar você quando sair.',
    },
    {
      question: 'Sou marca. Como funciona?',
      answer:
        'Tem uma seção inteira sobre isso aqui em cima — e a gente responde rápido no WhatsApp.',
    },
  ],
}
