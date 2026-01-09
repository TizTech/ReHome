import { create } from 'zustand'
import { Listing, ListingFilters, SortOption } from '../types'
import { seedListings } from '../data/seedListings'
import { saveListings, loadListings } from '../lib/storage'

interface ListingsStore {
  listings: Listing[]
  searchQuery: string
  filters: ListingFilters
  sortOption: SortOption
  
  // Actions
  addListing: (listing: Listing) => void
  updateListing: (id: string, patch: Partial<Listing>) => void
  deleteListing: (id: string) => void
  setSearchQuery: (query: string) => void
  setFilters: (filters: Partial<ListingFilters>) => void
  clearFilters: () => void
  setSortOption: (option: SortOption) => void
  importSeedIfEmpty: () => void
  resetToSeed: () => void
  
  // Selectors
  getFilteredSortedListings: () => Listing[]
}

const defaultFilters: ListingFilters = {
  cities: [],
  providers: [],
  roomTypes: [],
  priceMin: undefined,
  priceMax: undefined,
  contractEndBefore: undefined,
  contractEndAfter: undefined,
  availableFromBefore: undefined,
  availableFromAfter: undefined,
  billsIncluded: undefined,
  hasIncentives: undefined,
}

const saveToStorage = (listings: Listing[]) => {
  saveListings(listings)
}

export const useListingsStore = create<ListingsStore>((set, get) => {
  // Load from localStorage on initialization
  const saved = loadListings()
  const initialListings = (saved && Array.isArray(saved) && saved.length > 0) 
    ? saved 
    : []
  
  return {
  listings: initialListings,
  searchQuery: '',
  filters: defaultFilters,
  sortOption: 'newest',
  
  addListing: (listing: Listing) => {
    set((state) => {
      const newListings = [listing, ...state.listings]
      saveToStorage(newListings)
      return { listings: newListings }
    })
  },
  
  updateListing: (id: string, patch: Partial<Listing>) => {
    set((state) => {
      const newListings = state.listings.map((listing) =>
        listing.id === id
          ? { ...listing, ...patch, updatedAt: new Date().toISOString() }
          : listing
      )
      saveToStorage(newListings)
      return { listings: newListings }
    })
  },
  
  deleteListing: (id: string) => {
    set((state) => {
      const newListings = state.listings.filter((listing) => listing.id !== id)
      saveToStorage(newListings)
      return { listings: newListings }
    })
  },
  
  setSearchQuery: (query: string) => {
    set({ searchQuery: query })
  },
  
  setFilters: (filters: Partial<ListingFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }))
  },
  
  clearFilters: () => {
    set({ filters: defaultFilters })
  },
  
  setSortOption: (option: SortOption) => {
    set({ sortOption: option })
  },
  
  importSeedIfEmpty: () => {
    const state = get()
    if (state.listings.length === 0) {
      const saved = loadListings()
      if (saved && Array.isArray(saved) && saved.length > 0) {
        set({ listings: saved })
      } else {
        set({ listings: seedListings })
        saveToStorage(seedListings)
      }
    } else {
      // Always sync current state to storage
      saveToStorage(state.listings)
    }
  },
  
  resetToSeed: () => {
    set({ listings: seedListings, filters: defaultFilters, searchQuery: '' })
    saveToStorage(seedListings)
  },
  
  getFilteredSortedListings: () => {
    const { listings, searchQuery, filters, sortOption } = get()
    
    let filtered = listings.filter((listing) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          listing.title.toLowerCase().includes(query) ||
          listing.city.toLowerCase().includes(query) ||
          listing.buildingName.toLowerCase().includes(query) ||
          listing.provider.toLowerCase().includes(query) ||
          (listing.university && listing.university.toLowerCase().includes(query)) ||
          (listing.postcode && listing.postcode.toLowerCase().includes(query))
        
        if (!matchesSearch) return false
      }
      
      // City filter
      if (filters.cities.length > 0 && !filters.cities.includes(listing.city)) {
        return false
      }
      
      // Provider filter
      if (filters.providers.length > 0 && !filters.providers.includes(listing.provider)) {
        return false
      }
      
      // Room type filter
      if (filters.roomTypes.length > 0 && !filters.roomTypes.includes(listing.roomType)) {
        return false
      }
      
      // Price filter
      if (filters.priceMin !== undefined && listing.pricePerWeek < filters.priceMin) {
        return false
      }
      if (filters.priceMax !== undefined && listing.pricePerWeek > filters.priceMax) {
        return false
      }
      
      // Contract end date filter
      if (filters.contractEndBefore && listing.contractEnd > filters.contractEndBefore) {
        return false
      }
      if (filters.contractEndAfter && listing.contractEnd < filters.contractEndAfter) {
        return false
      }
      
      // Available from filter
      if (filters.availableFromBefore && listing.availableFrom > filters.availableFromBefore) {
        return false
      }
      if (filters.availableFromAfter && listing.availableFrom < filters.availableFromAfter) {
        return false
      }
      
      // Bills included filter
      if (filters.billsIncluded !== undefined && listing.billsIncluded !== filters.billsIncluded) {
        return false
      }
      
      // Incentives filter
      if (filters.hasIncentives === true) {
        const hasIncentive =
          listing.incentives.cashbackAmount !== undefined ||
          listing.incentives.discountedWeeks !== undefined
        if (!hasIncentive) return false
      }
      
      return true
    })
    
    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'price-asc':
          return a.pricePerWeek - b.pricePerWeek
        case 'price-desc':
          return b.pricePerWeek - a.pricePerWeek
        case 'available-soonest':
          return new Date(a.availableFrom).getTime() - new Date(b.availableFrom).getTime()
        case 'contract-end-soonest':
          return new Date(a.contractEnd).getTime() - new Date(b.contractEnd).getTime()
        default:
          return 0
      }
    })
    
    return sorted
  },
  }
})

