import { defineField, defineType } from 'sanity'
import { initialPillars } from '@/sanity/initial-values'

export const pillarsSchema = defineType({
  name: 'pillars',
  title: 'O que você vai encontrar',
  type: 'document',
  initialValue: initialPillars,
  description:
    'Os quatro assuntos que ajudam uma pessoa nova a entender o Menos Roteiros. Só mude quando a linha editorial mudar.',
  groups: [{ name: 'conteudo', title: 'Textos da seção', default: true }],
  fields: [
    defineField({
      name: 'meta',
      title: 'Título da seção',
      group: 'conteudo',
      type: 'object',
      fields: [
        defineField({ name: 'kicker', title: 'Rótulo pequeno', type: 'string', validation: (r) => r.max(30) }),
        defineField({ name: 'title', title: 'Título', type: 'string', validation: (r) => r.required().max(70) }),
      ],
    }),
    defineField({
      name: 'items',
      title: 'O que a pessoa encontra',
      description: 'A seção utiliza quatro itens no layout aprovado.',
      group: 'conteudo',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title', title: 'Título', type: 'string', validation: (r) => r.required().max(45) }),
          defineField({ name: 'description', title: 'Descrição', type: 'text', rows: 2, validation: (r) => r.required().max(150) }),
        ],
        preview: { select: { title: 'title', subtitle: 'description' } },
      }],
      validation: (r) => r.required().min(1).max(4),
    }),
  ],
  preview: {
    select: { title: 'meta.title', items: 'items' },
    prepare: ({ title, items }) => ({
      title: 'O que você vai encontrar',
      subtitle: title || `${Array.isArray(items) ? items.length : 0} itens`,
    }),
  },
})
