import { defineArrayMember, defineField, defineType } from 'sanity'
import { PORTFOLIO_CATEGORY_LABELS, PORTFOLIO_RESPONSIBILITIES } from '@/types/portfolio'

const categories = Object.entries(PORTFOLIO_CATEGORY_LABELS).map(([value, title]) => ({ title, value }))
const projectTypes = [
  { title: 'Audiovisual', value: 'audiovisual' },
  { title: 'Fotografia', value: 'photography' },
  { title: 'Digital', value: 'digital' },
  { title: 'Híbrido', value: 'hybrid' },
]
const responsibilities = PORTFOLIO_RESPONSIBILITIES.map((title) => ({ title, value: title }))

const videoFields = [
  defineField({ name: 'source', title: 'Como adicionar o vídeo?', description: 'Envie um arquivo MOV, MP4 ou WebM aqui, ou use um link público do YouTube, Vimeo ou de um arquivo de vídeo.', type: 'string', initialValue: 'upload', options: { list: [{ title: 'Enviar arquivo pelo Studio', value: 'upload' }, { title: 'Colar link público', value: 'url' }], layout: 'radio' } }),
  defineField({ name: 'file', title: 'Arquivo do vídeo', description: 'Aceita MOV, MP4 e WebM. Para maior compatibilidade na web, recomendamos MP4. Para Reels, use 1080 × 1920.', type: 'file', options: { accept: '.mov,.mp4,.webm,video/quicktime,video/mp4,video/webm' }, hidden: ({ parent }) => parent?.source === 'url', validation: (r) => r.custom((value, context) => { const parent = context.parent as { source?: string; url?: string } | undefined; return parent?.source === 'url' || parent?.url || value ? true : 'Envie o arquivo do vídeo.' }) }),
  defineField({ name: 'url', title: 'Link público do vídeo', description: 'Aceita YouTube, Vimeo ou URL direta terminada em .mov, .mp4 ou .webm. Links de páginas do Instagram não são arquivos de vídeo.', type: 'url', hidden: ({ parent }) => parent?.source !== 'url' && Boolean(parent?.source), validation: (r) => r.custom((value, context) => { const parent = context.parent as { source?: string; file?: unknown } | undefined; return parent?.source === 'upload' || parent?.file || value ? true : 'Cole o link público do vídeo.' }) }),
  defineField({ name: 'format', title: 'Formato de exibição', description: 'Escolha o mesmo formato em que o material foi produzido. Vídeos antigos sem seleção continuam horizontais.', type: 'string', initialValue: 'horizontal', options: { list: [{ title: 'Vertical · Reel (9:16)', value: 'vertical' }, { title: 'Horizontal · Filme (16:9)', value: 'horizontal' }, { title: 'Quadrado (1:1)', value: 'square' }], layout: 'radio' } }),
  defineField({ name: 'title', title: 'Legenda (opcional)', type: 'string', validation: (r) => r.max(100) }),
  defineField({ name: 'poster', title: 'Capa do vídeo', type: 'controlledImage' }),
]

