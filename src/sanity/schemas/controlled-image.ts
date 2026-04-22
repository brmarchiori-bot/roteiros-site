import { defineField, defineType } from 'sanity'

/**
 * Tipo reutilizável pra toda imagem editorial do site.
 * Garante três coisas:
 *  1. Acessibilidade: alt obrigatório.
 *  2. Enquadramento previsível: foco horizontal/vertical + fit.
 *  3. Isolamento: cada seção guarda a SUA imagem — nenhuma é compartilhada.
 */
export const controlledImageSchema = defineType({
  name: 'controlledImage',
  title: 'Imagem com controle',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Arquivo da imagem',
      description:
        '📍 A foto em si. Recomendado: JPG ou PNG, pelo menos 1600px de largura. Use o hotspot pra marcar o ponto mais importante da foto.',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Descrição da foto (obrigatório)',
      description:
        '📖 Pra quê serve: leitores de tela (acessibilidade) e o Google usam este texto. Descreva o que aparece na foto. Ex: "Andressa e Bruno sentados na van ao pôr do sol". Até 140 caracteres.',
      type: 'string',
      validation: (r) =>
        r.required().max(140).warning('Passou de 140 — muito longo pro alt text.'),
    }),
    defineField({
      name: 'caption',
      title: 'Legenda visível (opcional)',
      description:
        '📍 Onde aparece: em texto pequeno abaixo da foto. Deixe vazio pra não mostrar nada. Até 80 caracteres.',
      type: 'string',
      validation: (r) => r.max(80),
    }),
    defineField({
      name: 'focusHorizontal',
      title: 'Foco horizontal',
      description:
        'Se a foto for cortada (em telas menores, por exemplo), qual lado manter visível.',
      type: 'string',
      options: {
        list: [
          { title: '⬅️ Esquerda', value: 'left' },
          { title: '◎ Centro (padrão)', value: 'center' },
          { title: '➡️ Direita', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'center',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'focusVertical',
      title: 'Foco vertical',
      description: 'Se a foto for cortada, qual altura priorizar.',
      type: 'string',
      options: {
        list: [
          { title: '⬆️ Topo', value: 'top' },
          { title: '◎ Centro (padrão)', value: 'center' },
          { title: '⬇️ Base', value: 'bottom' },
        ],
        layout: 'radio',
      },
      initialValue: 'center',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'fit',
      title: 'Modo de ajuste',
      description:
        '🟩 Cover = preenche toda a área, pode cortar as bordas. 🟦 Contain = mostra a foto inteira, pode sobrar espaço em volta.',
      type: 'string',
      options: {
        list: [
          { title: '🟩 Cover — preenche tudo (padrão)', value: 'cover' },
          { title: '🟦 Contain — foto inteira aparece', value: 'contain' },
        ],
        layout: 'radio',
      },
      initialValue: 'cover',
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: {
      title: 'alt',
      subtitle: 'caption',
      media: 'image',
    },
    prepare: ({ title, subtitle, media }) => ({
      title: title || '⚠️ Sem descrição (alt)',
      subtitle: subtitle || 'Sem legenda',
      media,
    }),
  },
})
