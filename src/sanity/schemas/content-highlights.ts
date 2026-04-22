import { defineField, defineType } from 'sanity'
import { sectionLayoutFields } from './shared'

export const contentHighlightsSchema = defineType({
  name: 'contentHighlights',
  title: 'Seção Conteúdo — destaques e canais',
  type: 'document',
  description:
    'Grade de cards com posts/vídeos + blocos convidando a seguir Instagram e YouTube.',
  groups: [
    { name: 'conteudo', title: '📝 Conteúdo', default: true },
    { name: 'imagem', title: '🖼️ Imagem' },
    { name: 'aparencia', title: '🎨 Aparência' },
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
      title: 'Cards de conteúdo (arraste pra reordenar)',
      description:
        '📍 Onde aparecem: em grade, após a citação. Cada card = imagem de capa + título + link. De 1 a 8 cards. Cada card tem a SUA imagem — nenhuma é compartilhada.',
      group: 'imagem',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'highlight',
          fields: [
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
              validation: (r) =>
                r.required().max(100).warning('Passou de 100 — pode cortar no mobile.'),
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
              description: '📍 Onde aparece: SÓ neste card. Recomendado: foto quadrada.',
              type: 'controlledImage',
              validation: (r) => r.required(),
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
      validation: (r) => r.min(1).max(8),
    }),
    defineField({
      name: 'channels',
      title: 'Blocos "siga nossos canais"',
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
    select: { title: 'meta.title', kicker: 'meta.kicker', cards: 'highlights' },
    prepare: ({ title, kicker, cards }) => {
      const count = Array.isArray(cards) ? cards.length : 0
      return {
        title: title || '⚠️ Seção Conteúdo sem título',
        subtitle: `${kicker ? `Home · ${kicker} · ` : 'Home · '}${count} card${count === 1 ? '' : 's'}`,
      }
    },
  },
})
