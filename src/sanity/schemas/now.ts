import { defineField, defineType } from 'sanity'
import { photoFields, sectionLayoutFields } from './shared'

export const nowSchema = defineType({
  name: 'now',
  title: 'Seção Agora (atualiza toda semana)',
  type: 'document',
  groups: [
    { name: 'content', title: '📝 Conteúdo', default: true },
    { name: 'media', title: '🖼️ Foto da semana' },
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
          title: 'Rótulo pequeno (ex: "04 · Agora")',
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
      name: 'dayCount',
      title: 'Número do dia (aparece ENORME na tela)',
      description: 'Dias desde o início da jornada. Incrementar a cada atualização.',
      group: 'content',
      type: 'number',
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'city',
      title: 'Onde você está (cidade ou região)',
      group: 'content',
      type: 'string',
      validation: (r) => r.required().max(40),
    }),
    defineField({
      name: 'state',
      title: 'Detalhe do local (opcional — ex: "Sertão norte")',
      group: 'content',
      type: 'string',
      validation: (r) => r.max(40),
    }),
    defineField({
      name: 'country',
      title: 'País',
      group: 'content',
      type: 'string',
      initialValue: 'Brasil',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'date',
      title: 'Data atual (pro SEO)',
      group: 'content',
      type: 'date',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'period',
      title: 'Período que aparece no site (ex: "Abril/2026")',
      group: 'content',
      type: 'string',
      validation: (r) => r.required().max(20),
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordenadas do mapa (opcional — ex: "−5.09° S · −42.80° W")',
      group: 'content',
      type: 'string',
      validation: (r) => r.max(40),
    }),
    defineField({
      name: 'caption',
      title: 'Diário da semana (2-4 linhas sobre o que aconteceu)',
      description: 'Tom leve e real. Limite recomendado: 300 caracteres.',
      group: 'content',
      type: 'text',
      rows: 4,
      validation: (r) => r.required().max(500),
    }),
    defineField({
      name: 'cta',
      title: 'Link no final (opcional — ex: "Ver no Instagram")',
      group: 'content',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Texto do link',
          type: 'string',
          validation: (r) => r.max(60),
        }),
        defineField({ name: 'href', title: 'Destino (URL)', type: 'url' }),
      ],
    }),
    defineField({
      name: 'photo',
      title: 'Foto da semana',
      description: 'Aparece SÓ na seção Agora. Troca toda semana junto com o diário.',
      group: 'media',
      type: 'image',
      options: { hotspot: true },
      fields: photoFields({ sectionName: 'Agora' }),
    }),
    ...sectionLayoutFields({ hasImageText: true }).map((f) => ({ ...f, group: 'layout' })),
  ],
  preview: {
    select: { day: 'dayCount', city: 'city', period: 'period', media: 'photo' },
    prepare: ({ day, city, period, media }) => ({
      title: `Dia ${day ?? '—'} · ${city ?? '—'}`,
      subtitle: period,
      media,
    }),
  },
})
