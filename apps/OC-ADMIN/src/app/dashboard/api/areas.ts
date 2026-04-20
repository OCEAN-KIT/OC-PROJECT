import axiosInstance from "@ocean-kit/shared-axios/axiosInstance";
import { getAreas as getSharedAreas } from "@ocean-kit/dashboard-domain/api/areas";
import type { AreaFilters, AreasResponse } from "./types";

export async function getAreas(
  page: number,
  filters: AreaFilters,
): Promise<AreasResponse> {
  return getSharedAreas({
    page,
    ...(filters.region && { region: filters.region }),
    ...(filters.level && { level: filters.level }),
    ...(filters.habitat && { habitat: filters.habitat }),
    ...(filters.from && { from: filters.from }),
    ...(filters.to && { to: filters.to }),
    ...(filters.keyword && { keyword: filters.keyword }),
  });
}

export async function deleteArea(areaId: number): Promise<void> {
  await axiosInstance.delete(`/api/dashboard/areas/${areaId}`);
}
