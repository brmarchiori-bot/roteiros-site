import { defineField, defineType } from 'sanity'

export const aboutSchema = defineType({
  name: 'about',
  title: 'Seção "Sobre"',
  type: 'document',
  fields: [
    defineField({
      name: 'meta',
      title: 'Cabeçalho da seção',
      type: 'object',
      fields: [
        defineField({ name: 'kicker', title: 'Kicker (ex: "03 · Quem somos")', type: 'string' }),
        defineField({ name: 'title', title: 'Título', type: 'string' }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'chapters',
      title: 'Capítulos (3 recomendados)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'chapter',
          fields: [
            defineField({ name: 'number', title: 'Rótulo (ex: "Capítulo 01")', type: 'string' }),
            defineField({ name: 'title', title: 'Título do capítulo', type: 'string' }),
            defineField({ name: 'body', title: 'Texto', type: 'text', rows: 4 }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'number' },
          },
        },
      ],
      validation: (r) => r.min(1).max(5),
    }),
    defineField({
      name: 'closingCta',
      title: 'CTA de encerramento (opcional)',
      type: 'object',
      fields: [
        defineField({ name: 'label', title: 'Texto do link', type: 'string' }),
        defineField({ name: 'href', title: 'Destino (URL ou #ancora)', type: 'string' }),
      ],
    }),
    defineField({
      name: 'photo',
      title: 'Foto de Andressa + Bruno',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo (acessibilidade)',
          type: 'string',
          description: 'Descreva a foto pra quem não consegue ver (ex: "Andressa e Bruno no sertão do Piauí").',
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'caption',
          title: 'Legenda (aparece abaixo da foto)',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'meta.title' },
    prepare: ({ title }) => ({ title: title || 'Seção Sobre' }),
  },
})
