import { defineField, defineType } from 'sanity'
import { photoFields, sectionLayoutFields } from './shared'

export const heroSchema = defineType({
  name: 'hero',
  title: 'Capa / Hero (topo do site)',
  type: 'document',
  groups: [
    { name: 'content', title: '📝 Conteúdo', default: true },
    { name: 'media', title: '🖼️ Imagem de capa' },
    { name: 'layout', title: '📐 Layout' },
  ],
  fields: [
    defineField({
      name: 'meta',
      title: 'Topo da seção (rótulo pequeno)',
      description: 'Texto minúsculo acima do título enorme.',
      group: 'content',
      type: 'object',
      fields: [
        defineField({
          name: 'kicker',
          title: 'Rótulo (ex: "01 · Hero")',
          type: 'string',
          validation: (r) => r.max(30),
        }),
      ],
    }),
    defineField({
      name: 'headline',
      title: 'Título grande (primeira coisa que lê-se no site)',
      description: 'Curto e impactante. Limite recomendado: 60 caracteres.',
      group: 'content',
      type: 'string',
      validation: (r) =>
        r.required().max(80).warning('Passou de 60 caracteres — pode ficar longo visualmente.'),
    }),
    defineField({
      name: 'subheadline',
      title: 'Subtítulo (frase de apoio logo abaixo)',
      description: '1 ou 2 frases que explicam o projeto. Limite recomendado: 180 caracteres.',
      group: 'content',
      type: 'text',
      rows: 3,
      validation: (r) =>
        r.required().max(240).warning('Passou de 180 — pode quebrar muito no mobile.'),
    }),
    defineField({
      name: 'primaryCta',
      title: 'Botão principal (cor sólida)',
      group: 'content',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Texto do botão',
          type: 'string',
          validation: (r) => r.max(30),
        }),
        defineField({
          name: 'href',
          title: 'Para onde leva (URL ou #ancora da mesma página)',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Botão secundário (estilo discreto com seta)',
      group: 'content',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Texto do botão',
          type: 'string',
          validation: (r) => r.max(30),
        }),
        defineField({ name: 'href', title: 'Destino', type: 'string' }),
      ],
    }),
    defineField({
      name: 'coverImage',
      title: 'Imagem de capa (opcional — substitui o gradiente)',
      description:
        'Se vazio, a capa mantém o gradiente atual. Se preenchido, vira o fundo da capa (com o texto sobreposto). Afeta SOMENTE a capa.',
      group: 'media',
      type: 'image',
      options: { hotspot: true },
      fields: photoFields({ sectionName: 'Capa', withCaption: false }),
    }),
    ...sectionLayoutFields().map((f) => ({ ...f, group: 'layout' })),
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
