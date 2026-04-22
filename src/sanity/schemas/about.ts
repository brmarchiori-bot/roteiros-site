import { defineField, defineType } from 'sanity'
import { photoFields, sectionLayoutFields } from './shared'

export const aboutSchema = defineType({
  name: 'about',
  title: 'Seção Sobre (história de Andressa + Bruno)',
  type: 'document',
  groups: [
    { name: 'content', title: '📝 Conteúdo', default: true },
    { name: 'media', title: '🖼️ Foto da seção' },
    { name: 'layout', title: '📐 Layout' },
  ],
  fields: [
    defineField({
      name: 'meta',
      title: 'Topo da seção',
      description: 'Rótulo pequeno + título grande no topo da seção.',
      group: 'content',
      type: 'object',
      fields: [
        defineField({
          name: 'kicker',
          title: 'Rótulo pequeno (ex: "03 · Quem somos")',
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
      name: 'chapters',
      title: 'Blocos de história (arraste pra reordenar)',
      description:
        'Cada bloco vira um parágrafo estruturado. Podem ter foto opcional por bloco. 1 a 5 blocos.',
      group: 'content',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'chapter',
          fields: [
            defineField({
              name: 'number',
              title: 'Numeração (ex: "Capítulo 01")',
              type: 'string',
              validation: (r) => r.max(30),
            }),
            defineField({
              name: 'title',
              title: 'Título do bloco',
              type: 'string',
              validation: (r) => r.max(60),
            }),
            defineField({
              name: 'body',
              title: 'Texto do bloco',
              description: 'Limite recomendado: 400 caracteres (3-5 linhas).',
              type: 'text',
              rows: 4,
              validation: (r) => r.max(600),
            }),
            defineField({
              name: 'image',
              title: 'Foto do bloco (opcional)',
              description: 'Aparece só neste bloco específico, se preenchida.',
              type: 'image',
              options: { hotspot: true },
              fields: photoFields({ sectionName: 'Capítulo', withCaption: false }),
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'number', media: 'image' },
          },
        },
      ],
      validation: (r) => r.min(1).max(5),
    }),
    defineField({
      name: 'closingCta',
      title: 'Link final da seção (opcional)',
      description: 'Aparece no pé da seção. Aponta pra uma âncora (#now) ou URL externa.',
      group: 'content',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Texto do link',
          type: 'string',
          validation: (r) => r.max(60),
        }),
        defineField({
          name: 'href',
          title: 'Destino (URL completa ou #ancora)',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'photo',
      title: 'Foto principal da seção Sobre',
      description: 'Aparece SÓ aqui, ao lado dos textos. Não afeta capa nem outras seções.',
      group: 'media',
      type: 'image',
      options: { hotspot: true },
      fields: photoFields({ sectionName: 'Sobre' }),
    }),
    ...sectionLayoutFields({ hasImageText: true }).map((f) => ({ ...f, group: 'layout' })),
  ],
  preview: {
    select: { title: 'meta.title', media: 'photo' },
    prepare: ({ title, media }) => ({ title: title || 'Seção Sobre', media }),
  },
})
