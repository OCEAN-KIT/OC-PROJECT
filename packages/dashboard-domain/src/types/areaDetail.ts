import type { ApiResponse } from "@ocean-kit/shared-types/api";

export type ChartData = {
  labels: number[][];
  values: number[];
  unit: string;
  targetSpecies: string;
  targetSpeciesId: number;
  period: string;
};

export type AreaOverview = {
  name: string;
  areaId: number;
  restorationRegion: string;
  startDate: number[];
  endDate: number[] | null;
  currentStatus: {
    name: string;
    description: string;
  };
  areaSize: number;
  avgDepth: number;
  habitatType: string;
  lat: number;
  lon: number;
  attachmentStatus: string;
};

export type AreaSpeciesStatusItem = {
  speciesName: string;
  method: string;
  methodDesc: string;
  quantity: number;
  unit: string;
};

export type AreaAccumulatedStatus = {
  totalAreaSize: number;
  totalWorkCount: number;
  lastWorkDate: number[] | null;
};

export type AreaStatusSection = {
  speciesList: AreaSpeciesStatusItem[];
  methodDistribution: Record<string, number>;
  accumulated: AreaAccumulatedStatus;
  workHistoryChart: ChartData;
};

export type AreaDetailAttachmentStatus = {
  method: string;
  status: string;
};

export type AreaEcologySection = {
  attachmentStatuses: AreaDetailAttachmentStatus[];
  areaAttachmentStatus: string;
  representativeGrowthChart: ChartData;
};

export type AreaEnvironmentSection = {
  last3MonthsSummary: {
    visibility: string;
    current: string;
    surge: string;
    wave: string;
  };
  temperatureChart: ChartData;
};

export type AreaPhotoTimelineItem = {
  url: string;
  label: string;
  caption: string;
};

export type AreaPhotosSection = {
  beforeUrl: string;
  afterUrl: string;
  timeline: AreaPhotoTimelineItem[];
};

export type AreaDetailData = {
  id: number;
  overview: AreaOverview;
  status: AreaStatusSection;
  ecology: AreaEcologySection;
  environment: AreaEnvironmentSection;
  photos: AreaPhotosSection;
};

export type AreaDetail = AreaDetailData;

export type AreaDetailResponse = ApiResponse<AreaDetailData>;
