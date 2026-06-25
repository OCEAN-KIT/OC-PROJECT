'use client'

/*
 * 제출 목록 필터를 입력받는 controlled UI 컴포넌트입니다.
 * 필터 상태를 직접 소유하지 않고,
 * value/onChange 계약으로 상태 변경 의도만 부모에 전달합니다.
 */
import type { FilterDate, FilterState } from './types'
import type { Dispatch, SetStateAction } from 'react'

type Props = {
  value: FilterState
  onChange: Dispatch<SetStateAction<FilterState>>
  className?: string
}

export default function FilterBar({ value, onChange, className }: Props) {
  const set = (patch: Partial<FilterState>) =>
    onChange((prev) => ({ ...prev, ...patch }))
  const dateFromValue = toDateInputValue(value.dateFrom)
  const dateToValue = toDateInputValue(value.dateTo)

  return (
    <div
      className={`flex min-w-0 flex-wrap items-center gap-3 ${className ?? ''}`}
    >
      {/* 상태 */}
      <select
        value={value.status}
        onChange={(e) =>
          set({ status: e.target.value as FilterState['status'] })
        }
        className="h-10 shrink-0 rounded-xl border border-gray-200 bg-white px-3 text-sm"
      >
        <option value="all">전체</option>
        <option value="pending">검수대기</option>
        <option value="approved">승인</option>
        <option value="rejected">반려</option>
      </select>

      {/* 등록 기간 */}
      <div className="inline-flex min-h-10 min-w-0 flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1 text-sm">
        <span className="shrink-0 text-gray-500">등록 기간</span>
        <input
          type="date"
          value={dateFromValue}
          max={dateToValue || undefined}
          onChange={(e) => set({ dateFrom: e.target.value || null })}
          className="min-w-[8.5rem] flex-1 bg-transparent outline-none"
        />
        <span className="shrink-0 select-none text-gray-300">~</span>
        <input
          type="date"
          value={dateToValue}
          min={dateFromValue || undefined}
          onChange={(e) => set({ dateTo: e.target.value || null })}
          className="min-w-[8.5rem] flex-1 bg-transparent outline-none"
        />
      </div>

      {/* 검색 */}
      <input
        placeholder="검색(현장명 또는 담당자로 검색)"
        value={value.q}
        onChange={(e) => set({ q: e.target.value })}
        className="h-10 min-w-[220px] max-w-[320px] flex-1 rounded-xl border border-gray-200 bg-white px-4 text-sm"
      />
    </div>
  )
}

function toDateInputValue(value: FilterDate) {
  if (!value) {
    return ''
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? '' : value.toISOString().slice(0, 10)
  }

  return value
}
