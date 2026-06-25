import type {
  HabitatType,
  ProjectLevel,
  RestorationRegion,
} from '@ocean-kit/dashboard-domain/types/areas'
import type { AreaFilters } from '../../../types'

type Props = {
  filters: AreaFilters
  hasActiveFilters: boolean
  onFiltersChange: <TKey extends keyof AreaFilters>(
    key: TKey,
    value: AreaFilters[TKey],
  ) => void
  onFiltersClear: () => void
}

export default function AreaFilterPanel({
  filters,
  hasActiveFilters,
  onFiltersChange,
  onFiltersClear,
}: Props) {
  return (
    <div className="px-4 pb-4 border-t border-gray-100 pt-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            복원 지역
          </label>
          <select
            value={filters.region}
            onChange={(event) =>
              onFiltersChange(
                'region',
                event.target.value as RestorationRegion | '',
              )
            }
            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
          >
            <option value="">전체</option>
            <option value="POHANG">포항</option>
            <option value="ULJIN">울진</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            프로젝트 단계
          </label>
          <select
            value={filters.level}
            onChange={(event) =>
              onFiltersChange('level', event.target.value as ProjectLevel | '')
            }
            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
          >
            <option value="">전체</option>
            <option value="OBSERVATION">관측</option>
            <option value="SETTLEMENT">정착</option>
            <option value="GROWTH">성장</option>
            <option value="MANAGEMENT">관리</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            서식지 유형
          </label>
          <select
            value={filters.habitat}
            onChange={(event) =>
              onFiltersChange('habitat', event.target.value as HabitatType | '')
            }
            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
          >
            <option value="">전체</option>
            <option value="ROCKY">암반</option>
            <option value="MIXED">혼합</option>
            <option value="OTHER">기타</option>
          </select>
        </div>

        <div className="md:col-span-2 xl:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            기간
          </label>
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
            <input
              type="date"
              value={filters.from}
              onChange={(event) => onFiltersChange('from', event.target.value)}
              className="min-w-0 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC] text-sm"
            />
            <span className="shrink-0 text-gray-400">~</span>
            <input
              type="date"
              value={filters.to}
              onChange={(event) => onFiltersChange('to', event.target.value)}
              className="min-w-0 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC] text-sm"
            />
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onFiltersClear}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            필터 초기화
          </button>
        </div>
      )}
    </div>
  )
}
