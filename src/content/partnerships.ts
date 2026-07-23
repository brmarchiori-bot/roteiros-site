import { buildWhatsAppUrl } from '@/lib/utils'
import type { PartnershipsContent } from '@/types/content'
import { siteConfig } from './site.config'

/**
 * TRABALHAR COM A GENTE — conversão B2B.
 * Premium sem arrogância. Profissional sem frieza. Filtro silencioso.
 */
export const partnerships: PartnershipsContent = {
  meta: {
    kicker: '09 · Parcerias',
    title: 'Trabalhamos com poucas marcas. E com as certas.',
  },
  philosophy:
    'A gente trata cada parceria como trata um destino: com cuidado, com verdade, e só quando faz sentido. Não fazemos publipost solto, permuta sem contexto, nem conteúdo fora da nossa linha editorial. Quando a gente fecha com uma marca, é porque acreditamos no que ela faz — e ela acredita no jeito que a gente conta.',
  formats: [
    {
      id: 'pousada-de-alma',
      number: '01',
      name: 'Pousada de alma',
      description:
        'Hospedagem em troca de cobertura editorial completa: Reels narrativo, sequência de Stories, fotos cinematográficas em pacote, menção no Caderno de Viagem.',
      audience: 'Pousadas, hostels, hotéis-boutique e casas de temporada com identidade própria.',
    },
    {
      id: 'experiencia-contada',
      number: '02',
      name: 'Experiência contada',
      description:
        'Um passeio, uma comida, uma travessia — traduzida em formato editorial. Vídeo curto + Story sequence + post longo.',
      audience: 'Gastronomia, passeios guiados, experiências locais e agências boutique.',
    },
    {
      id: 'roteiro-patrocinado',
      number: '03',
      name: 'Roteiro patrocinado',
      description:
        'Marca integrada a um trajeto maior — 3 a 7 dias contados do começo ao fim. Vídeo longo no YouTube + cobertura completa nas redes + Caderno dedicado.',
      audience: 'Destinos, secretarias de turismo, marcas com jornada longa, lançamentos.',
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
