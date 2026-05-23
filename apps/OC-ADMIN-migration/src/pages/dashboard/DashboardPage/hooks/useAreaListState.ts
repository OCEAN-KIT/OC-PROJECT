import { useState } from 'react'
import type { AreaFilters } from '../types'
import { useGetAreas } from './useAreas'

const FILTERS_INIT: AreaFilters = {
  region: '',
  level: '',
  habitat: '',
  from: '',
  to: '',
  keyword: '',
}

export default function useAreaListState() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<AreaFilters>(FILTERS_INIT)

  const { data, isLoading, isError } = useGetAreas(page, filters)

  const areas = data?.data.content ?? []
  const totalPages = data?.data.totalPages ?? 0
  const totalElements = data?.data.totalElements ?? 0

  const hasActiveFilters = Boolean(
    filters.keyword ||
    filters.region ||
    filters.level ||
    filters.habitat ||
    filters.from ||
    filters.to,
  )

  const handleFiltersChange = <TKey extends keyof AreaFilters>(
    key: TKey,
    value: AreaFilters[TKey],
  ) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }))
    setPage(1)
  }

  const handleClearFilters = () => {
    setFilters(FILTERS_INIT)
    setPage(1)
  }

  return {
    areas,
    totalElements,

    searchFilterProps: {
      filters,
      hasActiveFilters,
      onFiltersChange: handleFiltersChange,
      onFiltersClear: handleClearFilters,
    },

    listSectionProps: {
      isLoading,
      isError,
    },

    paginationProps: {
      totalPages,
      currentPage: page,
      onPageChange: setPage,
    },
  }
}
