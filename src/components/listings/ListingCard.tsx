import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Copy } from 'lucide-react'
import { Listing } from '../../types'
import { formatDate, formatPricePerWeek } from '../../lib/format'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { useListingsStore } from '../../store/listingsStore'

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const navigate = useNavigate()
  const { updateListing } = useListingsStore()
  
  const hasIncentive = 
    listing.incentives.cashbackAmount !== undefined ||
    listing.incentives.discountedWeeks !== undefined
  
  const handleCopyContact = (e: React.MouseEvent) => {
    e.stopPropagation()
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
    }
  }
  
  return (
    <Card
      hover
      onClick={() => navigate(`/listings/${listing.id}`)}
      className="flex flex-col h-full"
    >
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-text truncate mb-1">
              {listing.title}
            </h3>
            <div className="flex items-center gap-2 text-text-muted text-sm mb-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{listing.city}</span>
              {listing.postcode && <span>• {listing.postcode}</span>}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge>{listing.provider}</Badge>
          <Badge variant="info">{listing.roomType}</Badge>
          {listing.billsIncluded && (
            <Badge variant="success">Bills included</Badge>
          )}
          {hasIncentive && (
            <Badge variant="warning">Incentive</Badge>
          )}
        </div>
        
        <div className="space-y-1.5 mb-4 text-sm text-text-muted">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Available from {formatDate(listing.availableFrom)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Contract ends {formatDate(listing.contractEnd)}</span>
          </div>
        </div>
        
        {listing.description && (
          <p className="text-sm text-text-muted line-clamp-2 mb-4">
            {listing.description}
          </p>
        )}
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div>
          <div className="text-2xl font-bold text-text">
            {formatPricePerWeek(listing.pricePerWeek)}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyContact}
          aria-label="Copy contact"
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}

