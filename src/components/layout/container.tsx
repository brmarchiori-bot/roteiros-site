import { cn } from '@/lib/utils'

type ContainerProps = {
  children: React.ReactNode
  className?: string
  size?: 'narrow' | 'default' | 'wide'
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'main' | 'nav'
}

const sizeClasses: Record<NonNullable<ContainerProps['size']>, string> = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
}

export function Container({
  children,
  className,
  size = 'default',
  as: Tag = 'div',
}: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full px-6 md:px-10 lg:px-16', sizeClasses[size], className)}>
      {children}
    </Tag>
  )
}
