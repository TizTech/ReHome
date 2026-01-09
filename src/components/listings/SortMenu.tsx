import { SortOption } from '../../types'
import { useListingsStore } from '../../store/listingsStore'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'available-soonest', label: 'Available: Soonest' },
  { value: 'contract-end-soonest', label: 'Contract End: Soonest' },
]

export function SortMenu() {
  const { sortOption, setSortOption } = useListingsStore()
  
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-text whitespace-nowrap">
        Sort by:
      </label>
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value as SortOption)}
        className="px-3 py-2 rounded-xl border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-transparent transition-all duration-200"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

