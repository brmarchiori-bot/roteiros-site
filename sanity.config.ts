/**
 * Configuração do Sanity Studio.
 * Acessível em /studio depois do deploy.
 */
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { dataset, projectId } from '@/sanity/env'
import { schemaTypes } from '@/sanity/schemas'
import { structure } from '@/sanity/structure'

export default defineConfig({
  name: 'menos-roteiros',
  title: 'Menos Roteiros — Painel',
  basePath: '/studio',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool({ structure })],
})
