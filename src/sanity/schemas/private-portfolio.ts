import { defineField, defineType } from 'sanity'

const mediaKinds = [
  { title: '🖼️ Imagem', value: 'image' },
  { title: '📱 Reel', value: 'reel' },
  { title: '▶️ YouTube', value: 'youtube' },
  { title: '🎬 Vídeo', value: 'video' },
]

export const privatePortfolioSchema = defineType({
  name: 'privatePortfolio',
  title: 'Portfólio privado',
  type: 'document',
  description:
    'Conteúdo enviado manualmente a parceiros. Não aparece no menu, sitemap ou mecanismos de busca.',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'introduction',
      title: 'Introdução',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.max(600),
    }),
    defineField({
      name: 'categories',
      title: 'Categorias',
      description:
        'Crie apenas as categorias necessárias e arraste para definir a ordem de apresentação.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'portfolioCategory',
          fields: [
            defineField({
              name: 'title',
              title: 'Nome da categoria',
              type: 'string',
              validation: (rule) => rule.required().max(60),
            }),
            defineField({
              name: 'description',
              title: 'Descrição da categoria',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.max(400),
            }),
            defineField({
              name: 'projects',
              title: 'Trabalhos',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'portfolioProject',
                  fields: [
                    defineField({
                      name: 'title',
                      title: 'Título do trabalho',
                      type: 'string',
                      validation: (rule) => rule.required().max(100),
                    }),
                    defineField({
                      name: 'client',
                      title: 'Cliente',
                      type: 'string',
                      validation: (rule) => rule.max(100),
                    }),
                    defineField({
                      name: 'objective',
                      title: 'Objetivo',
                      type: 'text',
                      rows: 3,
                      validation: (rule) => rule.max(500),
                    }),
                    defineField({
                      name: 'description',
                      title: 'Descrição',
                      type: 'text',
                      rows: 4,
                      validation: (rule) => rule.max(1000),
                    }),
                    defineField({
                      name: 'result',
                      title: 'Resultado',
                      type: 'text',
                      rows: 3,
                      validation: (rule) => rule.max(500),
                    }),
                    defineField({
                      name: 'media',
                      title: 'Mídia',
                      type: 'array',
                      of: [
                        {
                          type: 'object',
                          name: 'portfolioMedia',
                          fields: [
                            defineField({
                              name: 'kind',
                              title: 'Tipo',
                              type: 'string',
                              options: { list: mediaKinds, layout: 'radio' },
                              validation: (rule) => rule.required(),
                            }),
                            defineField({
                              name: 'title',
                              title: 'Título ou contexto',
                              type: 'string',
                              validation: (rule) => rule.max(100),
                            }),
                            defineField({
                              name: 'url',
                              title: 'Link do vídeo ou publicação',
                              type: 'url',
                              hidden: ({ parent }) => parent?.kind === 'image',
                            }),
                            defineField({
                              name: 'image',
                              title: 'Imagem',
                              type: 'controlledImage',
                              hidden: ({ parent }) => parent?.kind !== 'image',
                            }),
                          ],
                          preview: {
                            select: {
                              title: 'title',
                              kind: 'kind',
                              media: 'image.image',
                            },
                            prepare: ({ title, kind, media }) => ({
                              title: title || 'Mídia sem título',
                              subtitle: kind || 'Tipo não definido',
                              media,
                            }),
                          },
                        },
                      ],
                    }),
                    defineField({
                      name: 'links',
                      title: 'Links complementares',
                      type: 'array',
                      of: [
                        {
                          type: 'object',
                          name: 'portfolioLink',
                          fields: [
                            defineField({
                              name: 'label',
                              title: 'Texto',
                              type: 'string',
                              validation: (rule) => rule.required().max(60),
                            }),
                            defineField({
                              name: 'url',
                              title: 'URL',
                              type: 'url',
                              validation: (rule) => rule.required(),
                            }),
                          ],
                          preview: {
                            select: { title: 'label', subtitle: 'url' },
                          },
                        },
                      ],
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      subtitle: 'client',
                      media: 'media.0.image.image',
                    },
                    prepare: ({ title, subtitle, media }) => ({
                      title: title || 'Trabalho sem título',
                      subtitle: subtitle || 'Cliente não informado',
                      media,
                    }),
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: 'title', projects: 'projects' },
            prepare: ({ title, projects }) => ({
              title: title || 'Categoria sem nome',
              subtitle: `${Array.isArray(projects) ? projects.length : 0} trabalho(s)`,
            }),
          },
        },
      ],
    }),
    defineField({
      name: 'contactLabel',
      title: 'Texto do contato final',
      type: 'string',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'contactUrl',
      title: 'Link do contato final',
      description: 'Pode ser mailto:, WhatsApp ou URL completa.',
      type: 'string',
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true
          return /^(https?:\/\/|mailto:)/.test(value)
            ? true
            : 'Use uma URL https:// ou um link mailto:.'
        }),
    }),
  ],
  preview: {
    select: { title: 'title', categories: 'categories' },
    prepare: ({ title, categories }) => ({
      title: title || 'Portfólio privado',
      subtitle: `${Array.isArray(categories) ? categories.length : 0} categoria(s)`,
    }),
  },
})
