import type { EditorialAggregateSource } from '@/sanity/editorial/home'

/**
 * Estado resolvido no servidor. O marcador só informa o indicador visual;
 * autorização e leitura editorial nunca dependem dele.
 */
export function EditorialPreviewSourceMarker({ source }: { source: EditorialAggregateSource }) {
  return <span hidden data-editorial-preview-source={source} />
}
