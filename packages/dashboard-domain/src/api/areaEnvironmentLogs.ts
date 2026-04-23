// 작업영역 환경 로그 조회/생성/수정/삭제 API.
// 수온과 시야/조류/서지/파도 로그 목록과 개별 변경 요청을 담당한다.

import axiosInstance from "@ocean-kit/shared-axios/axiosInstance";
import type { ApiResponse } from "@ocean-kit/shared-types/api";
import type { EnvironmentLogPayload } from "../types/areaLogPayloads";
import type { EnvironmentLogsResponse } from "../types/areaLogResponses";

export async function getEnvironmentLogs(
  areaId: number,
): Promise<EnvironmentLogsResponse> {
  const res = await axiosInstance.get<EnvironmentLogsResponse>(
    `/api/dashboard/areas/${areaId}/water-logs`,
  );

  return res.data;
}

export async function postEnvironmentLog(
  areaId: number,
  payload: EnvironmentLogPayload,
): Promise<ApiResponse<{ id: number }>> {
  const res = await axiosInstance.post<ApiResponse<{ id: number }>>(
    `/api/dashboard/areas/${areaId}/water-logs`,
    payload,
  );

  return res.data;
}

export async function patchEnvironmentLog(
  areaId: number,
  logId: number,
  payload: EnvironmentLogPayload,
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.patch<ApiResponse<null>>(
    `/api/dashboard/areas/${areaId}/water-logs/${logId}`,
    payload,
  );

  return res.data;
}

export async function deleteEnvironmentLog(
  areaId: number,
  logId: number,
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.delete<ApiResponse<null>>(
    `/api/dashboard/areas/${areaId}/water-logs/${logId}`,
  );

  return res.data;
}
