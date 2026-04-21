// 작업영역 로그 조회 API에서 공통으로 사용하는 응답 타입.
// 이식/성장/환경/미디어 로그 목록과 대표 종 조회 응답을 여기서 정의한다.

import type { ApiResponse } from "@ocean-kit/shared-types/api";

export type PagedData<T> = {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type TransplantLogItem = {
  id: number;
  recordDate: string;
  method: string;
  methodName: string;
  methodDesc: string;
  unit: string;
  speciesId: number;
  speciesName: string;
  count: number;
  areaSize: number;
  attachmentStatus: string;
  attachmentStatusName: string;
};

export type TransplantLogsResponse = ApiResponse<PagedData<TransplantLogItem>>;

export type GrowthLogItem = {
  id: number;
  recordDate: string;
  speciesId: number;
  speciesName: string;
  growthLength: number;
  status: string;
  statusName: string;
};

export type GrowthLogsResponse = ApiResponse<PagedData<GrowthLogItem>>;

export type RepresentativeSpeciesData = {
  speciesId: number | null;
  speciesName: string | null;
};

export type RepresentativeSpeciesResponse =
  ApiResponse<RepresentativeSpeciesData>;

export type EnvironmentLogItem = {
  id: number;
  recordDate: string;
  temperature: number;
  visibility: string;
  visibilityName: string;
  current: string;
  currentName: string;
  surge: string;
  surgeName: string;
  wave: string;
  waveName: string;
};

export type EnvironmentLogsResponse = ApiResponse<
  PagedData<EnvironmentLogItem>
>;

export type MediaLogItem = {
  id: number;
  recordDate: string;
  mediaUrl: string;
  caption: string;
  category: string;
  categoryName: string;
};

export type MediaLogsResponse = ApiResponse<PagedData<MediaLogItem>>;
