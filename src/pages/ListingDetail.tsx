import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Mail, Phone, Instagram, Edit, Trash2, Flag } from 'lucide-react'
import { useListingsStore } from '../store/listingsStore'
import { formatDate, formatPricePerWeek, formatCurrency } from '../lib/format'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { useState } from 'react'

export function ListingDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { listings, deleteListing } = useListingsStore()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const listing = listings.find((l) => l.id === id)
  
  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-text mb-4">Listing not found</h1>
        <Button onClick={() => navigate('/')}>Back to Listings</Button>
      </div>
    )
  }
  
  const hasIncentive =
    listing.incentives.cashbackAmount !== undefined ||
    listing.incentives.discountedWeeks !== undefined
  
  const handleCopyContact = () => {
    const contact = listing.contact
    let textToCopy = ''
    
    if (contact.preferredMethod === 'email' && contact.email) {
      textToCopy = contact.email
    } else if (contact.preferredMethod === 'phone' && contact.phone) {
      textToCopy = contact.phone
    } else if (contact.preferredMethod === 'instagram' && contact.instagram) {
      textToCopy = contact.instagram
    }
    
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  const handleInstagramClick = () => {
    if (listing.contact.instagram) {
      const handle = listing.contact.instagram.replace('@', '')
      window.open(`https://instagram.com/${handle}`, '_blank')
    }
  }
  
  const handleDelete = () => {
    deleteListing(listing.id)
    setShowDeleteModal(false)
    navigate('/')
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Listings
      </Button>
      
      {/* Hero Section with Images */}
      <div className="mb-8">
        {listing.images.length > 0 ? (
          <div className="rounded-card-lg overflow-hidden bg-surface-2 border border-border">
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        ) : (
          <div className="rounded-card-lg h-64 md:h-96 bg-surface-2 border border-border flex items-center justify-center">
            <p className="text-text-muted">No images available</p>
          </div>
        )}
      </div>
      
      {/* Title and Actions */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-text mb-2">{listing.title}</h1>
          <div className="flex items-center gap-2 text-text-muted mb-4">
            <MapPin className="w-5 h-5" />
            <span>{listing.city}</span>
            {listing.postcode && <span>• {listing.postcode}</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>{listing.provider}</Badge>
            <Badge variant="info">{listing.roomType}</Badge>
            {listing.billsIncluded && <Badge variant="success">Bills included</Badge>}
            {hasIncentive && <Badge variant="warning">Incentive available</Badge>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate(`/listings/${listing.id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Key Facts */}
          <Card>
            <h2 className="text-xl font-semibold text-text mb-4">Key Facts</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-muted mb-1">Price per week</p>
                <p className="text-xl font-bold text-text">
                  {formatPricePerWeek(listing.pricePerWeek)}
                </p>
              </div>
              {listing.deposit && (
                <div>
                  <p className="text-sm text-text-muted mb-1">Deposit</p>
                  <p className="text-xl font-bold text-text">
                    {formatCurrency(listing.deposit)}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-text-muted mb-1">Available from</p>
                <p className="font-medium text-text">{formatDate(listing.availableFrom)}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted mb-1">Contract ends</p>
                <p className="font-medium text-text">{formatDate(listing.contractEnd)}</p>
              </div>
              {listing.minTenancyWeeks && (
                <div>
                  <p className="text-sm text-text-muted mb-1">Minimum tenancy</p>
                  <p className="font-medium text-text">{listing.minTenancyWeeks} weeks</p>
                </div>
              )}
              {listing.university && (
                <div>
                  <p className="text-sm text-text-muted mb-1">University</p>
                  <p className="font-medium text-text">{listing.university}</p>
                </div>
              )}
            </div>
          </Card>
          
          {/* Description */}
          <Card>
            <h2 className="text-xl font-semibold text-text mb-4">Description</h2>
            <p className="text-text whitespace-pre-wrap">{listing.description}</p>
          </Card>
          
          {/* Amenities */}
          {listing.amenities.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold text-text mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((amenity) => (
                  <Badge key={amenity}>{amenity}</Badge>
                ))}
              </div>
            </Card>
          )}
          
          {/* Incentives */}
          {hasIncentive && (
            <Card>
              <h2 className="text-xl font-semibold text-text mb-4">Incentives</h2>
              <div className="space-y-2">
                {listing.incentives.cashbackAmount && (
                  <p className="text-text">
                    <strong>Cashback:</strong> {formatCurrency(listing.incentives.cashbackAmount)}
                  </p>
                )}
                {listing.incentives.discountedWeeks && (
                  <p className="text-text">
                    <strong>Discounted weeks:</strong> {listing.incentives.discountedWeeks} week(s) free
                  </p>
                )}
                {listing.incentives.notes && (
                  <p className="text-text-muted">{listing.incentives.notes}</p>
                )}
              </div>
            </Card>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <h2 className="text-xl font-semibold text-text mb-4">Contact</h2>
            <div className="space-y-4">
              {listing.contact.name && (
                <p className="font-medium text-text">{listing.contact.name}</p>
              )}
              
              {listing.contact.preferredMethod === 'email' && listing.contact.email && (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleCopyContact}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {copied ? 'Copied!' : `Copy Email: ${listing.contact.email}`}
                </Button>
              )}
              
              {listing.contact.preferredMethod === 'phone' && listing.contact.phone && (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleCopyContact}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {copied ? 'Copied!' : `Copy Phone: ${listing.contact.phone}`}
                </Button>
              )}
              
              {listing.contact.preferredMethod === 'instagram' && listing.contact.instagram && (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleInstagramClick}
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Contact on Instagram
                </Button>
              )}
              
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setShowReportModal(true)}
              >
                <Flag className="w-4 h-4 mr-2" />
                Report Listing
              </Button>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Listing"
      >
        <p className="text-text mb-4">
          Are you sure you want to delete this listing? This action cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
      
      {/* Report Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Report Listing"
      >
        <p className="text-text">
          Reporting functionality is coming soon. In a production version, this would allow you to report inappropriate listings.
        </p>
        <div className="flex justify-end mt-4">
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  )
}

