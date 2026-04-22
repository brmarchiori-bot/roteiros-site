import { defineField, defineType } from 'sanity'

export const nowSchema = defineType({
  name: 'now',
  title: 'Seção Agora (atualiza toda semana)',
  type: 'document',
  fields: [
    defineField({
      name: 'meta',
      title: 'Topo da seção',
      type: 'object',
      fields: [
        defineField({
          name: 'kicker',
          title: 'Rótulo pequeno (ex: "04 · Agora")',
          type: 'string',
        }),
        defineField({ name: 'title', title: 'Título grande', type: 'string' }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'dayCount',
      title: 'Número do dia (aparece ENORME na tela)',
      description: 'Contagem de dias desde o início da jornada. Incrementar a cada atualização.',
      type: 'number',
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'city',
      title: 'Onde você está (cidade ou região)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'state',
      title: 'Detalhe do local (opcional — ex: "Sertão norte")',
      type: 'string',
    }),
    defineField({
      name: 'country',
      title: 'País',
      type: 'string',
      initialValue: 'Brasil',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'date',
      title: 'Data atual (calendário)',
      description: 'Usada pra SEO — a data do último update.',
      type: 'date',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'period',
      title: 'Período que aparece no site (ex: "Abril/2026")',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordenadas do mapa (opcional — ex: "−5.09° S · −42.80° W")',
      description: 'Detalhe editorial, dá tato de "estamos realmente lá".',
      type: 'string',
    }),
    defineField({
      name: 'photo',
      title: '📷 Foto da seção Agora (troca toda semana)',
      description:
        'Esta foto aparece SÓ na seção Agora. Não mexe na capa nem na seção Sobre.',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Descrição da foto (acessibilidade)',
          type: 'string',
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'caption',
          title: 'Legenda da foto (ex: "Piauí · Abril/2026")',
          type: 'string',
        }),
        defineField({
          name: 'objectPosition',
          title: 'Alinhamento da foto (qual parte aparece em foco)',
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
    defineField({
      name: 'caption',
      title: 'Diário da semana (2-4 linhas sobre o que aconteceu)',
      description: 'Tom leve e real. Conta o que deu certo, o que deu errado, próxima parada.',
      type: 'text',
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'cta',
      title: 'Link no final da seção (opcional — ex: "Ver no Instagram")',
      type: 'object',
      fields: [
        defineField({ name: 'label', title: 'Texto do link', type: 'string' }),
        defineField({ name: 'href', title: 'Destino (URL)', type: 'url' }),
      ],
    }),
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
