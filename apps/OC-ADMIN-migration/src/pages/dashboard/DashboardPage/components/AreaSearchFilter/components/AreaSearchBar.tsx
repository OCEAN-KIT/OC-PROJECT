import { Filter, Search } from 'lucide-react'

type Props = {
  keyword: string
  isFilterPanelOpen: boolean
  hasActiveFilters: boolean
  onKeywordChange: (keyword: string) => void
  onToggleFilterPanel: () => void
}

export default function AreaSearchBar({
  keyword,
  isFilterPanelOpen,
  hasActiveFilters,
  onKeywordChange,
  onToggleFilterPanel,
}: Props) {
  return (
    <div className="p-4 flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          placeholder="작업영역 이름으로 검색..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onToggleFilterPanel}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium transition-colors ${
            isFilterPanelOpen || hasActiveFilters
              ? 'bg-[#2C67BC] text-white border-[#2C67BC]'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Filter className="h-4 w-4" />
          필터
          {hasActiveFilters && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded">
              활성
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
