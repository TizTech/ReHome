import { useParams, useNavigate } from 'react-router-dom'
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

export function EditListing() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { listings, updateListing } = useListingsStore()
  const [toasts, setToasts] = useState<ToastItem[]>([])
  
  const listing = listings.find((l) => l.id === id)
  
  const addToast = (message: string, type: ToastItem['type'] = 'info') => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type }])
  }
  
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }
  
  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-text mb-4">Listing not found</h1>
        <Button onClick={() => navigate('/')}>Back to Listings</Button>
      </div>
    )
  }
  
  const handleSubmit = (updatedListing: Listing) => {
    updateListing(id!, updatedListing)
    addToast('Listing updated (local demo)', 'success')
    setTimeout(() => {
      navigate(`/listings/${id}`)
    }, 500)
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate(`/listings/${id}`)}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Listing
      </Button>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Edit Listing</h1>
        <p className="text-text-muted">
          Update your listing information. All data is stored locally on your device.
        </p>
      </div>
      
      <ListingForm
        initialData={listing}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/listings/${id}`)}
      />
      
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

