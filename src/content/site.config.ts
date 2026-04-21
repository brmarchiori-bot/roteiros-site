/**
 * Configuração central da marca Menos Roteiros.
 * Fonte única de verdade. Editar aqui propaga pro site inteiro.
 */
export const siteConfig = {
  name: 'Menos Roteiros',
  tagline: 'Onde o roteiro acaba, a gente começa.',
  shortTagline: 'Menos roteiro. Mais mundo.',
  description:
    'Um diário público de dois que trocaram o balcão pelo caminho. Viagem real, rotina em movimento, perrengue traduzido — sem filtro e sem manual.',
  url: 'https://menosroteiros.com.br',
  locale: 'pt-BR',
  founders: {
    andressa: 'Andressa',
    bruno: 'Bruno',
  },
  social: {
    instagram: 'https://instagram.com/menosroteiros',
    youtube: 'https://youtube.com/@menosroteiros',
    tiktok: 'https://tiktok.com/@menosroteiros',
  },
  contact: {
    general: 'oi@menosroteiros.com.br',
    partnerships: 'parcerias@menosroteiros.com.br',
    whatsapp: {
      /** Número com DDD, sem +55 nem traços. Exemplo: '14997057752' */
      number: '14997057752',
      /** Mensagem que aparece pré-digitada quando o usuário clica "Conversar no WhatsApp" */
      prefilledMessage:
        'Oi, Andressa e Bruno! Cheguei pelo site do Menos Roteiros e queria conversar sobre uma parceria.',
    },
  },
  nav: [
    { label: 'Jornada', href: '/jornada' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Conteúdo', href: '/conteudo' },
    { label: 'Parcerias', href: '/parcerias' },
  ],
  primaryCta: {
    label: 'Entrar na lista',
    href: '/caderno',
  },
  legal: {
    copyrightYear: 2026,
  },
  /**
   * Nota: dados do "Dia 47 · Piauí · Abril/2026" moram em src/content/now.ts
   * (fonte única — atualizar lá toda semana).
   */
} as const

export type SiteConfig = typeof siteConfig
