import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/**
 * Apple Touch Icon — versão 180×180 da identidade.
 * Aparece quando alguém adiciona o site à tela inicial do iPhone/iPad.
 * Mesma composição do favicon mas com tamanho de tela inicial.
 */
export default function AppleIcon() {
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
          fontSize: 130,
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontWeight: 600,
          paddingBottom: 12,
        }}
      >
        M
      </div>
    ),
    { ...size },
  )
}
