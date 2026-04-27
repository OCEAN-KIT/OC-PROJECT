// record 폼 선택값을 제출 API enum 값으로 바꿀 때 쓰는 변환표.
// 화면 라벨은 한글로 유지하고, 서버로 보낼 때만 canonical 값으로 정규화한다.

import type {
  AlgaeCondition,
  CleanupType,
  GrazingDensity,
  GrazingScope,
  GrazingTarget,
  GrazerDistribution,
  LiftingMethod,
  Rating3,
  RockCharacteristic,
  SubstrateTarget,
  TerrainType,
  TransplantPlace,
  TransplantSuitability,
  TransplantSystem,
  TransplantType,
  UncollectedWasteScale,
  WhiteningLevel,
  WorkType,
} from "../types/form";
import type { ActivityType, EnvStatus } from "../types/submission";

export const WORK_TYPE_MAP: Record<WorkType, ActivityType> = {
  이식: "TRANSPLANT",
  "조식동물 작업": "GRAZER_REMOVAL",
  "부착기질 개선": "SUBSTRATE_IMPROVEMENT",
  모니터링: "MONITORING",
  해양정화: "MARINE_CLEANUP",
  기타: "OTHER",
};

export const RATING_MAP: Record<Rating3, EnvStatus> = {
  나쁨: "BAD",
  보통: "NORMAL",
  좋음: "GOOD",
};

export const SPECIES_TYPE_MAP: Record<TransplantType, string> = {
  감태: "KAMTAE",
  다시마: "DASIMA",
  곰피: "GOMPI",
  모자반: "MOJABAN",
  대황: "DAEHWANG",
  기타: "OTHER",
};

export const LOCATION_TYPE_MAP: Record<TransplantPlace, string> = {
  어초: "REEF",
  암반: "ROCK",
  기타: "OTHER",
};

export const METHOD_TYPE_MAP: Record<TransplantSystem, string> = {
  "로프 연승": "ROPE_LINE",
  "종자 직접 이식": "SEED_DIRECT",
  "이식용 모듈": "MODULE",
  기타: "OTHER",
};

export const TARGET_SPECIES_MAP: Record<GrazingTarget, string> = {
  성게: "URCHIN",
  소라: "SNAIL",
  전복: "ABALONE",
  불가사리: "STARFISH",
  기타: "OTHER",
};

export const DENSITY_MAP: Record<GrazingDensity, string> = {
  적음: "LOW",
  보통: "MID",
  많음: "HIGH",
};

export const GRAZING_SCOPE_MAP: Record<GrazingScope, string> = {
  국소: "LOCAL",
  구역: "ZONE",
  광범위: "WIDE",
};

export const SUBSTRATE_TARGET_MAP: Record<SubstrateTarget, string> = {
  암반: "ROCK",
  어초: "REEF",
  구조물: "STRUCTURE",
  기타: "OTHER",
};

export const TERRAIN_MAP: Record<TerrainType, string> = {
  암반: "ROCK",
  모래: "SAND",
  혼합: "MIXED",
  기타: "OTHER",
};

export const BARREN_EXTENT_MAP: Record<WhiteningLevel, string> = {
  없음: "NONE",
  진행: "ONGOING",
  심각: "SEVERE",
};

export const GRAZER_DISTRIBUTION_MAP: Record<GrazerDistribution, string> = {
  낮음: "LOW",
  중간: "MID",
  높음: "HIGH",
};

export const ROCK_FEATURES_MAP: Record<RockCharacteristic, string> = {
  매끈: "SMOOTH",
  균열: "CRACKED",
  "석회조류 우점": "CALCAREOUS_ALGAE",
  혼합: "MIXED",
  "해조류 식생": "SEAWEED_VEGETATION",
};

export const SUITABILITY_MAP: Record<TransplantSuitability, string> = {
  적합: "SUITABLE",
  부적합: "UNSUITABLE",
};

export const SEAWEED_HEALTH_MAP: Record<AlgaeCondition, string> = {
  양호: "GOOD",
  쇠약: "WEAK",
  탈락: "DROPPED",
};

export const WASTE_TYPE_MAP: Record<CleanupType, string> = {
  그물: "NET",
  통발: "TRAP",
  "기타 어구": "OTHER_GEAR",
  낚시도구: "FISHING_TOOL",
  플라스틱: "PLASTIC",
  기타: "OTHER",
};

export const CLEANUP_METHOD_MAP: Record<LiftingMethod, string> = {
  수작업: "HAND",
  인양백: "BAG",
  크레인: "CRANE",
};

export const UNCOLLECTED_SCALE_MAP: Record<UncollectedWasteScale, string> = {
  소: "SMALL",
  중: "MEDIUM",
  대: "LARGE",
};
