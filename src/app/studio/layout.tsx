import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Menos Roteiros — Painel',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#000000',
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children
}
