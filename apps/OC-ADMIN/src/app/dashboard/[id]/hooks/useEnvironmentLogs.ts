import { useQuery } from "@tanstack/react-query";
import { getEnvironmentLogs } from "@ocean-kit/dashboard-domain/api/areaEnvironmentLogs";
import type { EnvironmentCondition } from "@ocean-kit/dashboard-domain/types/areaLogPayloads";
import { queryKeys } from "@/hooks/queryKeys";
import type { EnvironmentLogEntry } from "../components/environment-log";

export default function useEnvironmentLogs(areaId: number) {
  return useQuery({
    queryKey: queryKeys.areas.environmentLogs(areaId),
    queryFn: () => getEnvironmentLogs(areaId),
    retry: false,
    select: (res): EnvironmentLogEntry[] =>
      res.data.content.map((item) => ({
        id: item.id,
        recordDate: item.recordDate,
        temperature: item.temperature,
        visibility: item.visibility as EnvironmentCondition,
        current: item.current as EnvironmentCondition,
        surge: item.surge as EnvironmentCondition,
        wave: item.wave as EnvironmentCondition,
      })),
  });
}
