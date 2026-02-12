import { ReactNode, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Moon, Sun, RotateCcw } from 'lucide-react'
import { useThemeStore } from '../../store/themeStore'
import { useListingsStore } from '../../store/listingsStore'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { useState } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()
  const { theme, toggleTheme, initTheme } = useThemeStore()
  const { resetToSeed } = useListingsStore()
  const [showResetModal, setShowResetModal] = useState(false)
  
  // Initialize theme on mount
  useEffect(() => {
    initTheme()
  }, [initTheme])
  
  const handleReset = () => {
    resetToSeed()
    setShowResetModal(false)
  }
  
  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-200">
      {/* Navigation */}
      <nav className="border-b border-border bg-surface sticky top-0 z-30 backdrop-blur-sm bg-opacity-95">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-background font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-text">ReHome</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowResetModal(true)}
                aria-label="Reset demo data"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/new')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Listing
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main>{children}</main>
      
      {/* Footer */}
      <footer className="border-t border-border bg-surface mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-text-muted">
              <p className="mb-2">
                <strong>Local demo:</strong> All data stays on this device
              </p>
              <div className="flex gap-4">
                <Link to="/about" className="hover:text-text transition-colors">
                  About
                </Link>
              </div>
            </div>
            <div className="text-xs text-text-muted text-center">
              © {new Date().getFullYear()} ReHome • An Entity of <span className="font-[600]" style={{ fontFamily: "'Clash Display', -apple-system, sans-serif", fontWeight: 600 }}>Digitgine</span>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Reset Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Demo Data"
      >
        <p className="text-text mb-4">
          Are you sure you want to reset all listings to the default demo data? 
          This will remove all listings you've added and restore the original seed listings.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setShowResetModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </Modal>
    </div>
  )
}

