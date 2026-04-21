/**
 * Studio do Sanity embedado em /studio/*
 * Requer NEXT_PUBLIC_SANITY_PROJECT_ID configurada (ver .env.example).
 */
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export const dynamic = 'force-static'

export default function StudioPage() {
  return <NextStudio config={config} />
}
