import { defineField, defineType } from 'sanity'
import { initialFaq } from '@/sanity/initial-values'

export const faqSchema = defineType({
  name: 'faq',
  title: 'Perguntas frequentes',
  type: 'document',
  initialValue: initialFaq,
  description:
    'Perguntas e respostas que aparecem no acordeão do rodapé da home.',
  groups: [{ name: 'conteudo', title: 'Perguntas na ordem do site', default: true }],
  fields: [
    defineField({
      name: 'meta',
      title: 'Topo da seção (rótulo + título)',
      description: '📍 Onde aparece: no começo da seção FAQ.',
      group: 'conteudo',
      type: 'object',
      fields: [
        defineField({
          name: 'kicker',
          title: 'Rótulo pequeno',
          description: 'Até 30 caracteres. Ex: "10 · Perguntas".',
          type: 'string',
          validation: (r) => r.max(30),
        }),
        defineField({
          name: 'title',
          title: 'Título grande',
          description: 'Até 60 caracteres. Ex: "O básico que tira dúvida."',
          type: 'string',
          validation: (r) => r.max(60),
        }),
      ],
    }),
    defineField({
      name: 'items',
      title: 'Perguntas e respostas',
      description:
        '📍 Onde aparecem: uma abaixo da outra, em acordeão. Até 15 perguntas. Se deixar vazio, o site usa o conteúdo padrão do código.',
      group: 'conteudo',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({
              name: 'question',
              title: 'Pergunta',
              description: 'Curta e direta. Recomendado até 80 caracteres.',
              type: 'string',
              validation: (r) => [
                r.required().error('A pergunta é obrigatória.'),
                r.max(120).warning('Passou de 80 caracteres — pode cortar no mobile.'),
              ],
            }),
            defineField({
              name: 'answer',
              title: 'Resposta',
              description:
                'Tom direto, 2-4 linhas. Recomendado até 280 caracteres.',
              type: 'text',
              rows: 4,
              validation: (r) => [
                r.required().error('A resposta é obrigatória.'),
                r.max(500).warning('Passou de 280 — pode ficar longo visualmente.'),
              ],
            }),
          ],
          preview: {
            select: { title: 'question', subtitle: 'answer' },
            prepare: ({ title, subtitle }) => ({
              title: title || '⚠️ Pergunta sem texto',
              subtitle:
                typeof subtitle === 'string' && subtitle.length > 0
                  ? subtitle.substring(0, 80)
                  : 'Sem resposta',
            }),
          },
        },
      ],
      validation: (r) => r.max(15).error('Máximo 15 perguntas.'),
    }),
    defineField({
      name: 'intro',
      title: 'Frase de introdução',
      description: '📍 Onde aparece: abaixo do título, antes das perguntas.',
      group: 'conteudo',
      type: 'text',
      rows: 2,
      validation: (r) => r.max(160),
    }),
  ],
  preview: {
    select: { kicker: 'meta.kicker', items: 'items' },
    prepare: ({ kicker, items }) => {
      const count = Array.isArray(items) ? items.length : 0
      return {
        title: 'Perguntas frequentes',
        subtitle: `${kicker ? `Home · ${kicker} · ` : 'Home · '}${count} pergunta${count === 1 ? '' : 's'}`,
      }
    },
  },
})
