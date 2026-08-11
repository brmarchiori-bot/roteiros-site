import type { PrivatePortfolio } from '@/types/portfolio'

/** Estado editorial seguro usado somente enquanto não existe um singleton publicado. */
export const emptyPortfolio: PrivatePortfolio = {
  privacyLabel: 'Portfólio privado',
  kicker: 'Portfólio',
  title: 'Seleção em preparação.',
  introduction: 'Estamos organizando os trabalhos que farão parte desta apresentação.',
  initialProjectCount: 9,
  loadMoreLabel: 'Carregar mais projetos',
  contact: { title: 'Quer conversar sobre um projeto?' },
  footer: { text: 'Portfólio privado · não indexado', links: [] },
  projects: [],
}
