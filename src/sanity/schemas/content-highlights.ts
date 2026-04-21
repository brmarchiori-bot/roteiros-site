import { defineField, defineType } from 'sanity'

export const contentHighlightsSchema = defineType({
  name: 'contentHighlights',
  title: 'Seção "Conteúdo"',
  type: 'document',
  fields: [
    defineField({
      name: 'meta',
      title: 'Cabeçalho da seção',
      type: 'object',
      fields: [
        defineField({ name: 'kicker', title: 'Kicker', type: 'string' }),
        defineField({ name: 'title', title: 'Título', type: 'string' }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'pullQuote',
      title: 'Frase de apoio (opcional)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'highlights',
      title: 'Destaques (4 itens recomendado)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'highlight',
          fields: [
            defineField({
              name: 'platform',
              title: 'Plataforma',
              type: 'string',
              options: {
                list: [
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'TikTok', value: 'tiktok' },
                ],
                layout: 'radio',
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'title',
              title: 'Título do conteúdo',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'url',
              title: 'Link',
              type: 'url',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'thumbnail',
              title: 'Thumbnail',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({ name: 'alt', title: 'Texto alternativo', type: 'string' }),
              ],
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'platform', media: 'thumbnail' },
          },
        },
      ],
      validation: (r) => r.min(1).max(8),
    }),
    defineField({
      name: 'channels',
      title: 'Canais em destaque',
      type: 'object',
      fields: [
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'object',
          fields: [
            defineField({ name: 'url', title: 'URL do perfil', type: 'url' }),
            defineField({ name: 'cta', title: 'Texto do botão', type: 'string' }),
            defineField({ name: 'note', title: 'Frase (opcional)', type: 'string' }),
          ],
        }),
        defineField({
          name: 'youtube',
          title: 'YouTube',
          type: 'object',
          fields: [
            defineField({ name: 'url', title: 'URL do canal', type: 'url' }),
            defineField({ name: 'cta', title: 'Texto do botão', type: 'string' }),
            defineField({ name: 'note', title: 'Frase (opcional)', type: 'string' }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'meta.title' },
    prepare: ({ title }) => ({ title: title || 'Seção Conteúdo' }),
  },
})
