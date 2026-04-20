import type { ApiResponse } from "@ocean-kit/shared-types/api";

export type RestorationRegion = "POHANG" | "ULJIN";

export type HabitatType = "ROCKY" | "MIXED" | "OTHER";

export type ProjectLevel =
  | "OBSERVATION"
  | "SETTLEMENT"
  | "GROWTH"
  | "MANAGEMENT";

export type AreaAttachmentStatus = "STABLE" | "DECREASED" | "UNSTABLE";

export type GetAreasParams = {
  page?: number;
  region?: RestorationRegion;
  level?: ProjectLevel;
  habitat?: HabitatType;
  from?: string;
  to?: string;
  keyword?: string;
};

export type AreaSummary = {
  id: number;
  name: string;
  restorationRegion: RestorationRegion;
  startDate: string;
  endDate: string;
  habitat: HabitatType;
  depth: number;
  areaSize: number;
  level: ProjectLevel;
  attachmentStatus: AreaAttachmentStatus;
  lat: number;
  lon: number;
};

export type PagedAreaData = {
  content: AreaSummary[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type AreasResponse = ApiResponse<PagedAreaData>;
