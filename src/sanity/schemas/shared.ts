import { defineField, type FieldDefinition } from 'sanity'

/**
 * Campos compartilhados pra qualquer imagem do site.
 * Usar com spread: `fields: [...photoFields({ sectionName: 'Sobre' })]`
 */
export function photoFields(
  opts: { sectionName: string; withCaption?: boolean } = { sectionName: '' },
): FieldDefinition[] {
  const { sectionName, withCaption = true } = opts
  const list: FieldDefinition[] = [
    defineField({
      name: 'alt',
      title: 'Descrição da foto (acessibilidade — obrigatório)',
      description: 'O que a foto mostra. Pro leitor de tela e pro Google.',
      type: 'string',
      validation: (r) => r.required().max(140).warning('Mais de 140 caracteres — muito longo pro alt text.'),
    }),
    ...(withCaption
      ? [
          defineField({
            name: 'caption',
            title: 'Legenda visível (aparece pequena, abaixo da foto)',
            description: sectionName
              ? `Aparece na seção ${sectionName}, abaixo da imagem. Opcional.`
              : 'Aparece abaixo da imagem. Opcional.',
            type: 'string',
            validation: (r) => r.max(80),
          }),
        ]
      : []),
    defineField({
      name: 'horizontalFocus',
      title: 'Foco horizontal (qual lado aparecer em destaque)',
      description:
        'Se a foto for cortada, qual parte manter no enquadramento. Útil quando tem gente num canto.',
      type: 'string',
      options: {
        list: [
          { title: 'Esquerda', value: 'left' },
          { title: 'Centro (padrão)', value: 'center' },
          { title: 'Direita', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'center',
    }),
    defineField({
      name: 'verticalFocus',
      title: 'Foco vertical (qual altura aparecer em destaque)',
      description: 'Se a foto for cortada, qual altura priorizar.',
      type: 'string',
      options: {
        list: [
          { title: 'Topo', value: 'top' },
          { title: 'Centro (padrão)', value: 'center' },
          { title: 'Base (pé)', value: 'bottom' },
        ],
        layout: 'radio',
      },
      initialValue: 'center',
    }),
    defineField({
      name: 'fitMode',
      title: 'Modo de ajuste da imagem',
      description:
        'Cover = preenche a área, pode cortar. Contain = mostra a foto inteira, pode ter espaço vazio.',
      type: 'string',
      options: {
        list: [
          { title: 'Cover — preenche tudo (padrão)', value: 'cover' },
          { title: 'Contain — foto inteira aparece', value: 'contain' },
        ],
        layout: 'radio',
      },
      initialValue: 'cover',
    }),
    defineField({
      name: 'zoom',
      title: 'Zoom (0 a 100) — amplia a foto pra cortar mais',
      description:
        '0 = sem zoom (padrão). 50 = 50% mais perto. 100 = 2x. Útil se a foto tem muito espaço vazio em volta.',
      type: 'number',
      initialValue: 0,
      validation: (r) => r.min(0).max(100),
    }),
  ]
  return list
}

/** Campos de layout de seção (largura + ordem imagem/texto). */
export function sectionLayoutFields(opts: { hasImageText?: boolean } = {}): FieldDefinition[] {
  const fields: FieldDefinition[] = [
    defineField({
      name: 'contentWidth',
      title: 'Largura do conteúdo na tela',
      description:
        'Estreito = texto mais concentrado. Largo = ocupa mais a tela. Médio é o padrão atual.',
      type: 'string',
      options: {
        list: [
          { title: 'Estreito', value: 'narrow' },
          { title: 'Médio (padrão)', value: 'medium' },
          { title: 'Largo', value: 'wide' },
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
    }),
  ]
  if (opts.hasImageText) {
    fields.push(
      defineField({
        name: 'imagePosition',
        title: 'Ordem no desktop: imagem à esquerda ou direita?',
        description:
          'No celular sempre empilha (imagem em cima, texto embaixo). No desktop, escolhe o lado da foto.',
        type: 'string',
        options: {
          list: [
            { title: 'Imagem à esquerda (padrão)', value: 'left' },
            { title: 'Imagem à direita', value: 'right' },
          ],
          layout: 'radio',
        },
        initialValue: 'left',
      }),
    )
  }
  return fields
}
