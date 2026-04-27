// 활동 제출 생성 API에서 사용하는 서버 계약 타입.
// 제출 요청/응답과 서버 enum을 한곳에서 관리한다.

import type { ApiResponse } from "@ocean-kit/shared-types/api";

export type ActivityType =
  | "TRANSPLANT"
  | "GRAZER_REMOVAL"
  | "SUBSTRATE_IMPROVEMENT"
  | "MONITORING"
  | "MARINE_CLEANUP"
  | "OTHER";

export type EnvStatus = "BAD" | "NORMAL" | "GOOD";

export type HealthGrade = "A" | "B" | "C" | "D";

export type SubmissionAttachment = {
  fileName: string;
  fileUrl: string;
  presignedUrl?: string;
  mimeType: string;
  fileSize: number;
};

export interface SubmissionCreateRequest {
  siteName: string;
  siteNameOptionId?: number | null;
  recordDate: string; // "YYYY-MM-DD"
  divingRound: number;
  activityType: ActivityType;
  workDescription: string;

  basicEnv: {
    recordDate: string; // "YYYY-MM-DD"
    avgDepthM: number;
    maxDepthM: number;
    waterTempC: number;
    visibilityStatus: EnvStatus;
    waveStatus: EnvStatus;
    surgeStatus: EnvStatus;
    currentStatus: EnvStatus;
  };

  participants: {
    participantNames: string;
  };

  // 활동 유형별 상세 정보 (해당하는 것만 전송)
  transplantActivity?: {
    speciesType: string;
    locationType: string;
    methodType: string;
    scale: string;
    healthStatus: HealthGrade;
  };

  grazerRemovalActivity?: {
    targetSpecies: string[];
    densityBeforeWork: string;
    workScope: string;
    note: string;
    collectionAmount: string;
  };

  substrateImprovementActivity?: {
    targetType: string;
    workScope: string;
    substrateState: string;
  };

  monitoringActivity?: {
    entryCoordinate: string;
    exitCoordinate: string;
    direction: string;
    terrain: string;
    barrenExtent: string;
    grazerDistribution: string;
    rockFeatures: string[];
    suitability: string;
    seaweedIdNumber: string;
    seaweedHealthStatus: string;
    leafLength: string;
    maxLeafWidth: string;
  };

  marineCleanupActivity?: {
    wasteTypes: string[];
    method: string;
    collectionAmount: string;
    uncollectedScale: string;
  };

  attachments: SubmissionAttachment[];
}

export type SubmissionCreateResponse = ApiResponse<{
  submissionId: number;
} | null>;

export type GetSubmissionListParams = {
  page?: number;
  size?: number;
  status?: string;
  keyword?: string;
  activityType?: ActivityType | string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortDir?: string;
};

export interface SubmissionListItemServer {
  submissionId: number;
  siteName: string;
  activityType: ActivityType;
  submittedAt: string;
  status: string;
  authorName: string;
  authorEmail: string;
  attachmentCount: number;
}

export type SubmissionListData = {
  content: SubmissionListItemServer[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type SubmissionListResponse = ApiResponse<SubmissionListData>;

export type SubmissionDetailServer = {
  submissionId: number;
  siteName: string;
  activityType: ActivityType;
  recordDate?: string;
  divingRound?: number;
  workDescription?: string;
  submittedAt: number[];
  status: "PENDING" | "APPROVED" | "REJECTED" | "DELETED";
  authorName: string;
  authorEmail: string;
  attachmentCount: number;
  feedbackText?: string;
  basicEnv?: {
    recordDate?: string;
    avgDepthM?: number;
    maxDepthM?: number;
    waterTempC?: number;
    visibilityStatus?: EnvStatus;
    waveStatus?: EnvStatus;
    surgeStatus?: EnvStatus;
    currentStatus?: EnvStatus;
  };
  participants?: {
    participantNames?: string;
  };
  transplantActivity?: {
    speciesType?: string;
    locationType?: string;
    methodType?: string;
    scale?: string;
    healthStatus?: HealthGrade;
  };
  grazerRemovalActivity?: {
    targetSpecies?: string[];
    densityBeforeWork?: string;
    workScope?: string;
    note?: string;
    collectionAmount?: string;
  };
  substrateImprovementActivity?: {
    targetType?: string;
    workScope?: string;
    substrateState?: string;
  };
  monitoringActivity?: {
    entryCoordinate?: string;
    exitCoordinate?: string;
    direction?: string;
    terrain?: string;
    barrenExtent?: string;
    grazerDistribution?: string;
    rockFeatures?: string[];
    suitability?: string;
    seaweedIdNumber?: string;
    seaweedHealthStatus?: string;
    leafLength?: string;
    maxLeafWidth?: string;
  };
  marineCleanupActivity?: {
    wasteTypes?: string[];
    method?: string;
    collectionAmount?: string;
    uncollectedScale?: string;
  };
  attachments?: Array<{
    attachmentId: number;
    fileName: string;
    fileUrl: string;
    mimeType: string;
    fileSize: number;
    uploadedAt: string;
  }>;
  rejectReason?: string;
  auditLogs?: Array<{
    logId: number;
    action: string;
    performedBy: string;
    comment?: string;
    createdAt: string;
  }>;
  createdAt: string;
  modifiedAt: string;
};

export type SubmissionDetailResponse = ApiResponse<SubmissionDetailServer>;
