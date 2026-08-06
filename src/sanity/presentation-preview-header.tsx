'use client'

import { useEffect, useState } from 'react'
import type { PreviewHeaderProps } from 'sanity/presentation'

const VIEWPORTS = [
  { name: 'Desktop', width: 1440, mode: 'desktop' },
  { name: 'Tablet', width: 768, mode: 'desktop' },
  { name: 'Mobile', width: 390, mode: 'desktop' },
] as const

type ViewportName = (typeof VIEWPORTS)[number]['name']

export function PresentationPreviewHeader(props: PreviewHeaderProps) {
  const [selected, setSelected] = useState<ViewportName>('Desktop')

  useEffect(() => {
    const viewport = VIEWPORTS.find((item) => item.name === selected)
    const iframe = props.iframeRef.current
    if (!viewport || !iframe) return

    iframe.style.setProperty('width', `${viewport.width}px`)
    iframe.style.setProperty('max-width', '100%')
    iframe.style.setProperty('margin-inline', 'auto')
  }, [props.iframeRef, selected])

  function selectViewport(name: ViewportName) {
    const viewport = VIEWPORTS.find((item) => item.name === name)
    if (!viewport) return
    setSelected(name)
    props.setViewport(viewport.mode)
  }

  return (
    <div style={{ borderBottom: '1px solid var(--card-border-color)' }}>
      {props.renderDefault(props)}
      <nav
        aria-label="Tamanhos de visualização"
        style={{
          alignItems: 'center',
          display: 'flex',
          gap: 6,
          justifyContent: 'center',
          padding: '6px 12px 8px',
        }}
      >
        {VIEWPORTS.map((viewport) => (
          <button
            key={viewport.name}
            type="button"
            aria-pressed={selected === viewport.name}
            onClick={() => selectViewport(viewport.name)}
            style={{
              background: selected === viewport.name ? 'var(--card-focus-ring-color)' : 'transparent',
              border: '1px solid var(--card-border-color)',
              borderRadius: 3,
              color: selected === viewport.name ? 'white' : 'inherit',
              cursor: 'pointer',
              font: 'inherit',
              fontSize: 12,
              padding: '5px 10px',
            }}
          >
            {viewport.name} · {viewport.width}px
          </button>
        ))}
      </nav>
    </div>
  )
}
