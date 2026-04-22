import { defineField, defineType } from 'sanity'
import { sectionLayoutFields } from './shared'

export const nowSchema = defineType({
  name: 'now',
  title: 'Seção Agora — atualiza toda semana',
  type: 'document',
  description:
    'Onde vocês estão agora. Número gigante de dias + cidade + foto da semana + diário curtinho. Troca toda semana.',
  groups: [
    { name: 'conteudo', title: '📝 Conteúdo', default: true },
    { name: 'imagem', title: '🖼️ Imagem' },
    { name: 'aparencia', title: '🎨 Aparência' },
  ],
  fields: [
    defineField({
      name: 'meta',
      title: 'Topo da seção (rótulo + título)',
      description: '📍 Onde aparece: no começo da seção Agora.',
      group: 'conteudo',
      type: 'object',
      fields: [
        defineField({
          name: 'kicker',
          title: 'Rótulo pequeno',
          description: 'Até 30 caracteres. Ex: "04 · Agora".',
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
      name: 'dayCount',
      title: 'Número do dia (ENORME na tela)',
      description:
        '📍 Onde aparece: número gigante em destaque. Dias desde o início da jornada. 👉 Incremente a cada atualização semanal.',
      group: 'conteudo',
      type: 'number',
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'caption',
      title: 'Diário da semana',
      description:
        '📍 Onde aparece: texto corrido abaixo do número do dia. Tom leve, primeira pessoa. 2 a 4 linhas. Recomendado até 300 caracteres.',
      group: 'conteudo',
      type: 'text',
      rows: 4,
      validation: (r) => r.required().max(500),
    }),
    defineField({
      name: 'city',
      title: 'Cidade ou região',
      description: '📍 Onde aparece: em destaque junto do país. Até 40 caracteres.',
      group: 'conteudo',
      type: 'string',
      validation: (r) => r.required().max(40),
    }),
    defineField({
      name: 'state',
      title: 'Detalhe do local (opcional)',
      description: '📍 Onde aparece: complemento da cidade. Ex: "Sertão norte". Até 40 caracteres.',
      group: 'conteudo',
      type: 'string',
      validation: (r) => r.max(40),
    }),
    defineField({
      name: 'country',
      title: 'País',
      description: '📍 Onde aparece: ao lado da cidade. Normalmente "Brasil".',
      group: 'conteudo',
      type: 'string',
      initialValue: 'Brasil',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'period',
      title: 'Período que aparece no site',
      description: '📍 Onde aparece: junto da localização. Ex: "Abril/2026". Até 20 caracteres.',
      group: 'conteudo',
      type: 'string',
      validation: (r) => r.required().max(20),
    }),
    defineField({
      name: 'date',
      title: 'Data da atualização (uso interno + SEO)',
      description:
        '⚙️ Não aparece exatamente assim no site — serve pro Google saber quando foi atualizado.',
      group: 'conteudo',
      type: 'date',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordenadas (opcional)',
      description:
        '📍 Onde aparece: como metadado discreto perto da localização. Ex: "−5.09° S · −42.80° W".',
      group: 'conteudo',
      type: 'string',
      validation: (r) => r.max(40),
    }),
    defineField({
      name: 'cta',
      title: 'Link no final da seção (opcional)',
      description:
        '📍 Onde aparece: no pé da seção Agora. Ex: "Ver no Instagram →". Deixe em branco pra esconder.',
      group: 'conteudo',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Texto do link',
          description: 'Até 60 caracteres.',
          type: 'string',
          validation: (r) => r.max(60),
        }),
        defineField({
          name: 'href',
          title: 'URL de destino',
          description: 'URL completa (https://...).',
          type: 'url',
        }),
      ],
    }),
    defineField({
      name: 'imagemLocal',
      title: 'Foto da semana',
      description:
        '📍 Onde aparece: SÓ na seção Agora, ao lado do texto. 🔄 Troca toda semana junto com o diário.',
      group: 'imagem',
      type: 'controlledImage',
    }),
    ...sectionLayoutFields({ hasImageText: true }).map((f) => ({ ...f, group: 'aparencia' })),
  ],
  preview: {
    select: {
      day: 'dayCount',
      city: 'city',
      country: 'country',
      period: 'period',
      media: 'imagemLocal.image',
    },
    prepare: ({ day, city, country, period, media }) => ({
      title: `Dia ${day ?? '—'} · ${city ?? '—'}${country ? `, ${country}` : ''}`,
      subtitle: period ? `Agora · ${period}` : 'Agora',
      media,
    }),
  },
})
