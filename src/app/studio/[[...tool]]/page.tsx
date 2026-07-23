/**
 * Studio do Sanity embedado em /studio/*
 * Requer NEXT_PUBLIC_SANITY_PROJECT_ID configurada (ver .env.example).
 */
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'
import { hasSanityConfig } from '@/sanity/env'

export const dynamic = 'force-static'

export default function StudioPage() {
  if (!hasSanityConfig) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: 24,
          background: '#f3eee5',
          color: '#0e0e0d',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 560 }}>
          <h1>Studio ainda não configurado</h1>
          <p style={{ lineHeight: 1.6, opacity: 0.7 }}>
            Defina NEXT_PUBLIC_SANITY_PROJECT_ID e NEXT_PUBLIC_SANITY_DATASET no ambiente para
            abrir o painel editorial.
          </p>
        </div>
      </main>
    )
  }

  return <NextStudio config={config} />
}
