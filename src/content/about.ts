import type { AboutContent } from '@/types/content'

/**
 * QUEM SOMOS — 3 capítulos narrativos.
 * Vende a jornada, não o casal. Personagem real.
 */
export const about: AboutContent = {
  meta: {
    kicker: '03 · Quem somos',
    title: 'A virada de vida.',
  },
  chapters: [
    {
      number: 'Capítulo 01',
      title: 'De onde a gente veio',
      body: 'Bar. Dez anos de barulho, noite, público, margem apertada, faturamento que depende de quem saiu de casa naquela sexta. A gente aprendeu a ler gente, a segurar show e a gostar do que dá errado. A Andressa entrou nesse mundo, e a vida foi sendo construída dentro dele.',
    },
    {
      number: 'Capítulo 02',
      title: 'Por que a gente saiu',
      body: 'Não foi burnout. Foi uma conta na cabeça que começou a não fechar. A sensação de que tinha outro lugar pra gente estar — e que a próxima década podia parecer diferente da última. Ninguém perguntou. A gente foi.',
    },
    {
      number: 'Capítulo 03',
      title: 'O que a gente tá fazendo agora',
      body: 'Piauí hoje. Ásia ano que vem. No meio: trabalho remoto, sono ruim, planilha aberta no ônibus, câmera ligada na hora errada, alegria de criança na hora certa. É isso — e a gente decidiu publicar.',
    },
  ],
  closingCta: {
    label: 'A história continua abaixo',
    href: '#now',
  },
  /**
   * Foto editorial de Andressa + Bruno em movimento real (não posada).
   * Enquanto src estiver vazio, renderiza PhotoPlaceholder.
   * Substituir src por '/images/about/andressa-bruno.jpg' (4:5 cinematográfico).
   */
  photo: {
    src: '',
    alt: 'Andressa e Bruno em algum lugar do Piauí',
    caption: 'Andressa + Bruno · Piauí, abril/2026',
  },
}
