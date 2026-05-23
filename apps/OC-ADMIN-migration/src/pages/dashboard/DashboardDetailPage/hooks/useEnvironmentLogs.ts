import { useQuery } from '@tanstack/react-query'
import { getEnvironmentLogs } from '@ocean-kit/dashboard-domain/api/areaEnvironmentLogs'
import type { EnvironmentCondition } from '@ocean-kit/dashboard-domain/types/areaLogPayloads'
import { queryKeys } from '../../queryKeys'
import type { EnvironmentLogEntry } from '../types/environmentLogs'

function toEnvironmentCondition(value: string): EnvironmentCondition | '' {
  switch (value) {
    case 'GOOD':
    case 'NORMAL':
    case 'POOR':
      return value
    default:
      return ''
  }
}

export default function useEnvironmentLogs(areaId: number) {
  const enabled = Number.isFinite(areaId) && areaId > 0

  return useQuery({
    queryKey: queryKeys.areas.environmentLogs(areaId),
    queryFn: () => getEnvironmentLogs(areaId),
    enabled,
    retry: false,
    select: (res): EnvironmentLogEntry[] =>
      res.data.content.map((item) => ({
        id: item.id,
        recordDate: item.recordDate,
        temperature: item.temperature,
        visibility: toEnvironmentCondition(item.visibility),
        current: toEnvironmentCondition(item.current),
        surge: toEnvironmentCondition(item.surge),
        wave: toEnvironmentCondition(item.wave),
      })),
  })
}
