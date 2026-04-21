// 작업영역 성장 로그와 대표 종 조회/수정 API.
// 성장 로그 목록과 대표 종 설정 관련 요청을 함께 담당한다.

import axiosInstance from "@ocean-kit/shared-axios/axiosInstance";
import type { ApiResponse } from "@ocean-kit/shared-types/api";
import type { GrowthLogPayload } from "../types/areaLogPayloads";
import type {
  GrowthLogsResponse,
  RepresentativeSpeciesResponse,
} from "../types/areaLogResponses";

export async function getRepresentativeSpecies(
  areaId: number,
): Promise<RepresentativeSpeciesResponse> {
  const res = await axiosInstance.get<RepresentativeSpeciesResponse>(
    `/api/dashboard/areas/${areaId}/representative-species`,
  );

  return res.data;
}

export async function getGrowthLogs(
  areaId: number,
): Promise<GrowthLogsResponse> {
  const res = await axiosInstance.get<GrowthLogsResponse>(
    `/api/dashboard/areas/${areaId}/growth-logs`,
  );

  return res.data;
}

export async function postGrowthLog(
  areaId: number,
  payload: GrowthLogPayload,
): Promise<ApiResponse<{ id: number }>> {
  const res = await axiosInstance.post<ApiResponse<{ id: number }>>(
    `/api/dashboard/areas/${areaId}/growth-logs`,
    payload,
  );

  return res.data;
}

export async function patchGrowthLog(
  areaId: number,
  logId: number,
  payload: GrowthLogPayload,
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.patch<ApiResponse<null>>(
    `/api/dashboard/areas/${areaId}/growth-logs/${logId}`,
    payload,
  );

  return res.data;
}

export async function deleteGrowthLog(
  areaId: number,
  logId: number,
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.delete<ApiResponse<null>>(
    `/api/dashboard/areas/${areaId}/growth-logs/${logId}`,
  );

  return res.data;
}

export async function patchRepresentativeSpecies(
  areaId: number,
  speciesId: number | null,
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.patch<ApiResponse<null>>(
    `/api/dashboard/areas/${areaId}/representative-species`,
    { speciesId },
  );

  return res.data;
}
