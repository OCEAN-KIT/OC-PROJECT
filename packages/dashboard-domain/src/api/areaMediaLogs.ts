// 작업영역 미디어 로그 조회/생성/수정/삭제 API.
// 비포/애프터/타임라인 이미지 로그 목록과 개별 변경 요청을 담당한다.

import axiosInstance from "@ocean-kit/shared-axios/axiosInstance";
import type { ApiResponse } from "@ocean-kit/shared-types/api";
import type { MediaLogPayload } from "../types/areaLogPayloads";
import type { MediaLogsResponse } from "../types/areaLogResponses";

type PatchMediaLogPayload = Omit<MediaLogPayload, "mediaUrl"> & {
  mediaUrl?: string;
};

export async function getMediaLogs(areaId: number): Promise<MediaLogsResponse> {
  const res = await axiosInstance.get<MediaLogsResponse>(
    `/api/dashboard/areas/${areaId}/media-logs`,
  );

  return res.data;
}

export async function postMediaLog(
  areaId: number,
  payload: MediaLogPayload,
): Promise<ApiResponse<{ id: number }>> {
  const res = await axiosInstance.post<ApiResponse<{ id: number }>>(
    `/api/dashboard/areas/${areaId}/media-logs`,
    payload,
  );

  return res.data;
}

export async function patchMediaLog(
  areaId: number,
  logId: number,
  payload: PatchMediaLogPayload,
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.patch<ApiResponse<null>>(
    `/api/dashboard/areas/${areaId}/media-logs/${logId}`,
    payload,
  );

  return res.data;
}

export async function deleteMediaLog(
  areaId: number,
  logId: number,
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.delete<ApiResponse<null>>(
    `/api/dashboard/areas/${areaId}/media-logs/${logId}`,
  );

  return res.data;
}