const moduleMembers = [
  defineArrayMember({
    name: 'portfolioTextModule', title: 'Texto curto', type: 'object', icon: () => 'T',
    fields: [
      defineField({ name: 'title', title: 'Título (opcional)', type: 'string', validation: (r) => r.max(80) }),
      defineField({ name: 'text', title: 'Texto', type: 'text', rows: 4, validation: (r) => r.required().max(700) }),
    ], preview: { select: { title: 'title', subtitle: 'text' }, prepare: ({ title, subtitle }) => ({ title: title || 'Texto curto', subtitle }) },
  }),
  defineArrayMember({
    name: 'portfolioImageModule', title: 'Imagem grande', type: 'object',
    fields: [defineField({ name: 'image', title: 'Imagem', type: 'controlledImage', validation: (r) => r.required() })],
    preview: { select: { media: 'image.image', title: 'image.caption' }, prepare: ({ media, title }) => ({ title: title || 'Imagem grande', media }) },
  }),
  defineArrayMember({
    name: 'portfolioGalleryModule', title: 'Galeria de fotos', type: 'object',
    fields: [
      defineField({ name: 'title', title: 'Título (opcional)', type: 'string', validation: (r) => r.max(80) }),
      defineField({ name: 'images', title: 'Fotografias', type: 'array', of: [{ type: 'controlledImage' }], validation: (r) => r.required().min(1).max(12) }),
    ], preview: { select: { title: 'title', images: 'images' }, prepare: ({ title, images }) => ({ title: title || 'Galeria de fotos', subtitle: `${images?.length || 0} imagem(ns)` }) },
  }),
  defineArrayMember({
    name: 'portfolioInterfacesModule', title: 'Galeria de interfaces', type: 'object',
    fields: [
      defineField({ name: 'title', title: 'Título (opcional)', type: 'string', validation: (r) => r.max(80) }),
      defineField({ name: 'images', title: 'Telas desktop e mobile', type: 'array', of: [{ type: 'controlledImage' }], validation: (r) => r.required().min(1).max(12) }),
    ], preview: { select: { title: 'title', images: 'images' }, prepare: ({ title, images }) => ({ title: title || 'Galeria de interfaces', subtitle: `${images?.length || 0} tela(s)` }) },
  }),
  defineArrayMember({
    name: 'portfolioVideoModule', title: 'Vídeo', type: 'object', fields: videoFields,
    preview: { select: { title: 'title', subtitle: 'url', media: 'poster.image' }, prepare: ({ title, subtitle, media }) => ({ title: title || 'Vídeo', subtitle, media }) },
  }),
  defineArrayMember({
    name: 'portfolioSocialCarouselModule', title: 'Carrossel para Instagram', type: 'object',
    description: 'Simula uma publicação navegável, respeitando a ordem das artes.',
    fields: [
      defineField({ name: 'title', title: 'Título do carrossel (opcional)', type: 'string', validation: (r) => r.max(80) }),
      defineField({ name: 'profileName', title: 'Nome exibido na simulação', description: 'Exemplo: nome do cliente ou da marca. Não precisa usar @.', type: 'string', validation: (r) => r.max(60) }),
      defineField({ name: 'format', title: 'Formato das artes', type: 'string', initialValue: 'portrait', options: { list: [{ title: 'Retrato · recomendado (4:5)', value: 'portrait' }, { title: 'Quadrado (1:1)', value: 'square' }, { title: 'Paisagem (1.91:1)', value: 'landscape' }], layout: 'radio' }, validation: (r) => r.required() }),
      defineField({ name: 'images', title: 'Páginas do carrossel', description: 'Envie de 2 a 20 artes. Arraste para colocar na mesma ordem da publicação.', type: 'array', of: [{ type: 'controlledImage' }], validation: (r) => r.required().min(2).max(20) }),
      defineField({ name: 'caption', title: 'Legenda da publicação (opcional)', description: 'Texto apresentado abaixo da simulação.', type: 'text', rows: 4, validation: (r) => r.max(1000) }),
      defineField({ name: 'showAllSlides', title: 'Mostrar também todas as páginas em grade', description: 'Útil para o cliente analisar a sequência completa no computador.', type: 'boolean', initialValue: true }),
    ],
    preview: { select: { title: 'title', images: 'images', media: 'images.0.image' }, prepare: ({ title, images, media }) => ({ title: title || 'Carrossel para Instagram', subtitle: `${images?.length || 0} página(s)`, media }) },
  }),
  defineArrayMember({
    name: 'portfolioWorkModule', title: 'Nosso trabalho', type: 'object',
    fields: [defineField({ name: 'note', title: 'Nota interna', description: 'As responsabilidades selecionadas no projeto aparecem automaticamente.', type: 'string', readOnly: true })],
    preview: { prepare: () => ({ title: 'Nosso trabalho' }) },
  }),
  defineArrayMember({
    name: 'portfolioLinkModule', title: 'Link externo', type: 'object', fields: [
      defineField({ name: 'label', title: 'Texto do botão', type: 'string', validation: (r) => r.required().max(40) }),
      defineField({ name: 'url', title: 'URL pública real', type: 'url', validation: (r) => r.required() }),
    ], preview: { select: { title: 'label', subtitle: 'url' } },
  }),
  defineArrayMember({
    name: 'portfolioCreditsModule', title: 'Créditos', type: 'object', fields: [
      defineField({ name: 'credits', title: 'Pessoas e funções', type: 'array', of: [{ type: 'object', fields: [
        defineField({ name: 'name', title: 'Nome', type: 'string', validation: (r) => r.required().max(80) }),
        defineField({ name: 'role', title: 'Função', type: 'string', validation: (r) => r.max(100) }),
      ] }], validation: (r) => r.required().min(1).max(20) }),
    ], preview: { select: { credits: 'credits' }, prepare: ({ credits }) => ({ title: 'Créditos', subtitle: `${credits?.length || 0} pessoa(s)` }) },
  }),
]

