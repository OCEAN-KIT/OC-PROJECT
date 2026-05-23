import { useState } from 'react'
import AreaSearchBar from './components/AreaSearchBar'
import AreaFilterPanel from './components/AreaFilterPanel'
import type { AreaFilters } from '../../types'

type Props = {
  filters: AreaFilters
  hasActiveFilters: boolean
  onFiltersChange: <TKey extends keyof AreaFilters>(
    key: TKey,
    value: AreaFilters[TKey],
  ) => void
  onFiltersClear: () => void
}

export default function AreaSearchFilter({
  filters,
  hasActiveFilters,
  onFiltersChange,
  onFiltersClear,
}: Props) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
      <AreaSearchBar
        keyword={filters.keyword}
        isFilterPanelOpen={showFilters}
        hasActiveFilters={hasActiveFilters}
        onKeywordChange={(keyword) => onFiltersChange('keyword', keyword)}
        onToggleFilterPanel={() => setShowFilters((open) => !open)}
      />

      {showFilters && (
        <AreaFilterPanel
          filters={filters}
          hasActiveFilters={hasActiveFilters}
          onFiltersChange={onFiltersChange}
          onFiltersClear={onFiltersClear}
        />
      )}
    </div>
  )
}
