import { defineField, defineType } from 'sanity'
import { sectionLayoutFields } from './shared'

export const heroSchema = defineType({
  name: 'hero',
  title: 'Capa / Hero — topo da home',
  type: 'document',
  description:
    'Primeira tela do site: título grande + frase de apoio + dois botões + imagem de fundo opcional.',
  groups: [
    { name: 'conteudo', title: '📝 Conteúdo', default: true },
    { name: 'imagem', title: '🖼️ Imagem' },
    { name: 'aparencia', title: '🎨 Aparência' },
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
    defineField({
      name: 'titlePrefix',
      title: 'Começo do título (frase fixa)',
      description:
        '📍 Onde aparece: primeira parte do título grande — fica FIXA na tela. Ex: "Viajando o mundo e". Deixe vazio pra usar o "Título grande" (abaixo) como versão estática.',
      group: 'conteudo',
      type: 'string',
      validation: (r) => r.max(80),
    }),
    defineField({
      name: 'dynamicWords',
      title: 'Palavras dinâmicas (trocam suavemente)',
      description:
        '📍 Onde aparece: depois do "Começo do título", alternando com fade a cada ~3.2s. Pode ser palavra ou frase curta (ex: "vivendo sem roteiro"). Mínimo 2 entradas pra ativar rotação — se tiver menos, usa "Título grande". Máximo 8.',
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
      title: 'Título grande (estático — usado se não tiver rotação)',
      description:
        '📍 Onde aparece: PRIMEIRA coisa que a pessoa lê. Só é usado se "Começo do título" OU "Palavras dinâmicas" estiverem vazios. Curto e impactante. Recomendado até 60 caracteres.',
      group: 'conteudo',
      type: 'string',
      validation: (r) =>
        r.max(80).warning('Passou de 60 caracteres — pode ficar longo visualmente.'),
    }),
    defineField({
      name: 'subheadline',
      title: 'Subtítulo',
      description:
        '📍 Onde aparece: logo abaixo do título grande. Frase de apoio, 1 ou 2 linhas. Recomendado até 180 caracteres.',
      group: 'conteudo',
      type: 'text',
      rows: 3,
      validation: (r) =>
        r.required().max(240).warning('Passou de 180 — pode quebrar muito no mobile.'),
    }),
    defineField({
      name: 'primaryCta',
      title: 'Botão principal (cor sólida)',
      description:
        '📍 Onde aparece: abaixo do subtítulo, estilo destaque. Deixe sem texto pra esconder.',
      group: 'conteudo',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Texto do botão',
          description: 'Até 30 caracteres. Ex: "Seguir a jornada".',
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
      name: 'secondaryCta',
      title: 'Botão secundário (estilo discreto, com seta)',
      description: '📍 Onde aparece: ao lado do botão principal. Opcional.',
      group: 'conteudo',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Texto do botão',
          description: 'Até 30 caracteres. Ex: "Saber mais".',
          type: 'string',
          validation: (r) => r.max(30),
        }),
        defineField({
          name: 'href',
          title: 'Pra onde leva',
          description: 'URL completa ou âncora (#sobre, #now, etc).',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'imagemFundo',
      title: 'Imagem de fundo da capa (opcional)',
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
      const hasRotator =
        typeof titlePrefix === 'string' &&
        titlePrefix.trim().length > 0 &&
        Array.isArray(words) &&
        words.length > 0
      const display = hasRotator
        ? `${titlePrefix} [${(words as string[]).join(' · ')}]`
        : headline || '⚠️ Capa sem título'
      return {
        title: display,
        subtitle: subtitle ? `Home · ${subtitle.substring(0, 60)}` : 'Home · Seção 1',
        media,
      }
    },
  },
})
