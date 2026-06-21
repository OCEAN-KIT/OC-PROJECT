/*
 * 홈 화면 상단 툴바 UI입니다.
 * 필터 입력, 검색 버튼, 일괄 액션의 배치만 담당하고,
 * 검색/승인/반려가 실제로 어떤 API를 호출하는지는 props로 받은 핸들러에 위임합니다.
 */
import type { Dispatch, SetStateAction } from 'react'
import type { ListFilters } from '../api/submissions'
import FilterBar from './filter-bar/filter-bar'
import ReviewBulkActions from './review-list/review-bulk-actions'

type SubmissionToolbarProps = {
  filters: ListFilters
  onFiltersChange: Dispatch<SetStateAction<ListFilters>>
  onSearch: () => void
  isFetching: boolean
  bulkActions: {
    total: number
    selectedCount: number
    allSelected: boolean
    onToggleAll: () => void
    onExportCsv: () => void
    onBulkApprove: () => void
    onOpenReject: () => void
    exportingCsv: boolean
    disabled: boolean
  }
}

export function SubmissionToolbar({
  filters,
  onFiltersChange,
  onSearch,
  isFetching,
  bulkActions,
}: SubmissionToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <FilterBar value={filters} onChange={onFiltersChange} />
      <button
        className="ml-2 h-10 rounded-xl border border-gray-200 px-4 text-sm"
        onClick={onSearch}
        disabled={isFetching}
      >
        검색
      </button>

      <ReviewBulkActions
        className="ml-auto"
        total={bulkActions.total}
        selectedCount={bulkActions.selectedCount}
        allSelected={bulkActions.allSelected}
        onToggleAll={bulkActions.onToggleAll}
        onExportCsv={bulkActions.onExportCsv}
        onBulkApprove={bulkActions.onBulkApprove}
        onOpenReject={bulkActions.onOpenReject}
        exportingCsv={bulkActions.exportingCsv}
        disabled={bulkActions.disabled}
      />
    </div>
  )
}
