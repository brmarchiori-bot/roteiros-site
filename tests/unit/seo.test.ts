import { describe, expect, it } from 'vitest'
import { getFaqSchema } from '@/lib/seo'
import type { FaqContent } from '@/types/content'

describe('getFaqSchema', () => {
  it('gera o JSON-LD a partir do mesmo conteúdo entregue à seção', () => {
    const content: FaqContent = {
      meta: { kicker: 'FAQ', title: 'Dúvidas' },
      items: [
        { question: 'Pergunta publicada?', answer: 'Resposta publicada.' },
        { question: 'Outra pergunta?', answer: 'Outra resposta.' },
      ],
    }

    const schema = getFaqSchema(content)

    expect(schema.mainEntity).toHaveLength(content.items.length)
    expect(schema.mainEntity[0]).toMatchObject({
      name: content.items[0].question,
      acceptedAnswer: { text: content.items[0].answer },
    })
  })
})
