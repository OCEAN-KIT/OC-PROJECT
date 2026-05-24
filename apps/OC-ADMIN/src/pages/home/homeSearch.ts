/*
 * /home route의 URL search params를 화면에서 쓰는 필터/page 상태로 검증합니다.
 * URL에서 온 값은 신뢰하지 않고, route 진입 시 TanStack Router validateSearch에서
 * 안전한 기본값으로 정규화한 뒤 Home 목록 query에 사용합니다.
 */
import type { ListFilters } from './api/submissions'
import type { Status } from './components/filter-bar/types'

const STATUS_VALUES = ['all', 'pending', 'approved', 'rejected'] as const
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export type HomeSearch = {
  page: number
  status: Status
  q: string
  dateFrom: string | null
  dateTo: string | null
}

export type HomeRouteSearch = {
  page?: number
  status?: Status
  q?: string
  dateFrom?: string
  dateTo?: string
}

export const DEFAULT_HOME_SEARCH: HomeSearch = {
  page: 1,
  status: 'all',
  q: '',
  dateFrom: null,
  dateTo: null,
}

export function validateHomeSearch(
  search: Record<string, unknown>,
): HomeRouteSearch {
  return getHomeRouteSearch({
    page: parsePage(search.page),
    status: parseStatus(search.status),
    q: parseText(search.q),
    dateFrom: parseDate(search.dateFrom),
    dateTo: parseDate(search.dateTo),
  })
}

export function getHomeSearchFromRouteSearch(
  search: HomeRouteSearch,
): HomeSearch {
  return {
    page: parsePage(search.page),
    status: parseStatus(search.status),
    q: parseText(search.q),
    dateFrom: parseDate(search.dateFrom),
    dateTo: parseDate(search.dateTo),
  }
}

export function getHomeRouteSearch(search: HomeSearch): HomeRouteSearch {
  const page = parsePage(search.page)
  const status = parseStatus(search.status)
  const q = parseText(search.q)
  const dateFrom = parseDate(search.dateFrom)
  const dateTo = parseDate(search.dateTo)
  const routeSearch: HomeRouteSearch = {}

  if (page !== DEFAULT_HOME_SEARCH.page) {
    routeSearch.page = page
  }

  if (status !== DEFAULT_HOME_SEARCH.status) {
    routeSearch.status = status
  }

  if (q !== DEFAULT_HOME_SEARCH.q) {
    routeSearch.q = q
  }

  if (dateFrom !== DEFAULT_HOME_SEARCH.dateFrom) {
    routeSearch.dateFrom = dateFrom
  }

  if (dateTo !== DEFAULT_HOME_SEARCH.dateTo) {
    routeSearch.dateTo = dateTo
  }

  return routeSearch
}

export function getHomeFiltersFromSearch(search: HomeSearch): ListFilters {
  return {
    status: search.status,
    q: search.q,
    dateFrom: search.dateFrom,
    dateTo: search.dateTo,
  }
}

export function getHomeSearchFromFilters(
  search: HomeSearch,
  filters: ListFilters,
): HomeSearch {
  return {
    ...search,
    status: parseStatus(filters.status),
    q: filters.q.trim(),
    dateFrom: parseDate(filters.dateFrom),
    dateTo: parseDate(filters.dateTo),
  }
}

function parsePage(value: unknown) {
  const page = Number(getSearchValue(value))

  if (!Number.isFinite(page) || page < 1) {
    return DEFAULT_HOME_SEARCH.page
  }

  return Math.floor(page)
}

function parseStatus(value: unknown): Status {
  const status = getSearchValue(value)

  if (STATUS_VALUES.includes(status as Status)) {
    return status as Status
  }

  return DEFAULT_HOME_SEARCH.status
}

function parseText(value: unknown) {
  const text = getSearchValue(value)
  return text.trim()
}

function parseDate(value: unknown) {
  const date = getSearchValue(value)

  if (!DATE_PATTERN.test(date)) {
    return null
  }

  return date
}

function getSearchValue(value: unknown) {
  if (Array.isArray(value)) {
    return getSearchValue(value[0])
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  return ''
}
