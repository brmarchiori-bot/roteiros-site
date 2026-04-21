import { defineField, defineType } from 'sanity'

export const nowSchema = defineType({
  name: 'now',
  title: 'Seção "Agora" (atualizar toda semana)',
  type: 'document',
  fields: [
    defineField({
      name: 'meta',
      title: 'Cabeçalho da seção',
      type: 'object',
      fields: [
        defineField({ name: 'kicker', title: 'Kicker (ex: "04 · Agora")', type: 'string' }),
        defineField({ name: 'title', title: 'Título', type: 'string' }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'dayCount',
      title: 'Dia (número que aparece grande)',
      type: 'number',
      description: 'Contagem de dias desde o início da jornada. Incrementar a cada atualização.',
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'city',
      title: 'Cidade / Região',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'state', title: 'Sub-localização (ex: "Sertão norte")', type: 'string' }),
    defineField({
      name: 'country',
      title: 'País',
      type: 'string',
      initialValue: 'Brasil',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'date',
      title: 'Data (ISO — pra SEO)',
      type: 'date',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'period',
      title: 'Período (display — ex: "Abril/2026")',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordenadas (opcional — ex: "−5.09° S · −42.80° W")',
      type: 'string',
    }),
    defineField({
      name: 'photo',
      title: 'Foto da semana',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          validation: (r) => r.required(),
        }),
        defineField({ name: 'caption', title: 'Legenda', type: 'string' }),
      ],
    }),
    defineField({
      name: 'caption',
      title: 'Diário (2–4 linhas)',
      type: 'text',
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'cta',
      title: 'CTA (opcional)',
      type: 'object',
      fields: [
        defineField({ name: 'label', title: 'Texto do link', type: 'string' }),
        defineField({ name: 'href', title: 'Destino (URL)', type: 'url' }),
      ],
    }),
  ],
  preview: {
    select: { day: 'dayCount', city: 'city', period: 'period' },
    prepare: ({ day, city, period }) => ({
      title: `Dia ${day ?? '—'} · ${city ?? '—'}`,
      subtitle: period,
    }),
  },
})
