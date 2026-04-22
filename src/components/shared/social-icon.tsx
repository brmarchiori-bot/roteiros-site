import type { SVGProps } from 'react'

export type SocialPlatform = 'instagram' | 'youtube' | 'tiktok'

type Props = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  platform: SocialPlatform
}

/**
 * Ícones minimalistas de rede social.
 * - Traço fino (1.25) em currentColor — herdam a cor do texto em volta.
 * - Sem cores de marca — aparência editorial/tipográfica.
 * - Por padrão são aria-hidden (decorativos); o link em volta deve ter aria-label.
 */
export function SocialIcon({ platform, className, ...rest }: Props) {
  const svgProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.25,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    className: className ?? 'h-5 w-5',
    ...rest,
  }

  if (platform === 'instagram') {
    return (
      <svg {...svgProps}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="3.75" />
        <circle cx="17" cy="7" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (platform === 'youtube') {
    return (
      <svg {...svgProps}>
        <rect x="2.75" y="6" width="18.5" height="12" rx="2.75" />
        <path d="m10.25 9.5 4.25 2.5-4.25 2.5z" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  // tiktok — dois ♪ com a haste conectada (nota musical editorial)
  return (
    <svg {...svgProps}>
      <path d="M9 18V5.5l7-2v11" />
      <circle cx="6.75" cy="18" r="2.25" fill="currentColor" stroke="none" />
      <circle cx="13.75" cy="15.5" r="2.25" fill="currentColor" stroke="none" />
    </svg>
  )
}
