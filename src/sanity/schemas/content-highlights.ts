import { defineField, defineType } from 'sanity'
import { photoFields, sectionLayoutFields } from './shared'

export const contentHighlightsSchema = defineType({
  name: 'contentHighlights',
  title: 'Seção Conteúdo (grade de destaques + canais)',
  type: 'document',
  groups: [
    { name: 'content', title: '📝 Conteúdo', default: true },
    { name: 'channels', title: '📱 Canais' },
    { name: 'layout', title: '📐 Layout' },
  ],
  fields: [
    defineField({
      name: 'meta',
      title: 'Topo da seção',
      group: 'content',
      type: 'object',
      fields: [
        defineField({
          name: 'kicker',
          title: 'Rótulo pequeno (ex: "06 · Conteúdo")',
          type: 'string',
          validation: (r) => r.max(30),
        }),
        defineField({
          name: 'title',
          title: 'Título grande',
          type: 'string',
          validation: (r) => r.max(60),
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'pullQuote',
      title: 'Citação em itálico (aparece entre título e cards)',
      description: 'Uma frase que resume o tom editorial. Opcional.',
      group: 'content',
      type: 'text',
      rows: 3,
      validation: (r) => r.max(300),
    }),
    defineField({
      name: 'highlights',
      title: 'Cards de conteúdo (arraste pra reordenar)',
      description: 'Cada card é um post/vídeo com foto + título + link. 1 a 8 cards.',
      group: 'content',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'highlight',
          fields: [
            defineField({
              name: 'platform',
              title: 'Rede social',
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
              title: 'Título do card (aparece abaixo da imagem)',
              type: 'string',
              validation: (r) =>
                r.required().max(100).warning('Passou de 100 — pode cortar no mobile.'),
            }),
            defineField({
              name: 'url',
              title: 'Link pro post/vídeo',
              type: 'url',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'thumbnail',
              title: 'Foto de capa do card',
              description: 'Aparece SÓ neste card.',
              type: 'image',
              options: { hotspot: true },
              fields: photoFields({ sectionName: 'Card', withCaption: false }),
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
      title: 'Blocos de canais (aparecem abaixo dos cards)',
      group: 'channels',
      type: 'object',
      fields: [
        defineField({
          name: 'instagram',
          title: 'Bloco Instagram',
          type: 'object',
          fields: [
            defineField({ name: 'url', title: 'Link do perfil', type: 'url' }),
            defineField({
              name: 'cta',
              title: 'Texto do botão',
              type: 'string',
              validation: (r) => r.max(40),
            }),
            defineField({
              name: 'note',
              title: 'Frase em itálico (opcional)',
              type: 'string',
              validation: (r) => r.max(100),
            }),
          ],
        }),
        defineField({
          name: 'youtube',
          title: 'Bloco YouTube',
          type: 'object',
          fields: [
            defineField({ name: 'url', title: 'Link do canal', type: 'url' }),
            defineField({
              name: 'cta',
              title: 'Texto do botão',
              type: 'string',
              validation: (r) => r.max(40),
            }),
            defineField({
              name: 'note',
              title: 'Frase em itálico (opcional)',
              type: 'string',
              validation: (r) => r.max(100),
            }),
          ],
        }),
      ],
    }),
    ...sectionLayoutFields().map((f) => ({ ...f, group: 'layout' })),
  ],
  preview: {
    select: { title: 'meta.title' },
    prepare: ({ title }) => ({ title: title || 'Seção Conteúdo' }),
  },
})
