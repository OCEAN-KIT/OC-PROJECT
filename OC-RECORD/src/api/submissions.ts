// api/submissions.ts
import axiosInstance from "@/utils/axiosInstance";
import type {
  OcRecordForm,
  WorkType,
  Rating3,
  TransplantType,
  TransplantPlace,
  TransplantSystem,
  GrazingTarget,
  GrazingDensity,
  GrazingScope,
  SubstrateTarget,
  TerrainType,
  WhiteningLevel,
  GrazerDistribution,
  RockCharacteristic,
  TransplantSuitability,
  AlgaeCondition,
  CleanupType,
  LiftingMethod,
  UncollectedWasteScale,
} from "@/types/form";

// ============ ENUM 타입 정의 ============
export type ActivityType =
  | "TRANSPLANT"
  | "GRAZER_REMOVAL"
  | "SUBSTRATE_IMPROVEMENT"
  | "MONITORING"
  | "MARINE_CLEANUP"
  | "OTHER";

export type EnvStatus = "BAD" | "NORMAL" | "GOOD";

export type HealthGrade = "A" | "B" | "C" | "D";

// ============ 생성 요청 타입 ============
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

  attachments: Array<{
    fileName: string;
    fileUrl: string;
    presignedUrl?: string;
    mimeType: string;
    fileSize: number;
  }>;
}

export interface SubmissionCreateResponse {
  success: boolean;
  data?: { submissionId: number };
  code?: string;
  message?: string | Record<string, unknown>;
}

/** 서버가 주는 목록 아이템 원형 */
export interface SubmissionListItemServer {
  submissionId: number;
  siteName: string;
  activityType: ActivityType;
  submittedAt: string; // ISO
  status: "PENDING" | "APPROVED" | "REJECTED" | string;
  authorName: string;
  authorEmail: string;
  attachmentCount: number;
}

/** 프런트에서 쓰기 쉬운 목록 아이템 */
export interface Submission {
  id: number;
  siteName: string;
  activityType: SubmissionListItemServer["activityType"];
  submittedAt: string; // ISO string
  status: SubmissionListItemServer["status"];
  authorName: string;
  authorEmail: string;
  attachmentCount: number;
}

