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

  return {
    areas,
    listSectionProps: {
      isLoading,
      isError,
    },
  }
}
