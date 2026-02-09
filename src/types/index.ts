export type Provider = 'Unite Students' | 'iQ' | 'Vita' | 'Other'

export type RoomType = 'Ensuite' | 'Studio' | 'Shared' | 'Other'

export type ContactMethod = 'email' | 'phone' | 'instagram'

export type ListingStatus = 'available' | 'pending' | 'taken'

export interface Incentives {
  cashbackAmount?: number
  discountedWeeks?: number
  notes?: string
}

export interface Contact {
  name?: string
  email?: string
  phone?: string
  instagram?: string
  preferredMethod: ContactMethod
}

export interface Listing {
  id: string
  title: string
  provider: Provider
  buildingName: string
  university?: string
  city: string
  postcode?: string
  roomType: RoomType
  pricePerWeek: number
  billsIncluded: boolean
  contractStart: string // ISO date
  contractEnd: string // ISO date
  availableFrom: string // ISO date
  minTenancyWeeks?: number
  deposit?: number
  incentives: Incentives
  amenities: string[]
  images: string[]
  description: string
  contact: Contact
  createdAt: string // ISO
  updatedAt: string // ISO
  status: ListingStatus
}

export interface ListingFilters {
  cities: string[]
  providers: Provider[]
  roomTypes: RoomType[]
  priceMin?: number
  priceMax?: number
  contractEndBefore?: string
  contractEndAfter?: string
  availableFromBefore?: string
  availableFromAfter?: string
  billsIncluded?: boolean
  hasIncentives?: boolean
}

export type SortOption = 
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'available-soonest'
  | 'contract-end-soonest'

