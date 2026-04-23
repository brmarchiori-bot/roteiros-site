'use client'

import type { CSSProperties } from 'react'

/**
 * Bloco informativo (read-only) que aparece no topo da aba Conteúdo
 * do documento Hero, explicando as duas formas de preencher o título.
 *
 * Renderizado via `components.input` do Sanity — o campo em si não salva dado.
 *
 * Estilo em inline-styles pra funcionar no bundle do Studio sem depender
 * de bibliotecas extras.
 */

const card: CSSProperties = {
  padding: '16px 18px',
  borderRadius: 6,
  border: '1px solid rgba(196, 81, 42, 0.25)',
  background: 'rgba(196, 81, 42, 0.06)',
}

const title: CSSProperties = {
  margin: 0,
  marginBottom: 10,
  fontSize: 13,
  fontWeight: 600,
  lineHeight: 1.4,
  color: 'inherit',
}

const body: CSSProperties = {
  margin: 0,
  fontSize: 13,
  lineHeight: 1.65,
  whiteSpace: 'pre-line',
  color: 'inherit',
  opacity: 0.88,
}

export function HeroHelpInput() {
  return (
    <div style={card}>
      <p style={title}>💡 Como funciona o título do Hero</p>
      <p style={body}>
        {`Você tem 2 opções.

1) COM animação (recomendado)
Preencha:
 • Texto fixo do título — ex: "Viajando o mundo e"
 • Palavras que trocam — mínimo 2 frases

2) SEM animação
Preencha apenas:
 • Título completo

O sistema escolhe automaticamente: se as "Palavras que trocam" tiverem pelo menos 2 frases válidas, usa a versão animada. Senão, usa o "Título completo".`}
      </p>
    </div>
  )
}
