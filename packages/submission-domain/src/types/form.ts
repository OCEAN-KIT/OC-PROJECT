// record 잠수기록 작성 화면에서 사용하는 폼 타입과 선택 enum.
// 활동 제출 payload로 변환되기 전의 화면 상태를 정의한다.

import type { HealthGrade } from "./submission";

export type { HealthGrade };

////////////// 공통 영역 ////////////////
export type WorkType =
  | "이식"
  | "조식동물 작업"
  | "부착기질 개선"
  | "모니터링"
  | "해양정화"
  | "기타";

export type Rating3 = "나쁨" | "보통" | "좋음";

////////////// 이식 ////////////////
export type TransplantType =
  | "감태"
  | "다시마"
  | "곰피"
  | "모자반"
  | "대황"
  | "기타";

export type TransplantPlace = "어초" | "암반" | "기타";

export type TransplantSystem =
  | "로프 연승"
  | "종자 직접 이식"
  | "이식용 모듈"
  | "기타";

export type TransplantScale = string;

////////////// 조식동물 작업 ////////////////
export type GrazingTarget = "성게" | "소라" | "전복" | "불가사리" | "기타";

export type GrazingDensity = "적음" | "보통" | "많음";

export type GrazingScope = "국소" | "구역" | "광범위";

export type GrazingCollectedAmount = string;

////////////// 부착기질 개선 ////////////////
export type SubstrateTarget = "암반" | "어초" | "구조물" | "기타";

export type SubstrateRange = string;

export type SubstrateCondition = string;

////////////// 모니터링 ////////////////
// 적지조사
export type TerrainType = "암반" | "모래" | "혼합" | "기타";

export type WhiteningLevel = "없음" | "진행" | "심각";

export type GrazerDistribution = "낮음" | "중간" | "높음";

export type RockCharacteristic =
  | "매끈"
  | "균열"
  | "석회조류 우점"
  | "혼합"
  | "해조류 식생";

export type TransplantSuitability = "적합" | "부적합";

// 해조류 상태
export type AlgaeCondition = "양호" | "쇠약" | "탈락";

////////////// 해양정화 ////////////////
export type CleanupType =
  | "그물"
  | "통발"
  | "기타 어구"
  | "낚시도구"
  | "플라스틱"
  | "기타";

export type LiftingMethod = "수작업" | "인양백" | "크레인";

export type UncollectedWasteScale = "소" | "중" | "대";

////////////// 제출 폼 ////////////////
export type OcRecordForm = {
  basic: {
    siteName: string; // 활동 장소명(사이트명)
    date: string; // 활동 날짜 (YYYY-MM-DD) -> API: recordDate
    time: string; // 활동 시간 (HH:MM) - 프론트 전용
    diveRound: number; // 다이빙 회차 -> API: divingRound
    workType: WorkType; // 작업 유형 -> API: activityType
    workers: string; // 작업자(참여자) 정보 텍스트 - 프론트 전용 (API: participants로 분리)
  };
  env: {
    avgDepthM: string; // 평균 수심(m)
    maxDepthM: string; // 최대 수심(m)
    waterTempC: string; // 수온(°C)
    visibilityStatus: Rating3; // 시야(나쁨/보통/좋음)
    waveStatus: Rating3; // 파도(나쁨/보통/좋음)
    surgeStatus: Rating3; // 서지(나쁨/보통/좋음)
    currentStatus: Rating3; // 조류(나쁨/보통/좋음)
  };
  transplant: {
    speciesType: TransplantType; // 이식 대상 종류(감태/다시마/곰피/모자반/대황/기타)
    locationType: TransplantPlace; // 이식 장소(어초/암반/기타)
    methodType: TransplantSystem; // 이식 방식(로프 연승/종자 직접 이식/이식용 모듈/기타)
    scale: TransplantScale; // 이식 규모(텍스트)
    healthStatus: HealthGrade; // 건강 상태 등급(A/B/C/D)
  };
  grazing: {
    targetSpecies: GrazingTarget[]; // 대상 생물(복수 선택: 성게/소라/전복/불가사리/기타)
    densityBeforeWork: GrazingDensity; // 작업 전 체감 밀도(적음/보통/많음)
    workScope: GrazingScope; // 작업 범위(국소/구역/광범위)
    note: string; // 작업 범위 보충 설명(텍스트)
    collectionAmount: GrazingCollectedAmount; // 수거량(텍스트)
  };
  substrate: {
    targetType: SubstrateTarget; // 작업 대상(암반/어초/구조물/기타)
    workScope: SubstrateRange; // 작업 범위(텍스트)
    substrateState: SubstrateCondition; // 작업 후 기질 상태(텍스트)
  };
  monitoring: {
    // 적지조사
    entryCoordinate: string; // 입수 좌표
    exitCoordinate: string; // 출수 좌표
    direction: string; // 진행 방위
    terrain: TerrainType; // 지형 구성
    barrenExtent: WhiteningLevel; // 갯녹음 정도
    grazerDistribution: GrazerDistribution; // 조식동물 분포
    rockFeatures: RockCharacteristic[]; // [배열로 변경됨] 암반 특성 (복수 선택)
    suitability: TransplantSuitability; // 해조 이식 적합성
    // 해조류 상태
    seaweedIdNumber: string; // 측정 식별번호
    seaweedHealthStatus: AlgaeCondition; // 생육 상태
    // 정밀 측정 (선택적)
    precisionMeasurement: boolean; // 정밀 측정 개체 있음
    leafLength: string; // 엽장
    maxLeafWidth: string; // 최대엽폭
  };
  cleanup: {
    wasteTypes: CleanupType[]; // 유형(복수 선택)
    method: LiftingMethod; // 인양 방식
    collectionAmount: string; // 수거량
    uncollectedScale: UncollectedWasteScale; // 미수거 폐기물 규모
  };
};
