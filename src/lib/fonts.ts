import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google'

/**
 * Tipografia da marca — carregada via next/font/google.
 * Variáveis CSS expostas pra Tailwind consumir no @theme.
 *
 * Display: Fraunces (serif editorial, variable font)
 * Sans: Inter (humanista, neutra, premium)
 * Mono: JetBrains Mono (detalhes, datas, "Dia 47")
 *
 * Nota: General Sans (Fontshare) era a primeira escolha. Inter foi mantido
 * por simplicidade de integração — troca futura via next/font/local.
 */

export const fontDisplay = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz', 'SOFT'],
})

export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500'],
})

export const fontVariables = `${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`
