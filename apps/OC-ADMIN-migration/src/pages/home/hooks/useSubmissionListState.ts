/*
 * 제출 목록 조회에 필요한 화면 상태를 관리합니다.
 * 필터, 현재 페이지, 목록 query, 페이지 이동 props를 한곳에 묶어
 * HomePage controller가 목록 조회의 세부 상태를 직접 들고 있지 않게 합니다.
 */
import { useEffect, useState } from 'react'
import type { ListFilters } from '../api/submissions'
import { useSubmissionsQuery } from './submissions'

const PAGE_SIZE = 10

const initialFilters: ListFilters = {
  status: 'all',
  q: '',
  dateFrom: null,
  dateTo: null,
}

export function useSubmissionListState() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<ListFilters>(initialFilters)

  const { data, isFetching, isError, refetch } = useSubmissionsQuery(
    page,
    PAGE_SIZE,
    filters,
  )
  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const handleSearch = () => setPage(1)
  const handlePrev = () => setPage((currentPage) => Math.max(1, currentPage - 1))
  const handleNext = () =>
    setPage((currentPage) => Math.min(totalPages, currentPage + 1))
  const handleRetry = () => {
    void refetch()
  }

  return {
    items,
    listSectionProps: {
      isFetching,
      isError,
      errorMessage: '제출 목록을 불러오지 못했습니다.',
      onRetry: handleRetry,
    },
    toolbarProps: {
      filters,
      onFiltersChange: setFilters,
      onSearch: handleSearch,
      isFetching,
    },
    paginationProps: {
      page,
      totalPages,
      onPrev: handlePrev,
      onNext: handleNext,
    },
  }
}
