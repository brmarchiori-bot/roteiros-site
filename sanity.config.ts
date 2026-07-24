/**
 * Configuração do Sanity Studio.
 * Acessível em /studio depois do deploy.
 */
import { defineConfig } from 'sanity'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'
import { dataset, projectId } from '@/sanity/env'
import { presentationResolve } from '@/sanity/presentation'
import { PresentationPreviewHeader } from '@/sanity/presentation-preview-header'
import { schemaTypes } from '@/sanity/schemas'
import { structure } from '@/sanity/structure'

export default defineConfig({
  name: 'menos-roteiros',
  title: 'Menos Roteiros — Painel',
  basePath: '/studio',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      name: 'visualizar',
      title: 'Visualizar página',
      previewUrl: {
        initial: '/',
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
          shareAccess: false,
        },
      },
      resolve: presentationResolve,
      components: {
        unstable_header: {
          component: PresentationPreviewHeader,
        },
      },
    }),
  ],
})
