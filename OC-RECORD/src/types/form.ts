////////////// 공통 영역 ////////////////
export type WorkType =
  | "이식"
  | "조식동물 작업"
  | "부착기질 개선"
  | "모니터링"
  | "해양정화"
  | "기타";

export type Rating3 = "나쁨" | "보통" | "좋음";

export type HealthGrade = "A" | "B" | "C" | "D";

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
    date: string; // 활동 날짜 (YYYY-MM-DD)
    time: string; // 활동 시간 (HH:MM)
    diveRound: number; // 다이빙 회차
    workType: WorkType; // 작업 유형
    workers: string; // 작업자(참여자) 정보 텍스트
  };
  env: {
    avgDepthM: string; // 평균 수심(m)
    maxDepthM: string; // 최대 수심(m)
    waterTempC: string; // 수온(°C)
    visibility: Rating3; // 시야(나쁨/보통/좋음)
    wave: Rating3; // 파도(나쁨/보통/좋음)
    surge: Rating3; // 서지(나쁨/보통/좋음)
    current: Rating3; // 유속(잔잔/중간/강함)
  };
  transplant: {
    transplantType: TransplantType; // 이식 대상 종류(감태/다시마/곰피/모자반/대황/기타)
    transplantPlace: TransplantPlace; // 이식 장소(어초/암반/기타)
    transplantSystem: TransplantSystem; // 이식 방식(로프 연승/종자 직접 이식/이식용 모듈/기타)
    transplantScale: TransplantScale; // 이식 규모(텍스트)
    healthGrade: HealthGrade; // 건강 상태 등급(A/B/C/D)
  };
  grazing: {
    targets: GrazingTarget[]; // 대상 생물(복수 선택: 성게/소라/전복/불가사리/기타)
    density: GrazingDensity; // 작업 전 체감 밀도(적음/보통/많음)
    scope: GrazingScope; // 작업 범위(국소/구역/광범위)
    scopeNote: string; // 작업 범위 보충 설명(텍스트)
    collectedAmount: GrazingCollectedAmount; // 수거량(텍스트)
  };
  substrate: {
    target: SubstrateTarget; // 작업 대상(암반/어초/구조물/기타)
    range: SubstrateRange; // 작업 범위(텍스트)
    condition: SubstrateCondition; // 작업 후 기질 상태(텍스트)
  };
  monitoring: {
    // 적지조사
    entryCoord: string; // 입수 좌표
    exitCoord: string; // 출수 좌표
    direction: string; // 진행 방위
    terrainType: TerrainType; // 지형 구성
    whiteningLevel: WhiteningLevel; // 갯녹음 정도
    grazerDistribution: GrazerDistribution; // 조식동물 분포
    rockCharacteristic: RockCharacteristic; // 암반 특성
    transplantSuitability: TransplantSuitability; // 해조 이식 적합성
    // 해조류 상태
    measurementId: string; // 측정 식별번호
    algaeCondition: AlgaeCondition; // 생육 상태
    // 정밀 측정 (선택적)
    hasPreciseMeasurement: boolean; // 정밀 측정 개체 있음
    bladeLength: string; // 엽장
    maxBladeWidth: string; // 최대엽폭
  };
  cleanup: {
    types: CleanupType[]; // 유형(복수 선택)
    liftingMethod: LiftingMethod; // 인양 방식
    collectedAmount: string; // 수거량
    uncollectedWasteScale: UncollectedWasteScale; // 미수거 폐기물 규모
  };
};
