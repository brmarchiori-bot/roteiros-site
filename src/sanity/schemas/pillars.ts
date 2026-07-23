import { defineField, defineType } from 'sanity'

export const pillarsSchema = defineType({
  name: 'pillars',
  title: 'O que você encontra aqui',
  type: 'document',
  description:
    'Os quatro assuntos que ajudam uma pessoa nova a entender o Menos Roteiros. Só mude quando a linha editorial mudar.',
  fields: [
    defineField({
      name: 'meta',
      title: 'Título da seção',
      type: 'object',
      fields: [
        defineField({ name: 'kicker', title: 'Rótulo pequeno', type: 'string', validation: (r) => r.max(30) }),
        defineField({ name: 'title', title: 'Título', type: 'string', validation: (r) => r.required().max(70) }),
      ],
    }),
    defineField({
      name: 'items',
      title: 'Pilares (arraste para ordenar)',
      description: 'Use quatro itens curtos. Não é necessário adicionar link.',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title', title: 'Título', type: 'string', validation: (r) => r.required().max(45) }),
          defineField({ name: 'description', title: 'Descrição', type: 'text', rows: 2, validation: (r) => r.required().max(150) }),
          defineField({ name: 'href', title: 'Link (opcional)', type: 'string', description: 'Âncora ou URL completa. Deixe vazio quando não houver destino real.' }),
        ],
        preview: { select: { title: 'title', subtitle: 'description' } },
      }],
      validation: (r) => r.required().min(1).max(4),
    }),
  ],
  preview: {
    select: { title: 'meta.title', items: 'items' },
    prepare: ({ title, items }) => ({
      title: title || 'O que você encontra aqui',
      subtitle: `${Array.isArray(items) ? items.length : 0} pilares · Home`,
    }),
  },
})
