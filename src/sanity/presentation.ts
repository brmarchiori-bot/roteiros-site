import { defineLocations, type DocumentLocationResolvers } from 'sanity/presentation'

const homeLocations: DocumentLocationResolvers = {
  hero: defineLocations({
    select: {},
    resolve: () => ({
      locations: [{ title: 'Capa e abertura', href: '/' }],
    }),
  }),
  now: defineLocations({
    select: {},
    resolve: () => ({
      locations: [{ title: 'Agora', href: '/' }],
    }),
  }),
  about: defineLocations({
    select: {},
    resolve: () => ({
      locations: [{ title: 'Nossa história', href: '/' }],
    }),
  }),
  pillars: defineLocations({
    select: {},
    resolve: () => ({
      locations: [{ title: 'O que você vai encontrar', href: '/#pillars' }],
    }),
  }),
  contentHighlights: defineLocations({
    select: {},
    resolve: () => ({
      locations: [{ title: 'Continuidade', href: '/' }],
    }),
  }),
  partnerships: defineLocations({
    select: {},
    resolve: () => ({
      locations: [{ title: 'Parcerias', href: '/' }],
    }),
  }),
  faq: defineLocations({
    select: {},
    resolve: () => ({
      locations: [{ title: 'Perguntas frequentes', href: '/' }],
    }),
  }),
}

export const presentationResolve = {
  locations: homeLocations,
  mainDocuments: [
    { route: '/', type: 'hero' },
    { route: '/', type: 'now' },
    { route: '/', type: 'about' },
    { route: '/', type: 'pillars' },
    { route: '/', type: 'contentHighlights' },
    { route: '/', type: 'partnerships' },
    { route: '/', type: 'faq' },
  ],
}
