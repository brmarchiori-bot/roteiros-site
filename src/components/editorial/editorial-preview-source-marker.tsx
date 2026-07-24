import type { EditorialContentSource } from '@/sanity/editorial/pillars'

/**
 * Estado resolvido no servidor. O marcador só informa o indicador visual;
 * autorização e leitura editorial nunca dependem dele.
 */
export function EditorialPreviewSourceMarker({ source }: { source: EditorialContentSource }) {
  return <span hidden data-editorial-preview-source={source} />
}
