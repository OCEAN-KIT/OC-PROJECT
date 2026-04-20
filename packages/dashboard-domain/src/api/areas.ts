import axiosInstance from "@ocean-kit/shared-axios/axiosInstance";
import type { AreasResponse, GetAreasParams } from "../types/areas";

export async function getAreas(
  params: GetAreasParams = {},
): Promise<AreasResponse> {
  const res = await axiosInstance.get<AreasResponse>("/api/dashboard/areas", {
    params,
  });

  return res.data;
}
