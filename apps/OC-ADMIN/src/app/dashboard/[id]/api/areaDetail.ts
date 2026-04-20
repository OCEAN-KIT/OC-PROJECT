import axiosInstance from "@ocean-kit/shared-axios/axiosInstance";
import type { BasicPayload, ApiResponse } from "../../create/api/types";

export async function patchBasicInfo(
  id: number,
  payload: BasicPayload,
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.patch<ApiResponse<null>>(
    `/api/dashboard/areas/${id}`,
    payload,
  );
  return res.data;
}
