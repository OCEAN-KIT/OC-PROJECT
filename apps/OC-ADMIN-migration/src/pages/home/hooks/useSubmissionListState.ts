/*
 * 제출 목록 조회에 필요한 화면 상태를 관리합니다.
 * 필터, 현재 페이지, 목록 query, 페이지 이동 props를 한곳에 묶어
 * HomePage controller가 목록 조회의 세부 상태를 직접 들고 있지 않게 합니다.
 */
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useCallback, useEffect } from 'react'
import type { SetStateAction } from 'react'
import type { ListFilters } from '../api/submissions'
import {
  getHomeFiltersFromSearch,
  getHomeSearchFromFilters,
  type HomeSearch,
} from '../homeSearch'
import { useSubmissionsQuery } from './submissions'

const PAGE_SIZE = 10

export function useSubmissionListState() {
  const search = useSearch({ from: '/home' })
  const navigate = useNavigate()
  const page = search.page
  const filters = getHomeFiltersFromSearch(search)

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
      void navigate({
        to: '/home',
        search: { ...search, page: totalPages },
        replace: true,
      })
    }
  }, [navigate, page, search, totalPages])

  const updateSearch = useCallback(
    (nextSearch: HomeSearch) => {
      void navigate({
        to: '/home',
        search: nextSearch,
        replace: true,
      })
    },
    [navigate],
  )

  const handleFiltersChange = useCallback(
    (nextFilters: SetStateAction<ListFilters>) => {
      const filtersValue =
        typeof nextFilters === 'function' ? nextFilters(filters) : nextFilters

      updateSearch(getHomeSearchFromFilters(search, filtersValue))
    },
    [filters, search, updateSearch],
  )

  const handleSearch = useCallback(() => {
    updateSearch({ ...search, page: 1 })
  }, [search, updateSearch])

  const handlePrev = useCallback(() => {
    updateSearch({ ...search, page: Math.max(1, page - 1) })
  }, [page, search, updateSearch])

  const handleNext = useCallback(() => {
    updateSearch({ ...search, page: Math.min(totalPages, page + 1) })
  }, [page, search, totalPages, updateSearch])

  const handleRetry = useCallback(() => {
    void refetch()
  }, [refetch])

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
      onFiltersChange: handleFiltersChange,
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
