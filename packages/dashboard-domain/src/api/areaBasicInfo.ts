// 작업영역 기본 정보 생성/수정 API.
// postBasicInfo는 작업영역 생성, patchBasicInfo는 작업영역 기본 정보 수정을 담당한다.

import axiosInstance from "@ocean-kit/shared-axios/axiosInstance";
import type { ApiResponse } from "@ocean-kit/shared-types/api";
import type { BasicPayload } from "../types/areaBasicInfo";

export async function postBasicInfo(
  payload: BasicPayload,
): Promise<ApiResponse<{ id: number }>> {
  const res = await axiosInstance.post<ApiResponse<{ id: number }>>(
    "/api/dashboard/areas",
    payload,
  );

  return res.data;
}

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
