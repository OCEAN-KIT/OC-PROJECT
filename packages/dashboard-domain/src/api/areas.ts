import axiosInstance from "@ocean-kit/shared-axios/axiosInstance";
import type { ApiResponse } from "@ocean-kit/shared-types/api";
import type { AreasResponse, GetAreasParams } from "../types/areas";

export async function getAreas(
  params: GetAreasParams = {},
): Promise<AreasResponse> {
  const res = await axiosInstance.get<AreasResponse>("/api/dashboard/areas", {
    params,
  });

  return res.data;
}

export async function deleteArea(areaId: number): Promise<ApiResponse<null>> {
  const res = await axiosInstance.delete<ApiResponse<null>>(
    `/api/dashboard/areas/${areaId}`,
  );

  return res.data;
}