export const privatePortfolioSchema = defineType({
  name: 'privatePortfolio', title: 'Portfólio privado', type: 'document',
  description: 'Apresentação comercial privada. Conteúdo flexível; identidade visual protegida pelo sistema.',
  groups: [
    { name: 'opening', title: '1 · Abertura', default: true },
    { name: 'projects', title: '2 · Projetos' },
    { name: 'contact', title: '3 · Contato' },
    { name: 'footer', title: '4 · Rodapé' },
    { name: 'settings', title: '5 · Exibição' },
  ],
  fields: [
    defineField({ name: 'privacyLabel', title: 'Selo de privacidade', group: 'opening', type: 'string', initialValue: 'Portfólio privado', validation: (r) => r.max(35) }),
    defineField({ name: 'kicker', title: 'Rótulo da abertura', group: 'opening', type: 'string', initialValue: 'Portfólio', validation: (r) => r.max(30) }),
    defineField({ name: 'title', title: 'Título principal', group: 'opening', type: 'string', validation: (r) => r.required().max(90) }),
    defineField({ name: 'introduction', title: 'Texto de apoio', group: 'opening', type: 'text', rows: 3, validation: (r) => r.max(360) }),
    defineField({ name: 'heroImage', title: 'Imagem da abertura', group: 'opening', type: 'controlledImage' }),
    defineField({ name: 'heroVideo', title: 'Reel da abertura (opcional)', group: 'opening', type: 'object', fields: videoFields }),
    defineField({ name: 'heroCtaLabel', title: 'Texto para assistir ao reel', group: 'opening', type: 'string', initialValue: 'Assistir reel', validation: (r) => r.max(35) }),
    defineField({
      name: 'projects', title: 'Projetos', group: 'projects', type: 'array', validation: (r) => r.max(60).custom((items) => {
        const featured = (items ?? []).filter((item) => {
          const project = item as { featured?: boolean; visible?: boolean }
          return project.featured && project.visible !== false
        })
        return featured.length <= 1 || 'Escolha somente um projeto principal. Desmarque “Projeto principal” nos demais.'
      }),
      description: 'Nenhum projeto publicado no Portfólio ainda? Deixe esta lista vazia. Para adicionar, clique em “Adicionar item”. Arraste para organizar.',
      of: [defineArrayMember({ name: 'portfolioProject', title: 'Projeto', type: 'object', groups: [
        { name: 'identity', title: '1 · O que é', default: true }, { name: 'planning', title: '2 · Planejamento interno' }, { name: 'work', title: '3 · O que fizemos' },
        { name: 'display', title: '4 · Como aparece' }, { name: 'story', title: '5 · História e materiais' }, { name: 'link', title: '6 · Link' },
      ], fields: [
        defineField({ name: 'title', title: 'Nome do projeto', group: 'identity', type: 'string', validation: (r) => r.required().max(100) }),
        defineField({ name: 'client', title: 'Cliente (opcional)', group: 'identity', type: 'string', validation: (r) => r.max(100) }),
        defineField({ name: 'universe', title: 'Universo ou ecossistema (opcional)', group: 'identity', description: 'Relaciona projetos do mesmo ecossistema sem transformá-los em um único case. Exemplo: Universo Senhor.', type: 'string', validation: (r) => r.max(100) }),
        defineField({ name: 'category', title: 'Categoria comercial', group: 'identity', type: 'string', options: { list: categories, layout: 'dropdown' }, validation: (r) => r.required() }),
        defineField({ name: 'projectType', title: 'Tipo predominante', group: 'identity', type: 'string', options: { list: projectTypes, layout: 'radio' }, validation: (r) => r.required() }),
        defineField({ name: 'context', title: 'Contexto curto', group: 'identity', type: 'text', rows: 3, validation: (r) => r.max(360) }),
        defineField({ name: 'editorialHook', title: 'Frase de abertura sugerida', group: 'planning', description: 'Guia para desenvolver o case. Não aparece automaticamente no Portfólio.', type: 'string', validation: (r) => r.max(180) }),
        defineField({ name: 'editorialBrief', title: 'Orientação editorial', group: 'planning', description: 'Ideia central, recortes e cuidados para organizar o material. Este texto não aparece automaticamente no Portfólio.', type: 'text', rows: 7, validation: (r) => r.max(1800) }),
        defineField({ name: 'responsibilities', title: 'Nosso trabalho', group: 'work', description: 'Selecione somente o que o Menos Roteiro realmente realizou.', type: 'array', of: [{ type: 'string' }], options: { list: responsibilities }, validation: (r) => r.unique().max(12) }),
        defineField({ name: 'visible', title: 'Exibir no portfólio', group: 'display', type: 'boolean', initialValue: true }),
        defineField({ name: 'featured', title: 'Projeto principal desta página', group: 'display', description: 'Marque apenas o trabalho que deve aparecer na grande seção expandida.', type: 'boolean', initialValue: false }),
        defineField({ name: 'order', title: 'Ordem', group: 'display', type: 'number', initialValue: 100, validation: (r) => r.required().integer().min(0).max(999) }),
        defineField({ name: 'cover', title: 'Capa do projeto', group: 'display', type: 'controlledImage' }),
        defineField({ name: 'previewVideo', title: 'Preview animado da capa (opcional)', group: 'display', description: 'Vídeo curto, leve e sem áudio, recomendado com 5 a 8 segundos. MP4 de até 5 MB.', type: 'file', options: { accept: '.mp4,video/mp4' } }),
        defineField({ name: 'primaryVideo', title: 'Vídeo principal (opcional)', group: 'story', type: 'object', fields: videoFields }),
        defineField({ name: 'modules', title: 'Blocos da história', group: 'story', description: 'Adicione somente o necessário e arraste para definir a narrativa.', type: 'array', of: moduleMembers, validation: (r) => r.max(20) }),
        defineField({ name: 'externalLabel', title: 'Texto do link', group: 'link', type: 'string', initialValue: 'Visitar projeto', validation: (r) => r.max(40) }),
        defineField({ name: 'externalUrl', title: 'URL pública real', group: 'link', type: 'url' }),
      ], preview: { select: { title: 'title', category: 'category', type: 'projectType', media: 'cover.image', featured: 'featured' }, prepare: ({ title, category, type, media, featured }) => ({ title: `${featured ? '★ ' : ''}${title || 'Projeto sem nome'}`, subtitle: `${PORTFOLIO_CATEGORY_LABELS[category as keyof typeof PORTFOLIO_CATEGORY_LABELS] || 'Sem categoria'} · ${type || 'tipo pendente'}`, media }) } })],
    }),
    defineField({ name: 'contactKicker', title: 'Rótulo', group: 'contact', type: 'string', initialValue: 'Vamos conversar?', validation: (r) => r.max(30) }),
    defineField({ name: 'contactTitle', title: 'Título', group: 'contact', type: 'string', validation: (r) => r.required().max(90) }),
    defineField({ name: 'contactText', title: 'Texto', group: 'contact', type: 'text', rows: 3, validation: (r) => r.max(300) }),
    defineField({ name: 'contactLabel', title: 'Texto do botão', group: 'contact', type: 'string', validation: (r) => r.max(40) }),
    defineField({ name: 'contactUrl', title: 'WhatsApp ou URL', group: 'contact', type: 'url' }),
    defineField({ name: 'contactEmail', title: 'E-mail', group: 'contact', type: 'email' }),
    defineField({ name: 'contactBackground', title: 'Imagem do contato', group: 'contact', type: 'controlledImage' }),
    defineField({ name: 'footerText', title: 'Texto do rodapé', group: 'footer', type: 'string', initialValue: 'Portfólio privado · não indexado', validation: (r) => r.max(100) }),
    defineField({ name: 'footerLinks', title: 'Links do rodapé', group: 'footer', description: 'Somente links públicos que podem aparecer nesta apresentação.', type: 'array', of: [{ type: 'object', fields: [
      defineField({ name: 'label', title: 'Nome do link', type: 'string', validation: (r) => r.required().max(30) }),
      defineField({ name: 'url', title: 'URL', type: 'url', validation: (r) => r.required() }),
    ], preview: { select: { title: 'label', subtitle: 'url' } } }], validation: (r) => r.max(8) }),
    defineField({ name: 'initialProjectCount', title: 'Projetos exibidos inicialmente', group: 'settings', type: 'number', initialValue: 9, validation: (r) => r.required().integer().min(3).max(24) }),
    defineField({ name: 'loadMoreLabel', title: 'Texto de carregar mais', group: 'settings', type: 'string', initialValue: 'Carregar mais projetos', validation: (r) => r.max(40) }),
  ], preview: { select: { title: 'title', projects: 'projects' }, prepare: ({ title, projects }) => ({ title: title || 'Portfólio privado', subtitle: `${projects?.length || 0} projeto(s)` }) },
})