/** 페이지네이션 메타 */
export interface PageMeta {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

/** 목록 응답 래퍼 */
export interface SubmissionListResponse {
  success: boolean;
  data: {
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
  code?: string;
  message?: string | Record<string, unknown>;
}

/** 생성 */
export async function createSubmission(
  payload: SubmissionCreateRequest,
): Promise<SubmissionCreateResponse> {
  try {
    const { data } = await axiosInstance.post<SubmissionCreateResponse>(
      "/api/admin/submissions",
      payload,
    );
    return data;
  } catch (err) {
    // 상위에서 처리할 수 있도록 그대로 throw
    throw err;
  }
}

/** 목록 조회 */
export async function fetchSubmissions(params?: {
  page?: number;
  size?: number;
  status?: string; // 선택: 서버가 지원하면 상태 필터
  keyword?: string; // 선택: 검색어
}) {
  const { page = 0, size = 20, status, keyword } = params ?? {};

  const { data } = await axiosInstance.get<SubmissionListResponse>(
    "/api/admin/submissions",
    {
      params: {
        page,
        size,
        status,
        keyword,
      },
    },
  );

  // 401/403 등은 axiosInstance 인터셉터에서 처리되거나 여기서 throw
  if (!data?.success) {
    const msg =
      typeof data?.message === "string"
        ? data.message
        : "목록 조회 실패 (success=false)";
    throw new Error(msg);
  }

  const content: Submission[] =
    data.data.content?.map((it) => ({
      id: it.submissionId,
      siteName: it.siteName,
      activityType: it.activityType,
      submittedAt: it.submittedAt,
      status: it.status,
      authorName: it.authorName,
      authorEmail: it.authorEmail,
      attachmentCount: it.attachmentCount,
    })) ?? [];

  const meta: PageMeta = {
    page: data.data.page,
    size: data.data.size,
    totalPages: data.data.totalPages,
    totalElements: data.data.totalElements,
    first: data.data.first,
    last: data.data.last,
    hasNext: data.data.hasNext,
    hasPrevious: data.data.hasPrevious,
  };

  return { items: content, meta };
}

// ============ Form → Payload 변환 ============

/** WorkType(한글) → ActivityType(영문) 매핑 */
const WORK_TYPE_MAP: Record<WorkType, ActivityType> = {
  이식: "TRANSPLANT",
  "조식동물 작업": "GRAZER_REMOVAL",
  "부착기질 개선": "SUBSTRATE_IMPROVEMENT",
  모니터링: "MONITORING",
  해양정화: "MARINE_CLEANUP",
  기타: "OTHER",
};

/** Rating3(한글) → EnvStatus(영문) 매핑 */
const RATING_MAP: Record<Rating3, EnvStatus> = {
  나쁨: "BAD",
  보통: "NORMAL",
  좋음: "GOOD",
};

// ============ 이식 ENUM 변환 ============
const SPECIES_TYPE_MAP: Record<TransplantType, string> = {
  감태: "KAMTAE",
  다시마: "DASIMA",
  곰피: "GOMPI",
  모자반: "MOJABAN",
  대황: "DAEHWANG",
  기타: "OTHER",
};

const LOCATION_TYPE_MAP: Record<TransplantPlace, string> = {
  어초: "REEF",
  암반: "ROCK",
  기타: "OTHER",
};

const METHOD_TYPE_MAP: Record<TransplantSystem, string> = {
  "로프 연승": "ROPE_LINE",
  "종자 직접 이식": "SEED_DIRECT",
  "이식용 모듈": "MODULE",
  기타: "OTHER",
};

// ============ 조식동물 ENUM 변환 ============
const TARGET_SPECIES_MAP: Record<GrazingTarget, string> = {
  성게: "URCHIN",
  소라: "SNAIL",
  전복: "ABALONE",
  불가사리: "STARFISH",
  기타: "OTHER",
};

const DENSITY_MAP: Record<GrazingDensity, string> = {
  적음: "LOW",
  보통: "MID",
  많음: "HIGH",
};

const GRAZING_SCOPE_MAP: Record<GrazingScope, string> = {
  국소: "LOCAL",
  구역: "ZONE",
  광범위: "WIDE",
};

// ============ 부착기질 ENUM 변환 ============
const SUBSTRATE_TARGET_MAP: Record<SubstrateTarget, string> = {
  암반: "ROCK",
  어초: "REEF",
  구조물: "STRUCTURE",
  기타: "OTHER",
};

// ============ 모니터링 ENUM 변환 ============
const TERRAIN_MAP: Record<TerrainType, string> = {
  암반: "ROCK",
  모래: "SAND",
  혼합: "MIXED",
  기타: "OTHER",
};

const BARREN_EXTENT_MAP: Record<WhiteningLevel, string> = {
  없음: "NONE",
  진행: "ONGOING",
  심각: "SEVERE",
};

const GRAZER_DISTRIBUTION_MAP: Record<GrazerDistribution, string> = {
  낮음: "LOW",
  중간: "MID",
  높음: "HIGH",
};

const ROCK_FEATURES_MAP: Record<RockCharacteristic, string> = {
  매끈: "SMOOTH",
  균열: "CRACKED",
  "석회조류 우점": "CALCAREOUS_ALGAE",
  혼합: "MIXED",
  "해조류 식생": "SEAWEED_VEGETATION",
};

const SUITABILITY_MAP: Record<TransplantSuitability, string> = {
  적합: "SUITABLE",
  부적합: "UNSUITABLE",
};

const SEAWEED_HEALTH_MAP: Record<AlgaeCondition, string> = {
  양호: "GOOD",
  쇠약: "WEAK",
  탈락: "DROPPED",
};

// ============ 해양정화 ENUM 변환 ============
const WASTE_TYPE_MAP: Record<CleanupType, string> = {
  그물: "NET",
  통발: "TRAP",
  "기타 어구": "OTHER_GEAR",
  낚시도구: "FISHING_TOOL",
  플라스틱: "PLASTIC",
  기타: "OTHER",
};

const CLEANUP_METHOD_MAP: Record<LiftingMethod, string> = {
  수작업: "HAND",
  인양백: "BAG",
  크레인: "CRANE",
};

const UNCOLLECTED_SCALE_MAP: Record<UncollectedWasteScale, string> = {
  소: "SMALL",
  중: "MEDIUM",
  대: "LARGE",
};

export interface FormToPayloadParams {
  form: OcRecordForm;
  details: string;
  attachments: Array<{
    fileName: string;
    fileUrl: string;
    mimeType: string;
    fileSize: number;
  }>;
}

/** OcRecordForm → SubmissionCreateRequest 변환 함수 */
export function formToPayload({
  form,
  details,
  attachments,
}: FormToPayloadParams): SubmissionCreateRequest {
  const activityType = WORK_TYPE_MAP[form.basic.workType];

  const payload: SubmissionCreateRequest = {
    siteName: form.basic.siteName,
    siteNameOptionId: null,
    recordDate: form.basic.date,
    divingRound: form.basic.diveRound,
    activityType,

    workDescription: details,

    basicEnv: {
      recordDate: form.basic.date,
      avgDepthM: parseFloat(form.env.avgDepthM) || 0,
      maxDepthM: parseFloat(form.env.maxDepthM) || 0,
      waterTempC: parseFloat(form.env.waterTempC) || 0,
      visibilityStatus: RATING_MAP[form.env.visibilityStatus],
      waveStatus: RATING_MAP[form.env.waveStatus],
      surgeStatus: RATING_MAP[form.env.surgeStatus],
      currentStatus: RATING_MAP[form.env.currentStatus],
    },

    participants: {
      participantNames: form.basic.workers,
    },

    attachments: attachments.map((att) => ({
      fileName: att.fileName,
      fileUrl: att.fileUrl,
      mimeType: att.mimeType,
      fileSize: att.fileSize,
    })),
  };

  // 활동 유형에 따라 해당 섹션만 추가
  switch (form.basic.workType) {
    case "이식":
      payload.transplantActivity = {
        speciesType: SPECIES_TYPE_MAP[form.transplant.speciesType],
        locationType: LOCATION_TYPE_MAP[form.transplant.locationType],
        methodType: METHOD_TYPE_MAP[form.transplant.methodType],
        scale: form.transplant.scale,
        healthStatus: form.transplant.healthStatus,
      };
      break;

    case "조식동물 작업":
      payload.grazerRemovalActivity = {
        targetSpecies: form.grazing.targetSpecies.map(
          (t) => TARGET_SPECIES_MAP[t],
        ),
        densityBeforeWork: DENSITY_MAP[form.grazing.densityBeforeWork],
        workScope: GRAZING_SCOPE_MAP[form.grazing.workScope],
        note: form.grazing.note,
        collectionAmount: form.grazing.collectionAmount,
      };
      break;

    case "부착기질 개선":
      payload.substrateImprovementActivity = {
        targetType: SUBSTRATE_TARGET_MAP[form.substrate.targetType],
        workScope: form.substrate.workScope,
        substrateState: form.substrate.substrateState,
      };
      break;

    case "모니터링":
      payload.monitoringActivity = {
        entryCoordinate: form.monitoring.entryCoordinate,
        exitCoordinate: form.monitoring.exitCoordinate,
        direction: form.monitoring.direction,
        terrain: TERRAIN_MAP[form.monitoring.terrain],
        barrenExtent: BARREN_EXTENT_MAP[form.monitoring.barrenExtent],
        grazerDistribution:
          GRAZER_DISTRIBUTION_MAP[form.monitoring.grazerDistribution],
        rockFeatures: form.monitoring.rockFeatures.map(
          (r) => ROCK_FEATURES_MAP[r],
        ),
        suitability: SUITABILITY_MAP[form.monitoring.suitability],
        seaweedIdNumber: form.monitoring.seaweedIdNumber,
        seaweedHealthStatus:
          SEAWEED_HEALTH_MAP[form.monitoring.seaweedHealthStatus],
        leafLength: form.monitoring.leafLength,
        maxLeafWidth: form.monitoring.maxLeafWidth,
      };
      break;

    case "해양정화":
      payload.marineCleanupActivity = {
        wasteTypes: form.cleanup.wasteTypes.map((w) => WASTE_TYPE_MAP[w]),
        method: CLEANUP_METHOD_MAP[form.cleanup.method],
        collectionAmount: form.cleanup.collectionAmount,
        uncollectedScale: UNCOLLECTED_SCALE_MAP[form.cleanup.uncollectedScale],
      };
      break;
  }

  return payload;
}
