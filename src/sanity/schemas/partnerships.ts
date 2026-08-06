import { defineField, defineType } from 'sanity'
import { initialPartnerships } from '@/sanity/initial-values'

export const partnershipsSchema = defineType({
  name: 'partnerships',
  title: 'Parcerias',
  type: 'document',
  initialValue: initialPartnerships,
  description:
    'Apresentação pública curta. O portfólio detalhado continua privado e nunca é ligado pela home.',
  groups: [
    { name: 'conteudo', title: 'Apresentação e formatos', default: true },
    { name: 'contato', title: 'Canais de contato' },
  ],
  fields: [
    defineField({
      name: 'meta',
      title: 'Título da seção',
      group: 'conteudo',
      type: 'object',
      fields: [
        defineField({ name: 'kicker', title: 'Rótulo pequeno', type: 'string', validation: (r) => r.max(30) }),
        defineField({ name: 'title', title: 'Título', type: 'string', validation: (r) => r.required().max(80) }),
      ],
    }),
    defineField({
      name: 'philosophy',
      title: 'Como vocês escolhem parcerias',
      group: 'conteudo',
      type: 'text',
      rows: 3,
      validation: (r) => r.required().max(320),
    }),
    defineField({
      name: 'principles',
      title: 'Três princípios em destaque',
      description: '📍 Onde aparecem: nos três blocos ao lado do texto principal.',
      group: 'conteudo',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title', title: 'Título', type: 'string', validation: (r) => r.required().max(30) }),
          defineField({ name: 'body', title: 'Explicação', type: 'text', rows: 2, validation: (r) => r.required().max(140) }),
        ],
        preview: { select: { title: 'title', subtitle: 'body' } },
      }],
      validation: (r) => r.required().min(3).max(3).error('Use exatamente os três blocos do layout.'),
    }),
    defineField({
      name: 'formats',
      title: 'Formas de parceria',
      group: 'conteudo',
      description: 'No máximo três categorias amplas. Evite prometer entregas fixas aqui.',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'name', title: 'Nome', type: 'string', validation: (r) => r.required().max(45) }),
          defineField({ name: 'description', title: 'Descrição', type: 'text', rows: 3, validation: (r) => r.required().max(220) }),
          defineField({ name: 'audience', title: 'Para quem', type: 'string', validation: (r) => r.required().max(140) }),
        ],
        preview: { select: { title: 'name', subtitle: 'audience' } },
      }],
      validation: (r) => r.required().min(1).max(3),
    }),
    defineField({
      name: 'contactEmail',
      title: 'Email para apresentação',
      group: 'contato',
      description: 'Somente o endereço, sem mailto:.',
      type: 'email',
    }),
    defineField({
      name: 'contactEmailLabel',
      title: 'Texto do link de email',
      group: 'contato',
      type: 'string',
      validation: (r) => r.max(55),
    }),
    defineField({
      name: 'whatsappUrl',
      title: 'Link do WhatsApp (opcional)',
      group: 'contato',
      type: 'url',
    }),
    defineField({
      name: 'whatsappLabel',
      title: 'Texto do link de WhatsApp',
      group: 'contato',
      type: 'string',
      validation: (r) => r.max(40),
    }),
  ],
  preview: {
    select: { title: 'meta.title', formats: 'formats' },
    prepare: ({ title, formats }) => ({
      title: 'Parcerias',
      subtitle: title || `${Array.isArray(formats) ? formats.length : 0} formas de parceria`,
    }),
  },
})
