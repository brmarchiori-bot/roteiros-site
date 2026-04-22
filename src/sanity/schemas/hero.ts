import { defineField, defineType } from 'sanity'

export const heroSchema = defineType({
  name: 'hero',
  title: 'Capa / Hero (topo do site)',
  type: 'document',
  fields: [
    defineField({
      name: 'meta',
      title: 'Topo da seção (rótulo pequeno)',
      description: 'Aparece bem pequeno, acima do título enorme.',
      type: 'object',
      fields: [
        defineField({
          name: 'kicker',
          title: 'Rótulo pequeno (ex: "01 · Hero")',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'headline',
      title: 'Título grande (aparece na entrada do site)',
      description: 'É a primeira coisa que a pessoa lê quando abre o site. Curto e impactante.',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'subheadline',
      title: 'Subtítulo (texto logo abaixo do título)',
      description: 'Complementa o título com 1 ou 2 frases explicando o projeto.',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'primaryCta',
      title: 'Botão principal (cor sólida)',
      type: 'object',
      fields: [
        defineField({ name: 'label', title: 'Texto do botão', type: 'string' }),
        defineField({
          name: 'href',
          title: 'Para onde o botão leva (URL ou #ancora)',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Botão secundário (estilo discreto)',
      type: 'object',
      fields: [
        defineField({ name: 'label', title: 'Texto do botão', type: 'string' }),
        defineField({
          name: 'href',
          title: 'Para onde o botão leva (URL ou #ancora)',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'coverImage',
      title: '📷 Imagem de capa (opcional — fica atrás do texto)',
      description:
        'Se vazio, a capa fica com o fundo de gradiente atual. Quando você subir uma foto aqui, ela passa a ser o fundo da capa, com o texto sobreposto.',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Descrição da imagem (acessibilidade — obrigatório)',
          type: 'string',
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'objectPosition',
          title: 'Alinhamento da foto (qual parte aparece em foco)',
          description:
            'Se a foto tiver alguém num canto, escolha o canto pra que não seja cortado.',
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
    select: { title: 'headline', subtitle: 'subheadline', media: 'coverImage' },
    prepare: ({ title, subtitle, media }) => ({
      title: title || 'Capa / Hero',
      subtitle: subtitle?.substring(0, 60),
      media,
    }),
  },
})
