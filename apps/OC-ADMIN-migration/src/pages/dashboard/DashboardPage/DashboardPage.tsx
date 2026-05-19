import { useState } from 'react'
import { ClipLoader } from 'react-spinners'
import AreaList from './components/area-list/AreaList'
import AreaPagination from './components/AreaPagination/AreaPagination'
import AreaPageHeader from './components/AreaPageHeader/AreaPageHeader'
import AreaSearchFilter from './components/AreaSearchFilter/AreaSearchFilter'
import DashBoardLayout from './components/DashBoardLayout/DashBoardLayout'
import { useGetAreas } from './hooks/useAreas'
import type { AreaFilters } from './types'
import AreaListSection from './components/area-list/AreaListSection'
import useAreaListState from './hooks/useAreaListState'

const FILTERS_INIT: AreaFilters = {
  region: '',
  level: '',
  habitat: '',
  from: '',
  to: '',
  keyword: '',
}

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<AreaFilters>(FILTERS_INIT)

  const areaList = useAreaListState()

  return (
    <DashBoardLayout>
      <AreaPageHeader />
      <AreaSearchFilter
        filters={filters}
        onFiltersChange={(newFilters) => {
          setFilters(newFilters)
          setCurrentPage(1)
        }}
        onSearch={() => setCurrentPage(1)}
      />

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          총<span className="font-semibold text-gray-900">{totalElements}</span>
          개의 작업영역
        </p>
      </div>

      <AreaListSection {...areaList.listSectionProps}>
        <AreaList areas={areaList.areas} />
      </AreaListSection>

      <AreaPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </DashBoardLayout>
  )
}
