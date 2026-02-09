import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Plus } from 'lucide-react'
import { useListingsStore } from '../store/listingsStore'
import { ListingGrid } from '../components/listings/ListingGrid'
import { FiltersPanel } from '../components/listings/FiltersPanel'
import { SortMenu } from '../components/listings/SortMenu'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Drawer } from '../components/ui/Drawer'

export function Home() {
  const navigate = useNavigate()
  const { searchQuery, setSearchQuery, getFilteredSortedListings } = useListingsStore()
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  const listings = getFilteredSortedListings()
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [localSearch, setSearchQuery])
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Search and Actions */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 max-w-2xl w-full">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
              <Input
                type="text"
                placeholder="Search listings by title, city, building, provider, university..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-12"
              />
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="secondary"
              onClick={() => setIsFilterOpen(true)}
              className="md:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/new')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Listing
            </Button>
          </div>
        </div>
        
        {/* Sort and Results Count */}
        <div className="flex items-center justify-between">
          <SortMenu />
          <p className="text-sm text-text-muted">
            {listings.length} {listings.length === 1 ? 'listing' : 'listings'} found
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex gap-8">
        {/* Filters Sidebar (Desktop) */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-8">
            <FiltersPanel />
          </div>
        </aside>
        
        {/* Listings Grid */}
        <main className="flex-1 min-w-0">
          <ListingGrid listings={listings} />
        </main>
      </div>
      
      {/* Filters Drawer (Mobile) */}
      <Drawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filters"
      >
        <FiltersPanel />
      </Drawer>
    </div>
  )
}

