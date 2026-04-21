/**
 * Configuração do Sanity Studio.
 * Acessível em /studio depois do deploy.
 */
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId } from '@/sanity/env'
import { schemaTypes } from '@/sanity/schemas'
import { structure } from '@/sanity/structure'

export default defineConfig({
  name: 'menos-roteiros',
  title: 'Menos Roteiros — Painel',
  basePath: '/studio',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
})
