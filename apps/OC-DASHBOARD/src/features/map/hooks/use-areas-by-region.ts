"use client";

import type { RestorationRegion } from "@ocean-kit/dashboard-domain/types/areas";
import { useAreas } from "./use-areas";
import type { AreasByRegion } from "../model/types";

export default function useAreasByRegion() {
  const pohangQuery = useAreas("POHANG");
  const uljinQuery = useAreas("ULJIN");

  const areasByRegion: AreasByRegion = {};
  const failedRegions: RestorationRegion[] = [];
  const pendingRegions: RestorationRegion[] = [];

  const queries = [
    { region: "POHANG" as const, query: pohangQuery },
    { region: "ULJIN" as const, query: uljinQuery },
  ];

  queries.forEach(({ region, query }) => {
    if (query.data) {
      areasByRegion[region] = query.data;
    }

    if (query.isPending && !query.data) {
      pendingRegions.push(region);
    }

    if (query.isError && !query.data) {
      failedRegions.push(region);
    }
  });

  return {
    areasByRegion,
    failedRegions,
    pendingRegions,
    isFetching: pohangQuery.isFetching || uljinQuery.isFetching,
  };
}
