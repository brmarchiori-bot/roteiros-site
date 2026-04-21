import type { StructureResolver } from 'sanity/structure'

/**
 * Singletons — cada seção é UM documento só.
 * A barra lateral do Studio mostra um atalho direto, sem menu "Create new".
 */
const SINGLETONS: Array<{ id: string; type: string; title: string }> = [
  { id: 'about-singleton', type: 'about', title: 'Seção "Sobre"' },
  { id: 'now-singleton', type: 'now', title: 'Seção "Agora"' },
  {
    id: 'content-highlights-singleton',
    type: 'contentHighlights',
    title: 'Seção "Conteúdo"',
  },
]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Menos Roteiros — Conteúdo')
    .items(
      SINGLETONS.map(({ id, type, title }) =>
        S.listItem()
          .title(title)
          .id(id)
          .child(S.document().schemaType(type).documentId(id).title(title)),
      ),
    )

/** IDs de singleton — usar em queries via GROQ `*[_id == "about-singleton"][0]` se quiser. */
export const SINGLETON_IDS = SINGLETONS.map((s) => s.id)
