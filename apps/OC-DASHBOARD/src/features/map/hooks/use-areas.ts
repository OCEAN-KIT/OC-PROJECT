import { useQuery } from "@tanstack/react-query";
import { getAreas } from "@ocean-kit/dashboard-domain/api/areas";
import type { RestorationRegion } from "@ocean-kit/dashboard-domain/types/areas";

export function useAreas(region: RestorationRegion | null) {
  return useQuery({
    queryKey: ["areas", region],
    queryFn: () => getAreas({ region: region! }),
    select: (res) => res.data.content,
    enabled: !!region,
    staleTime: 5 * 60 * 1000,
  });
}
