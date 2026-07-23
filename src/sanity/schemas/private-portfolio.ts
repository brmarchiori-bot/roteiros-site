import { defineField, defineType } from 'sanity'

const mediaKinds = [
  { title: '🖼️ Imagem', value: 'image' },
  { title: '📱 Reel', value: 'reel' },
  { title: '▶️ YouTube', value: 'youtube' },
  { title: '🎬 Vídeo', value: 'video' },
  { title: '📱 Vídeo vertical', value: 'verticalVideo' },
  { title: '🖥️ Vídeo horizontal', value: 'horizontalVideo' },
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
                      name: 'visible',
                      title: 'Exibir na apresentação',
                      description:
                        'Desative para guardar o trabalho no Studio sem mostrá-lo no portfólio.',
                      type: 'boolean',
                      initialValue: true,
                    }),
                    defineField({
                      name: 'featured',
                      title: 'Marcar como destaque',
                      description: 'Adiciona um selo discreto ao trabalho.',
                      type: 'boolean',
                      initialValue: false,
                    }),
                    defineField({
                      name: 'city',
                      title: 'Cidade (opcional)',
                      type: 'string',
                      validation: (rule) => rule.max(100),
                    }),
                    defineField({
                      name: 'date',
                      title: 'Data do trabalho (opcional)',
                      type: 'date',
                    }),
                    defineField({
                      name: 'format',
                      title: 'Formato ou entrega principal',
                      description: 'Ex.: Reel, vídeo horizontal, fotografia ou pacote de conteúdo.',
                      type: 'string',
                      validation: (rule) => rule.max(100),
                    }),
                    defineField({
                      name: 'question',
                      title: 'Pergunta central',
                      description:
                        'A pergunta humana que conduz a história. Ex.: o que faz alguém querer ficar?',
                      type: 'text',
                      rows: 2,
                      validation: (rule) => rule.max(240),
                    }),
                    defineField({
                      name: 'context',
                      title: 'Contexto',
                      description:
                        'O que o visitante precisa saber antes de entrar na história.',
                      type: 'text',
                      rows: 3,
                      validation: (rule) => rule.max(600),
                    }),
                    defineField({
                      name: 'objective',
                      title: 'Objetivo',
                      description: 'Use somente quando houver um objetivo de trabalho real.',
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
                      name: 'process',
                      title: 'Imersão e processo',
                      description:
                        'Como a história foi encontrada, acompanhada e transformada em conteúdo.',
                      type: 'text',
                      rows: 4,
                      validation: (rule) => rule.max(1000),
                    }),
                    defineField({
                      name: 'result',
                      title: 'Resultado',
                      description:
                        'Registre somente resultados comprováveis. Deixe vazio quando não houver.',
                      type: 'text',
                      rows: 3,
                      validation: (rule) => rule.max(500),
                    }),
                    defineField({
                      name: 'learning',
                      title: 'O que ficou',
                      description:
                        'Aprendizado, mudança de olhar ou consequência humana da história.',
                      type: 'text',
                      rows: 3,
                      validation: (rule) => rule.max(600),
                    }),
                    defineField({
                      name: 'services',
                      title: 'Serviços executados',
                      description:
                        'Adicione somente o que foi realizado neste trabalho. Arraste para ordenar.',
                      type: 'array',
                      of: [
                        {
                          type: 'string',
                          validation: (rule) => rule.required().max(80),
                        },
                      ],
                      validation: (rule) => rule.unique().max(12),
                    }),
                    defineField({
                      name: 'testimonial',
                      title: 'Depoimento (opcional)',
                      type: 'object',
                      fields: [
                        defineField({
                          name: 'quote',
                          title: 'Depoimento',
                          type: 'text',
                          rows: 4,
                          validation: (rule) => rule.required().max(700),
                        }),
                        defineField({
                          name: 'author',
                          title: 'Nome',
                          type: 'string',
                          validation: (rule) => rule.max(100),
                        }),
                        defineField({
                          name: 'role',
                          title: 'Cargo ou relação com o projeto',
                          type: 'string',
                          validation: (rule) => rule.max(120),
                        }),
                      ],
                    }),
                    defineField({
                      name: 'cover',
                      title: 'Capa do trabalho (opcional)',
                      description:
                        'Imagem principal usada antes das demais mídias. Prefira enquadramento horizontal.',
                      type: 'controlledImage',
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
                              validation: (rule) =>
                                rule.custom((value, context) =>
                                  (context.parent as { kind?: string } | undefined)?.kind !==
                                    'image' && !value
                                    ? 'Informe o link desta mídia.'
                                    : true,
                                ),
                            }),
                            defineField({
                              name: 'image',
                              title: 'Imagem',
                              type: 'controlledImage',
                              hidden: ({ parent }) => parent?.kind !== 'image',
                              validation: (rule) =>
                                rule.custom((value, context) =>
                                  (context.parent as { kind?: string } | undefined)?.kind ===
                                    'image' && !value
                                    ? 'Escolha a imagem.'
                                    : true,
                                ),
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
                      validation: (rule) => rule.max(20),
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
                      validation: (rule) => rule.max(10),
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
              validation: (rule) => rule.max(50),
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
      validation: (rule) => rule.max(30),
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
