'use client'

import type { InputProps } from 'sanity'

const GUIDES: Record<string, { step: string; title: string; description: string }> = {
  hero: {
    step: '01',
    title: 'Capa e abertura',
    description: 'Edite a primeira impressão do site: título, frase, convite e fotografia principal.',
  },
  now: {
    step: '02',
    title: 'Agora',
    description: 'Atualize o capítulo atual da viagem: lugar, período, relato e imagens.',
  },
  about: {
    step: '03',
    title: 'Nossa história',
    description: 'Organize os capítulos que apresentam a trajetória de Andressa e Bruno.',
  },
  pillars: {
    step: '04',
    title: 'O que você vai encontrar',
    description: 'Explique, em quatro pontos simples, os assuntos centrais do Menos Roteiros.',
  },
  contentHighlights: {
    step: '05',
    title: 'Continuidade',
    description: 'Escolha conteúdos em destaque e mantenha os links dos canais atualizados.',
  },
  partnerships: {
    step: '06',
    title: 'Parcerias',
    description: 'Apresente a forma de trabalhar e os canais para uma marca entrar em contato.',
  },
  faq: {
    step: '07',
    title: 'Perguntas frequentes',
    description: 'Responda às dúvidas mais comuns na mesma ordem em que aparecem no site.',
  },
}

const NEEDS_COMPARISON = new Set(['hero', 'now', 'about', 'faq'])

export function EditorialDocumentGuide(props: InputProps) {
  const isDocumentRoot = props.id === 'root' && props.schemaType.type?.name === 'document'
  const guide = isDocumentRoot ? GUIDES[props.schemaType.name] : undefined

  if (!guide) return props.renderDefault(props)

  return (
    <div>
      <aside
        style={{
          background: 'linear-gradient(135deg, #f6efe4, #eee3d3)',
          border: '1px solid rgba(75, 59, 42, 0.18)',
          borderRadius: 8,
          color: '#30291f',
          marginBottom: 24,
          padding: '18px 20px',
        }}
      >
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <span
            aria-hidden="true"
            style={{
              background: '#a64d2d',
              borderRadius: 999,
              color: 'white',
              display: 'grid',
              flex: '0 0 34px',
              fontSize: 12,
              fontWeight: 700,
              height: 34,
              placeItems: 'center',
            }}
          >
            {guide.step}
          </span>
          <div>
            <strong style={{ display: 'block', fontSize: 16, marginBottom: 5 }}>
              {guide.title}
            </strong>
            <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0 }}>{guide.description}</p>
            <p style={{ fontSize: 12, lineHeight: 1.5, margin: '8px 0 0', opacity: 0.72 }}>
              Dica: use “Editar site ao vivo” no menu superior e clique no trecho da página que
              deseja alterar.
            </p>
            <p style={{ fontSize: 12, lineHeight: 1.5, margin: '8px 0 0', opacity: 0.72 }}>
              Alterar cria um rascunho. Quando estiver satisfeito, clique em “Publicar” para enviar
              a mudança à Home oficial.
            </p>
          </div>
        </div>
      </aside>
      {NEEDS_COMPARISON.has(props.schemaType.name) && (
        <aside
          role="note"
          style={{
            background: '#fff7dc',
            border: '1px solid #d8b85d',
            borderRadius: 8,
            color: '#4b3a13',
            marginBottom: 24,
            padding: '14px 18px',
          }}
        >
          <strong style={{ display: 'block', fontSize: 14, marginBottom: 4 }}>
            Publicação segura
          </strong>
          <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0 }}>
            Confira textos e fotografias na prévia. O público só verá a mudança depois que você
            clicar em “Publicar”.
          </p>
        </aside>
      )}
      {props.renderDefault(props)}
    </div>
  )
}
