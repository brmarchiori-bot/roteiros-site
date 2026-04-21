import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium tracking-tight transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-foreground',
  secondary: 'bg-foreground text-background hover:bg-primary',
  ghost: 'text-foreground hover:text-primary',
  outline:
    'border border-foreground text-foreground hover:bg-foreground hover:text-background',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-4 text-xs',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-7 text-base',
}

type ButtonStyleOptions = {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  className,
}: ButtonStyleOptions = {}) {
  return cn(base, variants[variant], sizes[size], className)
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={buttonStyles({ variant, size, className })} {...props} />
}
