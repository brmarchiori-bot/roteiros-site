import type { FaqContent } from '@/types/content'

/**
 * FAQ — remover fricção sem dar sermão.
 * 5 perguntas. Não 12. Curtas, com personalidade.
 */
export const faq: FaqContent = {
  meta: {
    kicker: '07 · Perguntas',
    title: 'O básico que tira dúvida.',
  },
  intro: 'Perguntas que costumam aparecer quando a estrada vira conversa.',
  items: [
    {
      question: 'Vocês são influenciadores?',
      answer:
        'Não. A gente publica o que vive. Quem chama isso de influência, é com você.',
    },
    {
      question: 'Como vocês se sustentam?',
      answer:
        'Trabalho, produção de conteúdo e parcerias que fazem sentido para a história. A conta real também faz parte do que a gente escolhe contar.',
    },
    {
      question: 'Vocês viajam o tempo todo?',
      answer:
        'Não. Tem semana que a gente fica num lugar só. A vida em movimento tem mais segunda-feira do que parece.',
    },
    {
      question: 'Sou marca. Como funciona?',
      answer:
        'Tem uma seção inteira sobre isso aqui em cima — e a gente responde rápido no WhatsApp.',
    },
  ],
}
