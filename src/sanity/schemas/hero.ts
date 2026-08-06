import { defineField, defineType } from 'sanity'
import { HeroHelpInput } from './hero-help'
import { sectionLayoutFields } from './shared'
import { initialHero } from '@/sanity/initial-values'

export const heroSchema = defineType({
  name: 'hero',
  title: 'Capa e abertura',
  type: 'document',
  initialValue: initialHero,
  description:
    'Primeira tela do site: título grande + frase de apoio + botão principal + imagem de fundo opcional.',
  groups: [
    { name: 'conteudo', title: 'Textos e botões', default: true },
    { name: 'imagem', title: 'Foto da capa' },
    { name: 'aparencia', title: 'Ajustes visuais (opcional)' },
  ],
  fields: [
    defineField({
      name: 'meta',
      title: 'Rótulo pequeno no topo (opcional)',
      description:
        '📍 Onde aparece: linha minúscula acima do título grande (ex: "01 · Hero"). Deixe vazio se não quiser rótulo.',
      group: 'conteudo',
      type: 'object',
      fields: [
        defineField({
          name: 'kicker',
          title: 'Texto do rótulo',
          description: 'Até 30 caracteres.',
          type: 'string',
          validation: (r) => r.max(30),
        }),
      ],
    }),

    /* ----- Helper block: como funciona o título ----- */
    defineField({
      name: 'heroHelp',
      title: 'Como funciona o título',
      type: 'string',
      group: 'conteudo',
      readOnly: true,
      components: { input: HeroHelpInput },
    }),

    /* ----- Título em 3 campos (2 com animação, 1 fallback) ----- */
    defineField({
      name: 'titlePrefix',
      title: 'Início do título',
      description: 'Parte inicial da frase. Ex: "Viajando o mundo e"',
      group: 'conteudo',
      type: 'string',
      validation: (r) => r.max(80),
    }),
    defineField({
      name: 'dynamicWords',
      title: 'Frases animadas',
      description:
        'Essas frases vão aparecer uma por vez no final do título.\n\nExemplo:\n- vivendo sem roteiro\n- errando de verdade\n\nMínimo: 2 frases para ativar animação\nMáximo: 8 frases',
      group: 'conteudo',
      type: 'array',
      of: [
        {
          type: 'string',
          validation: (r) => r.max(60),
        },
      ],
      validation: (r) => r.max(8).error('Máximo 8 frases — mantenha curto.'),
    }),
    defineField({
      name: 'headline',
      title: 'Título principal',
      description:
        'Use esse campo se quiser um título fixo, sem animação.\nSe preencher “Início do título” e pelo menos duas “Frases animadas”, este campo será ignorado.',
      group: 'conteudo',
      type: 'string',
      validation: (r) =>
        r.max(80).warning('Passou de 60 caracteres — pode ficar longo visualmente.'),
    }),

    /* ----- Resto do conteúdo ----- */
    defineField({
      name: 'subheadline',
      title: 'Frase de apoio',
      description:
        '📍 Onde aparece: logo abaixo do título. Frase de apoio, 1 ou 2 linhas. Recomendado até 180 caracteres.',
      group: 'conteudo',
      type: 'text',
      rows: 3,
      validation: (r) => [
        r.required().error('O subtítulo é obrigatório.'),
        r.max(240).warning('Passou de 180 — pode quebrar muito no mobile.'),
      ],
    }),
    defineField({
      name: 'primaryCta',
      title: 'Convite principal',
      description:
        '📍 Onde aparece: abaixo do subtítulo, estilo destaque. Deixe sem texto pra esconder.',
      group: 'conteudo',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Texto do botão',
          description: 'Até 30 caracteres. Ex: "Quero acompanhar a jornada".',
          type: 'string',
          validation: (r) => r.max(30),
        }),
        defineField({
          name: 'href',
          title: 'Pra onde leva',
          description:
            'URL completa (https://...) ou âncora da mesma página (#sobre, #now, #conteudo).',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'imagemFundo',
      title: 'Fotografia principal',
      description:
        '📍 Onde aparece: fundo da capa, com o texto sobreposto. ⚠️ Se vazio, a capa mantém o gradiente padrão. Recomendado: foto horizontal, pelo menos 2000px de largura. Afeta SÓ a capa.',
      group: 'imagem',
      type: 'controlledImage',
    }),
    ...sectionLayoutFields().map((f) => ({ ...f, group: 'aparencia' })),
  ],
  preview: {
    select: {
      headline: 'headline',
      titlePrefix: 'titlePrefix',
      words: 'dynamicWords',
      subtitle: 'subheadline',
      media: 'imagemFundo.image',
    },
    prepare: ({ headline, titlePrefix, words, subtitle, media }) => {
      // Filtra frases válidas pra decidir se a rotação está ativa
      const validWords = Array.isArray(words)
        ? (words as unknown[]).filter(
            (w): w is string => typeof w === 'string' && w.trim().length >= 3,
          )
        : []
      const hasRotator =
        typeof titlePrefix === 'string' &&
        titlePrefix.trim().length > 0 &&
        validWords.length >= 2

      const display = hasRotator
        ? `${titlePrefix} [${validWords.join(' · ')}]`
        : headline

      return {
        title: 'Capa e abertura',
        subtitle: display || subtitle?.substring(0, 60) || 'Primeira cena da Home',
        media,
      }
    },
  },
})
