// 작업영역 이식 로그 조회/생성/수정/삭제 API.
// 작업영역별 이식 로그 목록과 개별 로그 변경 요청을 담당한다.

import axiosInstance from "@ocean-kit/shared-axios/axiosInstance";
import type { ApiResponse } from "@ocean-kit/shared-types/api";
import type { TransplantLogPayload } from "../types/areaLogPayloads";
import type { TransplantLogsResponse } from "../types/areaLogResponses";

export async function getTransplantLogs(
  areaId: number,
): Promise<TransplantLogsResponse> {
  const res = await axiosInstance.get<TransplantLogsResponse>(
    `/api/dashboard/areas/${areaId}/transplants`,
  );

  return res.data;
}

export async function postTransplantLog(
  areaId: number,
  payload: TransplantLogPayload,
): Promise<ApiResponse<{ id: number }>> {
  const res = await axiosInstance.post<ApiResponse<{ id: number }>>(
    `/api/dashboard/areas/${areaId}/transplants`,
    payload,
  );

  return res.data;
}

export async function patchTransplantLog(
  areaId: number,
  logId: number,
  payload: TransplantLogPayload,
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.patch<ApiResponse<null>>(
    `/api/dashboard/areas/${areaId}/transplants/${logId}`,
    payload,
  );

  return res.data;
}

export async function deleteTransplantLog(
  areaId: number,
  logId: number,
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.delete<ApiResponse<null>>(
    `/api/dashboard/areas/${areaId}/transplants/${logId}`,
  );

  return res.data;
}
