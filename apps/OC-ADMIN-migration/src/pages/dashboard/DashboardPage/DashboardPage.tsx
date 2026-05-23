import AreaList from './components/area-list/AreaList'
import AreaPagination from './components/AreaPagination/AreaPagination'
import AreaPageHeader from './components/AreaPageHeader/AreaPageHeader'
import AreaSearchFilter from './components/AreaSearchFilter/AreaSearchFilter'
import DashBoardLayout from './components/DashBoardLayout/DashBoardLayout'
import AreaListSection from './components/area-list/AreaListSection'
import useAreaListState from './hooks/useAreaListState'
import AreaResultSummary from './components/AreaResultSummary/AreaResultSummary'

export default function DashboardPage() {
  const areaList = useAreaListState()

  return (
    <DashBoardLayout>
      <AreaPageHeader />
      <AreaSearchFilter {...areaList.searchFilterProps} />

      <AreaResultSummary totalElements={areaList.totalElements} />

      <AreaListSection {...areaList.listSectionProps}>
        <AreaList areas={areaList.areas} />
      </AreaListSection>

      <AreaPagination {...areaList.paginationProps} />
    </DashBoardLayout>
  )
}
