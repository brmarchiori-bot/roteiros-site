import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

/**
 * Favicon programático — letra "M" italic em quadrado terracota.
 * Gerado em build time. Next.js injeta automaticamente como <link rel="icon">.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#C4512A',
          color: '#F3EEE5',
          fontSize: 24,
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontWeight: 600,
          paddingBottom: 2,
        }}
      >
        M
      </div>
    ),
    { ...size },
  )
}
