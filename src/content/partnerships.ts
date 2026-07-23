import { buildWhatsAppUrl } from '@/lib/utils'
import type { PartnershipsContent } from '@/types/content'
import { siteConfig } from './site.config'

/**
 * TRABALHAR COM A GENTE — conversão B2B.
 * Premium sem arrogância. Profissional sem frieza. Filtro silencioso.
 */
export const partnerships: PartnershipsContent = {
  meta: {
    kicker: '06 · Parcerias',
    title: 'Uma boa história também pode ser parceria.',
  },
  philosophy:
    'A gente trabalha com negócios que cabem de verdade no caminho. A proposta é simples: viver a experiência, entender o lugar e contar a história sem transformar tudo em anúncio.',
  formats: [
    {
      id: 'pousada-de-alma',
      number: '01',
      name: 'Hospedagem',
      description:
        'Conteúdo sobre a estadia, os bastidores e aquilo que faz o lugar ter personalidade.',
      audience: 'Pousadas, hotéis, hostels e casas de temporada.',
    },
    {
      id: 'experiencia-contada',
      number: '02',
      name: 'Comida e experiência',
      description:
        'Uma mesa, um passeio ou um encontro local contado no ritmo em que aconteceu.',
      audience: 'Restaurantes, cafeterias, eventos, passeios e negócios locais.',
    },
    {
      id: 'roteiro-patrocinado',
      number: '03',
      name: 'Marca no caminho',
      description:
        'Produtos e serviços inseridos na jornada quando existe contexto e uso real.',
      audience: 'Marcas, destinos e projetos ligados à vida em movimento.',
    },
  ],
  numbers: {
    updatedAt: '2026-04-20',
    /**
     * Honestos, vivos, datados — mesmo pequenos.
     * Atualizar a cada mês. Honestidade vence inflação.
     */
    items: [
      { label: 'Alcance médio por Reel', value: '—', note: 'preencher quando estabilizar' },
      { label: 'Engajamento', value: '—', note: 'preencher quando estabilizar' },
      { label: 'Salvamentos por post', value: '—', note: 'preencher quando estabilizar' },
      { label: 'Crescimento últimos 90 dias', value: '—', note: 'preencher quando estabilizar' },
    ],
  },
  ctas: {
    mediaKit: {
      label: 'Solicitar apresentação por email',
      href: `mailto:${siteConfig.contact.partnerships}?subject=${encodeURIComponent(
        'Quero conhecer o trabalho do Menos Roteiros',
      )}`,
    },
    whatsapp: {
      label: 'Conversar no WhatsApp',
      href: buildWhatsAppUrl(
        siteConfig.contact.whatsapp.number,
        siteConfig.contact.whatsapp.prefilledMessage,
      ),
    },
  },
}
