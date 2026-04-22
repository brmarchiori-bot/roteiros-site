import { defineField, defineType } from 'sanity'

export const contentHighlightsSchema = defineType({
  name: 'contentHighlights',
  title: 'Seção Conteúdo (grade de destaques + canais)',
  type: 'document',
  fields: [
    defineField({
      name: 'meta',
      title: 'Topo da seção',
      type: 'object',
      fields: [
        defineField({
          name: 'kicker',
          title: 'Rótulo pequeno (ex: "06 · Conteúdo")',
          type: 'string',
        }),
        defineField({ name: 'title', title: 'Título grande', type: 'string' }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'pullQuote',
      title: 'Citação em destaque (opcional — aparece em itálico grande)',
      description: 'Uma frase que resume o tom editorial. Fica entre o título e os cards.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'highlights',
      title: 'Cards de conteúdo (4 recomendados)',
      description: 'Cada card é um post/vídeo em destaque, com imagem e link.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'highlight',
          fields: [
            defineField({
              name: 'platform',
              title: 'De qual rede é este conteúdo',
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
              title: 'Título do card (texto que aparece abaixo da imagem)',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'url',
              title: 'Link pro post/vídeo',
              type: 'url',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'thumbnail',
              title: '📷 Foto de capa do card',
              description: 'Aparece SÓ neste card. Cada card tem sua própria foto.',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Descrição da foto (acessibilidade)',
                  type: 'string',
                }),
                defineField({
                  name: 'objectPosition',
                  title: 'Alinhamento da foto',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Centro (padrão)', value: 'center' },
                      { title: 'Topo', value: 'top' },
                      { title: 'Base (pé)', value: 'bottom' },
                      { title: 'Esquerda', value: 'left' },
                      { title: 'Direita', value: 'right' },
                      { title: 'Canto superior esquerdo', value: 'top left' },
                      { title: 'Canto superior direito', value: 'top right' },
                      { title: 'Canto inferior esquerdo', value: 'bottom left' },
                      { title: 'Canto inferior direito', value: 'bottom right' },
                    ],
                  },
                  initialValue: 'center',
                }),
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
      title: 'Blocos de canais (aparecem abaixo dos cards)',
      description: 'Os dois blocos grandes de Instagram e YouTube no final da seção.',
      type: 'object',
      fields: [
        defineField({
          name: 'instagram',
          title: 'Bloco do Instagram',
          type: 'object',
          fields: [
            defineField({ name: 'url', title: 'Link do perfil no Instagram', type: 'url' }),
            defineField({
              name: 'cta',
              title: 'Texto do botão (ex: "Acompanhar dia a dia")',
              type: 'string',
            }),
            defineField({
              name: 'note',
              title: 'Frase em itálico grande (opcional)',
              type: 'string',
            }),
          ],
        }),
        defineField({
          name: 'youtube',
          title: 'Bloco do YouTube',
          type: 'object',
          fields: [
            defineField({ name: 'url', title: 'Link do canal no YouTube', type: 'url' }),
            defineField({
              name: 'cta',
              title: 'Texto do botão (ex: "Ver no YouTube")',
              type: 'string',
            }),
            defineField({
              name: 'note',
              title: 'Frase em itálico grande (opcional)',
              type: 'string',
            }),
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
