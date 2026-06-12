import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteArea, getAreas } from '@ocean-kit/dashboard-domain/api/areas'
import type {
  AreaAttachmentStatus,
  AreaSummary,
  HabitatType,
  ProjectLevel,
  RestorationRegion,
} from '@ocean-kit/dashboard-domain/types/areas'
import type { AreaFilters } from '../types'
import { queryKeys } from '../../queryKeys'
import type { AreaItem } from '../components/area-list/constants'
import {
  toAttachmentStatusCode,
  toDateString,
  toHabitatCode,
  toLevelCode,
  toRegionCode,
} from '../../utils/mappers'

type AreaListItemResponse = Omit<
  AreaSummary,
  | 'attachmentStatus'
  | 'depth'
  | 'endDate'
  | 'habitat'
  | 'level'
  | 'restorationRegion'
  | 'startDate'
> & {
  attachmentStatus?: string
  avgDepth?: number
  depth?: number
  currentStatus?: {
    name?: string
  }
  endDate?: unknown
  habitat?: string
  habitatType?: string
  level?: string
  restorationRegion?: string
  startDate?: unknown
}

function toAreaItem(item: AreaSummary): AreaItem {
  const raw = item as unknown as AreaListItemResponse

  return {
    id: raw.id,
    name: raw.name,
    restorationRegion: toRegionCode(
      raw.restorationRegion ?? '',
    ) as RestorationRegion,
    startDate: toDateString(raw.startDate),
    endDate: toDateString(raw.endDate) || null,
    habitat: toHabitatCode(raw.habitat ?? raw.habitatType ?? '') as HabitatType,
    depth: raw.depth ?? raw.avgDepth ?? 0,
    areaSize: raw.areaSize,
    level: toLevelCode(
      raw.level ?? raw.currentStatus?.name ?? '',
    ) as ProjectLevel,
    attachmentStatus: toAttachmentStatusCode(
      raw.attachmentStatus ?? '',
    ) as AreaAttachmentStatus,
    lat: raw.lat,
    lon: raw.lon,
  }
}

export function useGetAreas(page: number, filters: AreaFilters) {
  return useQuery({
    queryKey: queryKeys.areas.list(page, filters),
    queryFn: () =>
      getAreas({
        page,
        ...(filters.region && { region: filters.region }),
        ...(filters.level && { level: filters.level }),
        ...(filters.habitat && { habitat: filters.habitat }),
        ...(filters.from && { from: filters.from }),
        ...(filters.to && { to: filters.to }),
        ...(filters.keyword && { keyword: filters.keyword }),
      }),
    staleTime: 1000 * 60,
    select: (response) => ({
      ...response,
      data: {
        ...response.data,
        content: response.data.content.map(toAreaItem),
      },
    }),
  })
}

export function useDeleteArea() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['areas', 'delete'],
    mutationFn: (areaId: number) => deleteArea(areaId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.areas.all })
    },
  })
}
