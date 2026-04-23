import axiosInstance from "@ocean-kit/shared-axios/axiosInstance";
import type { AreaDetailResponse } from "../types/areaDetail";

export async function getAreaDetail(id: number): Promise<AreaDetailResponse> {
  const res = await axiosInstance.get<AreaDetailResponse>(
    `/api/dashboard/areas/${id}`,
  );

  return res.data;
}
