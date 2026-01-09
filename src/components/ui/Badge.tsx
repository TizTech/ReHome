import { ReactNode, ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface BadgeProps extends Omit<ButtonHTMLAttributes<HTMLSpanElement>, 'onClick'> {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'info'
  className?: string
  onClick?: () => void
}

export function Badge({ children, variant = 'default', className, onClick, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-surface-2 text-text border border-border',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
  }
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        variants[variant],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </span>
  )
}

