import type { StructureResolver } from 'sanity/structure'

/**
 * Singletons — cada seção é UM documento só.
 * A ordem aqui é a ordem em que aparecem na barra lateral do Studio.
 */
const HOME_SINGLETONS: Array<{ id: string; type: string; title: string }> = [
  { id: 'hero-singleton', type: 'hero', title: '01 · Capa e abertura' },
  { id: 'now-singleton', type: 'now', title: '02 · Agora' },
  { id: 'about-singleton', type: 'about', title: '03 · Nossa história' },
  { id: 'pillars-singleton', type: 'pillars', title: '04 · O que você vai encontrar' },
  {
    id: 'content-highlights-singleton',
    type: 'contentHighlights',
    title: '05 · Continuidade',
  },
  {
    id: 'partnerships-singleton',
    type: 'partnerships',
    title: '06 · Parcerias',
  },
  { id: 'faq-singleton', type: 'faq', title: '07 · Perguntas frequentes' },
]

const PRIVATE_SINGLETON = {
  id: 'private-portfolio-singleton',
  type: 'privatePortfolio',
  title: 'Portfólio',
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Conteúdo do site')
    .items([
      S.listItem()
        .title('Home — editar por seção')
        .id('home-editorial')
        .child(
          S.list()
            .title('Home')
            .items(
              HOME_SINGLETONS.map(({ id, type, title }) =>
                S.listItem()
                  .title(title)
                  .id(id)
                  .child(S.document().schemaType(type).documentId(id).title(title)),
              ),
            ),
        ),
      S.listItem()
        .title('Área privada')
        .id('private-editorial')
        .child(
          S.list()
            .title('Área privada')
            .items([
              S.listItem()
                .title(PRIVATE_SINGLETON.title)
                .id(PRIVATE_SINGLETON.id)
                .child(
                  S.document()
                    .schemaType(PRIVATE_SINGLETON.type)
                    .documentId(PRIVATE_SINGLETON.id)
                    .title(PRIVATE_SINGLETON.title),
                ),
            ]),
        ),
    ])

export const SINGLETON_IDS = [...HOME_SINGLETONS, PRIVATE_SINGLETON].map((s) => s.id)
