import { defineField, defineType } from 'sanity'
import { sectionLayoutFields } from './shared'

export const nowSchema = defineType({
  name: 'now',
  title: 'Agora',
  type: 'document',
  description:
    'O capítulo presente da jornada. Atualize somente quando a cidade, a etapa ou a história realmente mudar.',
  groups: [
    { name: 'conteudo', title: 'Conteúdo principal', default: true },
    { name: 'imagem', title: 'Fotografia' },
    { name: 'aparencia', title: 'Enquadramento' },
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
      title: 'Número do dia (opcional)',
      description:
        'Exiba somente quando a contagem estiver confirmada. Deixe vazio para não mostrar.',
      group: 'conteudo',
      type: 'number',
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'journeyState',
      title: 'Estado da jornada',
      description: 'Uma nota factual curta. Ex.: em deslocamento, pausa ou nova etapa.',
      group: 'conteudo',
      type: 'string',
      validation: (r) => r.max(80),
    }),
    defineField({
      name: 'caption',
      title: 'Nota do capítulo atual',
      description:
        'Texto curto em primeira pessoa. Atualize quando houver algo que mereça registro.',
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
      title: 'Imagem documental principal',
      description:
        'Priorize pessoas, gestos e situações reais. A seção funciona também sem imagem.',
      group: 'imagem',
      type: 'controlledImage',
    }),
    defineField({
      name: 'imagemSecundaria',
      title: 'Imagem secundária (opcional)',
      description:
        'Use apenas quando um segundo detalhe acrescentar contexto. Evite repetir o mesmo enquadramento.',
      group: 'imagem',
      type: 'controlledImage',
    }),
    defineField({
      name: 'atmosphere',
      title: 'Atmosfera visual',
      description: 'Escolha pela emoção do registro, não pela cor da fotografia.',
      group: 'aparencia',
      type: 'string',
      initialValue: 'charcoal',
      options: {
        layout: 'radio',
        list: [
          { title: 'Carvão — denso e silencioso', value: 'charcoal' },
          { title: 'Sertão — terroso e presente', value: 'field' },
          { title: 'Papel — leve e contemplativo', value: 'paper' },
        ],
      },
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
      title: 'Agora',
      subtitle:
        [day ? `Dia ${day}` : '', city, country, period].filter(Boolean).join(' · ') ||
        'Registro atual da jornada',
      media,
    }),
  },
})
