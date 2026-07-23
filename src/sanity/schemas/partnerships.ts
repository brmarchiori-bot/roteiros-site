import { defineField, defineType } from 'sanity'

export const partnershipsSchema = defineType({
  name: 'partnerships',
  title: 'Parcerias',
  type: 'document',
  description:
    'Apresentação pública curta. O portfólio detalhado continua privado e nunca é ligado pela home.',
  fields: [
    defineField({
      name: 'meta',
      title: 'Título da seção',
      type: 'object',
      fields: [
        defineField({ name: 'kicker', title: 'Rótulo pequeno', type: 'string', validation: (r) => r.max(30) }),
        defineField({ name: 'title', title: 'Título', type: 'string', validation: (r) => r.required().max(80) }),
      ],
    }),
    defineField({
      name: 'philosophy',
      title: 'Como vocês escolhem parcerias',
      type: 'text',
      rows: 3,
      validation: (r) => r.required().max(320),
    }),
    defineField({
      name: 'formats',
      title: 'Tipos de parceria',
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
      description: 'Somente o endereço, sem mailto:.',
      type: 'email',
    }),
    defineField({
      name: 'whatsappUrl',
      title: 'Link do WhatsApp (opcional)',
      type: 'url',
    }),
  ],
  preview: {
    select: { title: 'meta.title', formats: 'formats' },
    prepare: ({ title, formats }) => ({
      title: title || 'Parcerias',
      subtitle: `${Array.isArray(formats) ? formats.length : 0} categorias · Home`,
    }),
  },
})
