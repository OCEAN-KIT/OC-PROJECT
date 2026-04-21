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
