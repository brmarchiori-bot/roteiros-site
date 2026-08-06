import { defineField, defineType } from 'sanity'
import { sectionLayoutFields } from './shared'
import { initialContentHighlights } from '@/sanity/initial-values'

export const contentHighlightsSchema = defineType({
  name: 'contentHighlights',
  title: 'Continuidade',
  type: 'document',
  initialValue: initialContentHighlights,
  description:
    'Grade de cards com posts/vídeos + blocos convidando a seguir Instagram e YouTube.',
  groups: [
    { name: 'conteudo', title: 'Título e canais', default: true },
    { name: 'imagem', title: 'Conteúdos em destaque' },
    { name: 'aparencia', title: 'Ajustes visuais (opcional)' },
  ],
  fields: [
    defineField({
      name: 'meta',
      title: 'Topo da seção (rótulo + título)',
      description: '📍 Onde aparece: no começo da seção Conteúdo.',
      group: 'conteudo',
      type: 'object',
      fields: [
        defineField({
          name: 'kicker',
          title: 'Rótulo pequeno',
          description: 'Até 30 caracteres. Ex: "06 · Conteúdo".',
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
      name: 'pullQuote',
      title: 'Citação em itálico (opcional)',
      description:
        '📍 Onde aparece: entre o título e os cards, em itálico. Uma frase que resume o tom editorial. Até 300 caracteres.',
      group: 'conteudo',
      type: 'text',
      rows: 3,
      validation: (r) => r.max(300),
    }),
    defineField({
      name: 'highlights',
      title: 'Histórias em destaque',
      description:
        '📍 Onde aparecem: em grade, após a citação. Escolha até 3 trabalhos que ainda representem bem o projeto; não precisa atualizar toda semana.',
      group: 'imagem',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'highlight',
          fields: [
            defineField({
              name: 'isVisible',
              title: 'Mostrar este conteúdo na home',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'platform',
              title: 'Rede social',
              description: 'Mostra o ícone correto no card.',
              type: 'string',
              options: {
                list: [
                  { title: '📸 Instagram', value: 'instagram' },
                  { title: '▶️ YouTube', value: 'youtube' },
                  { title: '🎵 TikTok', value: 'tiktok' },
                ],
                layout: 'radio',
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'title',
              title: 'Título do card',
              description: '📍 Onde aparece: abaixo da imagem. Recomendado até 100 caracteres.',
              type: 'string',
              validation: (r) => [
                r.required().error('O título do card é obrigatório.'),
                r.max(100).warning('Passou de 100 — pode cortar no mobile.'),
              ],
            }),
            defineField({
              name: 'url',
              title: 'Link pro post/vídeo',
              description: 'URL completa (https://...).',
              type: 'url',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'imagemCapa',
              title: 'Imagem de capa do card',
              description:
                'Opcional. Recomendado: vertical 3:4, ao menos 1200px. Sem imagem, o card usa uma composição textual compacta.',
              type: 'controlledImage',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'platform',
              media: 'imagemCapa.image',
            },
            prepare: ({ title, subtitle, media }) => ({
              title: title || '⚠️ Card sem título',
              subtitle: subtitle ? `📱 ${subtitle}` : 'Sem rede definida',
              media,
            }),
          },
        },
      ],
      validation: (r) => r.max(3),
    }),
    defineField({
      name: 'channels',
      title: 'Canais',
      description: '📍 Onde aparecem: abaixo dos cards, convidando a seguir os canais.',
      group: 'conteudo',
      type: 'object',
      fields: [
        defineField({
          name: 'instagram',
          title: '📸 Bloco Instagram',
          type: 'object',
          fields: [
            defineField({
              name: 'url',
              title: 'Link do perfil',
              description: 'URL completa do Instagram.',
              type: 'url',
            }),
            defineField({
              name: 'cta',
              title: 'Texto do botão',
              description: 'Até 40 caracteres. Ex: "Seguir no Instagram".',
              type: 'string',
              validation: (r) => r.max(40),
            }),
            defineField({
              name: 'note',
              title: 'Frase em itálico (opcional)',
              description: 'Até 100 caracteres. Aparece pequena, abaixo do botão.',
              type: 'string',
              validation: (r) => r.max(100),
            }),
          ],
        }),
        defineField({
          name: 'youtube',
          title: '▶️ Bloco YouTube',
          type: 'object',
          fields: [
            defineField({
              name: 'url',
              title: 'Link do canal',
              description: 'URL completa do YouTube.',
              type: 'url',
            }),
            defineField({
              name: 'cta',
              title: 'Texto do botão',
              description: 'Até 40 caracteres. Ex: "Inscrever no canal".',
              type: 'string',
              validation: (r) => r.max(40),
            }),
            defineField({
              name: 'note',
              title: 'Frase em itálico (opcional)',
              description: 'Até 100 caracteres.',
              type: 'string',
              validation: (r) => r.max(100),
            }),
          ],
        }),
      ],
    }),
    ...sectionLayoutFields().map((f) => ({ ...f, group: 'aparencia' })),
  ],
  preview: {
    select: { kicker: 'meta.kicker', cards: 'highlights' },
    prepare: ({ kicker, cards }) => {
      const count = Array.isArray(cards) ? cards.length : 0
      return {
        title: 'Continuidade',
        subtitle: `${kicker ? `Home · ${kicker} · ` : 'Home · '}${count} card${count === 1 ? '' : 's'}`,
      }
    },
  },
})
