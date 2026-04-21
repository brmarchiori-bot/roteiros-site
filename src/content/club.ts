import type { ClubContent } from '@/types/content'

/**
 * CADERNO DE VIAGEM — captura de email (principal conversão do site).
 * Posicionado como objeto editorial, nunca como "newsletter".
 */
export const club: ClubContent = {
  meta: {
    kicker: '07 · Caderno de Viagem',
    title: 'Uma carta nossa, todo domingo.',
  },
  name: 'Caderno de Viagem',
  promise:
    'Com o que deu errado na semana, o que aprendemos, o custo real do que fizemos, e onde a gente vai agora.',
  rule: 'Sem marketing. Sem pirâmide de links. Só a carta.',
  cta: {
    label: 'Entrar no caderno',
    href: '/caderno',
  },
  /**
   * Mostrar quando tiver pelo menos 100 inscritos.
   * Formato: { count: 312, period: 'lendo todo domingo' }
   * Setar como null pra esconder.
   */
  socialProof: null,
}
