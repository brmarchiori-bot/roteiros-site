import type { StructureResolver } from 'sanity/structure'

/**
 * Singletons — cada seção é UM documento só.
 * A ordem aqui é a ordem em que aparecem na barra lateral do Studio.
 */
const SINGLETONS: Array<{ id: string; type: string; title: string; emoji: string }> = [
  { id: 'hero-singleton', type: 'hero', title: 'Capa / Hero', emoji: '🎬' },
  { id: 'about-singleton', type: 'about', title: 'Seção Sobre', emoji: '👤' },
  { id: 'now-singleton', type: 'now', title: 'Seção Agora', emoji: '📍' },
  {
    id: 'content-highlights-singleton',
    type: 'contentHighlights',
    title: 'Seção Conteúdo',
    emoji: '🎞️',
  },
  { id: 'faq-singleton', type: 'faq', title: 'Seção FAQ', emoji: '❓' },
]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Menos Roteiros — Conteúdo')
    .items(
      SINGLETONS.map(({ id, type, title, emoji }) =>
        S.listItem()
          .title(`${emoji}  ${title}`)
          .id(id)
          .child(S.document().schemaType(type).documentId(id).title(title)),
      ),
    )

export const SINGLETON_IDS = SINGLETONS.map((s) => s.id)
