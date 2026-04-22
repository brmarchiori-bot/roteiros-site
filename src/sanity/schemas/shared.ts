import { defineField, type FieldDefinition } from 'sanity'

/**
 * Campos de aparência da seção (largura + ordem imagem/texto no desktop).
 * Compartilhado só pra não repetir a mesma definição em 4 schemas.
 */
export function sectionLayoutFields(opts: { hasImageText?: boolean } = {}): FieldDefinition[] {
  const fields: FieldDefinition[] = [
    defineField({
      name: 'contentWidth',
      title: 'Largura do conteúdo na tela',
      description:
        'Estreito = texto concentrado no meio. Largo = ocupa mais a tela. Médio é o padrão.',
      type: 'string',
      options: {
        list: [
          { title: '▯ Estreito', value: 'narrow' },
          { title: '▭ Médio (padrão)', value: 'medium' },
          { title: '▬ Largo', value: 'wide' },
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
          '📱 No celular sempre empilha (imagem em cima, texto embaixo). 💻 No desktop, escolhe o lado da foto.',
        type: 'string',
        options: {
          list: [
            { title: '⬅️ Imagem à esquerda (padrão)', value: 'left' },
            { title: '➡️ Imagem à direita', value: 'right' },
          ],
          layout: 'radio',
        },
        initialValue: 'left',
      }),
    )
  }
  return fields
}
