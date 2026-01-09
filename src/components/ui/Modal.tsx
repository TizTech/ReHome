import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])
  
  if (!isOpen) return null
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={cn(
          'bg-surface border border-border rounded-card-lg shadow-soft-lg max-w-lg w-full max-h-[90vh] overflow-y-auto',
          'animate-in zoom-in-95',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || onClose) && (
          <div className="flex items-center justify-between p-6 border-b border-border">
            {title && (
              <h2 id="modal-title" className="text-xl font-semibold text-text">
                {title}
              </h2>
            )}
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

