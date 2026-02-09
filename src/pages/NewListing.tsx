import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useListingsStore } from '../store/listingsStore'
import { Listing } from '../types'
import { ListingForm } from '../components/forms/ListingForm'
import { Button } from '../components/ui/Button'
import { useState } from 'react'
import { ToastContainer } from '../components/ui/ToastContainer'

interface ToastItem {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

export function NewListing() {
  const navigate = useNavigate()
  const { addListing } = useListingsStore()
  const [toasts, setToasts] = useState<ToastItem[]>([])
  
  const addToast = (message: string, type: ToastItem['type'] = 'info') => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type }])
  }
  
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }
  
  const handleSubmit = (listing: Listing) => {
    addListing(listing)
    addToast('Listing added (local demo)', 'success')
    setTimeout(() => {
      navigate(`/listings/${listing.id}`)
    }, 500)
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Listings
      </Button>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Add New Listing</h1>
        <p className="text-text-muted">
          Fill out the form below to create a new listing. All data is stored locally on your device.
        </p>
      </div>
      
      <ListingForm onSubmit={handleSubmit} onCancel={() => navigate('/')} />
      
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

