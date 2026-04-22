import { defineField, defineType } from 'sanity'

export const aboutSchema = defineType({
  name: 'about',
  title: 'Seção Sobre (história de Andressa + Bruno)',
  type: 'document',
  fields: [
    defineField({
      name: 'meta',
      title: 'Topo da seção',
      description: 'Rótulo pequeno + título grande no topo da seção.',
      type: 'object',
      fields: [
        defineField({
          name: 'kicker',
          title: 'Rótulo pequeno (ex: "03 · Quem somos")',
          type: 'string',
        }),
        defineField({ name: 'title', title: 'Título grande', type: 'string' }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'chapters',
      title: 'Blocos de história (3 recomendados)',
      description: 'Cada bloco vira um parágrafo estruturado na seção.',
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
            }),
            defineField({ name: 'title', title: 'Título do bloco', type: 'string' }),
            defineField({ name: 'body', title: 'Texto do bloco', type: 'text', rows: 4 }),
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
      title: 'Link final da seção (opcional)',
      description: 'Aparece no pé da seção. Pode apontar pra uma âncora (#now) ou URL externa.',
      type: 'object',
      fields: [
        defineField({ name: 'label', title: 'Texto do link', type: 'string' }),
        defineField({
          name: 'href',
          title: 'Destino (URL completa ou #ancora da mesma página)',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'photo',
      title: '📷 Foto da seção Sobre (à esquerda dos textos)',
      description:
        'Esta foto aparece SÓ aqui na seção Sobre. Não afeta a capa nem nenhuma outra parte do site.',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Descrição da foto (acessibilidade — obrigatório)',
          description: 'Descreva o que a foto mostra pra quem usa leitor de tela.',
          type: 'string',
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'caption',
          title: 'Legenda visível (aparece pequena, abaixo da foto)',
          type: 'string',
        }),
        defineField({
          name: 'objectPosition',
          title: 'Alinhamento da foto (qual parte aparece em foco)',
          description: 'Se a foto tiver gente num canto, escolhe onde focar.',
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
    select: { title: 'meta.title', media: 'photo' },
    prepare: ({ title, media }) => ({ title: title || 'Seção Sobre', media }),
  },
})
