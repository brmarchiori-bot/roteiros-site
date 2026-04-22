import { defineField, defineType } from 'sanity'
import { sectionLayoutFields } from './shared'

export const aboutSchema = defineType({
  name: 'about',
  title: 'Seção Sobre — história de Andressa + Bruno',
  type: 'document',
  description:
    'Aparece após a capa. Foto principal do casal + blocos de história (capítulos). Cada bloco pode ter uma foto própria.',
  groups: [
    { name: 'conteudo', title: '📝 Conteúdo', default: true },
    { name: 'imagem', title: '🖼️ Imagem' },
    { name: 'aparencia', title: '🎨 Aparência' },
  ],
  fields: [
    defineField({
      name: 'meta',
      title: 'Topo da seção (rótulo + título)',
      description: '📍 Onde aparece: no começo da seção Sobre.',
      group: 'conteudo',
      type: 'object',
      fields: [
        defineField({
          name: 'kicker',
          title: 'Rótulo pequeno (opcional)',
          description: 'Até 30 caracteres. Ex: "03 · Quem somos".',
          type: 'string',
          validation: (r) => r.max(30),
        }),
        defineField({
          name: 'title',
          title: 'Título grande',
          description: 'Até 60 caracteres.',
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
        '📍 Onde aparecem: um abaixo do outro, após o título. Cada bloco vira um parágrafo com número + título + texto + foto opcional. De 1 a 5 blocos.',
      group: 'conteudo',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'chapter',
          fields: [
            defineField({
              name: 'number',
              title: 'Numeração',
              description: 'Até 30 caracteres. Ex: "Capítulo 01".',
              type: 'string',
              validation: (r) => r.max(30),
            }),
            defineField({
              name: 'title',
              title: 'Título do bloco',
              description: 'Até 60 caracteres.',
              type: 'string',
              validation: (r) => r.max(60),
            }),
            defineField({
              name: 'body',
              title: 'Texto do bloco',
              description: 'Recomendado até 400 caracteres (3-5 linhas).',
              type: 'text',
              rows: 4,
              validation: (r) => r.max(600),
            }),
            defineField({
              name: 'imagem',
              title: 'Foto do bloco (opcional)',
              description:
                '📍 Onde aparece: apenas neste bloco específico, ao lado do texto. Deixe vazio pra bloco só com texto.',
              type: 'controlledImage',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'number',
              media: 'imagem.image',
            },
            prepare: ({ title, subtitle, media }) => ({
              title: title || '⚠️ Bloco sem título',
              subtitle: subtitle || 'Sem numeração',
              media,
            }),
          },
        },
      ],
      validation: (r) => r.min(1).max(5),
    }),
    defineField({
      name: 'closingCta',
      title: 'Link no final da seção (opcional)',
      description:
        '📍 Onde aparece: no pé da seção Sobre, depois do último bloco. Pra levar o leitor pra outra seção ou link externo.',
      group: 'conteudo',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Texto do link',
          description: 'Até 60 caracteres. Ex: "Veja onde estamos agora →".',
          type: 'string',
          validation: (r) => r.max(60),
        }),
        defineField({
          name: 'href',
          title: 'Pra onde leva',
          description: 'URL completa ou âncora (#now).',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'imagemPrincipal',
      title: 'Foto principal da seção Sobre',
      description:
        '📍 Onde aparece: SÓ na seção Sobre, ao lado dos textos. Não afeta capa nem outras seções. Recomendado: foto vertical ou quadrada.',
      group: 'imagem',
      type: 'controlledImage',
    }),
    ...sectionLayoutFields({ hasImageText: true }).map((f) => ({ ...f, group: 'aparencia' })),
  ],
  preview: {
    select: {
      title: 'meta.title',
      kicker: 'meta.kicker',
      media: 'imagemPrincipal.image',
    },
    prepare: ({ title, kicker, media }) => ({
      title: title || '⚠️ Seção Sobre sem título',
      subtitle: kicker ? `Home · ${kicker}` : 'Home · Seção Sobre',
      media,
    }),
  },
})
