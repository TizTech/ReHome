import { useState } from 'react'
import { X } from 'lucide-react'
import { useListingsStore } from '../../store/listingsStore'
import { Provider, RoomType } from '../../types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'

const PROVIDERS: Provider[] = ['Unite Students', 'iQ', 'Vita', 'Other']
const ROOM_TYPES: RoomType[] = ['Ensuite', 'Studio', 'Shared', 'Other']

export function FiltersPanel() {
  const { filters, setFilters, clearFilters, listings } = useListingsStore()
  const [localPriceMin, setLocalPriceMin] = useState(filters.priceMin?.toString() || '')
  const [localPriceMax, setLocalPriceMax] = useState(filters.priceMax?.toString() || '')
  
  // Get unique values from current listings
  const availableCities = Array.from(new Set(listings.map(l => l.city))).sort()
  const maxPrice = Math.max(...listings.map(l => l.pricePerWeek), 0)
  
  const toggleCity = (city: string) => {
    setFilters({
      cities: filters.cities.includes(city)
        ? filters.cities.filter(c => c !== city)
        : [...filters.cities, city],
    })
  }
  
  const toggleProvider = (provider: Provider) => {
    setFilters({
      providers: filters.providers.includes(provider)
        ? filters.providers.filter(p => p !== provider)
        : [...filters.providers, provider],
    })
  }
  
  const toggleRoomType = (roomType: RoomType) => {
    setFilters({
      roomTypes: filters.roomTypes.includes(roomType)
        ? filters.roomTypes.filter(r => r !== roomType)
        : [...filters.roomTypes, roomType],
    })
  }
  
  const handlePriceMinChange = (value: string) => {
    setLocalPriceMin(value)
    const num = parseInt(value)
    setFilters({ priceMin: isNaN(num) ? undefined : num })
  }
  
  const handlePriceMaxChange = (value: string) => {
    setLocalPriceMax(value)
    const num = parseInt(value)
    setFilters({ priceMax: isNaN(num) ? undefined : num })
  }
  
  const hasActiveFilters =
    filters.cities.length > 0 ||
    filters.providers.length > 0 ||
    filters.roomTypes.length > 0 ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined ||
    filters.billsIncluded !== undefined ||
    filters.hasIncentives !== undefined
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        )}
      </div>
      
      {/* City Filter */}
      <div>
        <label className="block text-sm font-medium text-text mb-2">City</label>
        <div className="flex flex-wrap gap-2">
          {availableCities.map((city) => (
            <Badge
              key={city}
              variant={filters.cities.includes(city) ? 'info' : 'default'}
              className="cursor-pointer"
              onClick={() => toggleCity(city)}
            >
              {city}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Provider Filter */}
      <div>
        <label className="block text-sm font-medium text-text mb-2">Provider</label>
        <div className="flex flex-wrap gap-2">
          {PROVIDERS.map((provider) => (
            <Badge
              key={provider}
              variant={filters.providers.includes(provider) ? 'info' : 'default'}
              className="cursor-pointer"
              onClick={() => toggleProvider(provider)}
            >
              {provider}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Room Type Filter */}
      <div>
        <label className="block text-sm font-medium text-text mb-2">Room Type</label>
        <div className="flex flex-wrap gap-2">
          {ROOM_TYPES.map((roomType) => (
            <Badge
              key={roomType}
              variant={filters.roomTypes.includes(roomType) ? 'info' : 'default'}
              className="cursor-pointer"
              onClick={() => toggleRoomType(roomType)}
            >
              {roomType}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Price per week (£)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={localPriceMin}
            onChange={(e) => handlePriceMinChange(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={localPriceMax}
            onChange={(e) => handlePriceMaxChange(e.target.value)}
          />
        </div>
        <p className="text-xs text-text-muted mt-1">
          Max: £{maxPrice}/week
        </p>
      </div>
      
      {/* Bills Included Toggle */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.billsIncluded === true}
            onChange={(e) =>
              setFilters({
                billsIncluded: e.target.checked ? true : undefined,
              })
            }
            className="w-4 h-4 rounded border-border text-accent focus:ring-focus-ring"
          />
          <span className="text-sm text-text">Bills included only</span>
        </label>
      </div>
      
      {/* Has Incentives Toggle */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.hasIncentives === true}
            onChange={(e) =>
              setFilters({
                hasIncentives: e.target.checked ? true : undefined,
              })
            }
            className="w-4 h-4 rounded border-border text-accent focus:ring-focus-ring"
          />
          <span className="text-sm text-text">Has incentives only</span>
        </label>
      </div>
      
      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Active Filters
          </label>
          <div className="flex flex-wrap gap-2">
            {filters.cities.map((city) => (
              <Badge
                key={city}
                variant="info"
                className="cursor-pointer"
                onClick={() => toggleCity(city)}
              >
                {city} <X className="w-3 h-3 ml-1 inline" />
              </Badge>
            ))}
            {filters.providers.map((provider) => (
              <Badge
                key={provider}
                variant="info"
                className="cursor-pointer"
                onClick={() => toggleProvider(provider)}
              >
                {provider} <X className="w-3 h-3 ml-1 inline" />
              </Badge>
            ))}
            {filters.roomTypes.map((roomType) => (
              <Badge
                key={roomType}
                variant="info"
                className="cursor-pointer"
                onClick={() => toggleRoomType(roomType)}
              >
                {roomType} <X className="w-3 h-3 ml-1 inline" />
              </Badge>
            ))}
            {filters.billsIncluded && (
              <Badge
                variant="info"
                className="cursor-pointer"
                onClick={() => setFilters({ billsIncluded: undefined })}
              >
                Bills included <X className="w-3 h-3 ml-1 inline" />
              </Badge>
            )}
            {filters.hasIncentives && (
              <Badge
                variant="info"
                className="cursor-pointer"
                onClick={() => setFilters({ hasIncentives: undefined })}
              >
                Has incentives <X className="w-3 h-3 ml-1 inline" />
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

