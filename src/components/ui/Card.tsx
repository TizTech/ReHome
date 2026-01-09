import { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-card p-6 transition-all duration-200',
        hover && 'hover:shadow-soft-lg hover:-translate-y-1 cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

