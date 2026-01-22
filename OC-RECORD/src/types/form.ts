export type WorkType =
  | "이식"
  | "조식동물 작업"
  | "부착기질 개선"
  | "모니터링"
  | "해양정화"
  | "기타";

export type CurrentStrength = "잔잔" | "중간" | "강함";

export type Rating3 = "나쁨" | "보통" | "좋음";

export type HealthGrade = "A" | "B" | "C" | "D";

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

export type OcRecordForm = {
  basic: {
    siteName: string;
    date: string;
    time: string;
    diveRound: number;
    workType: WorkType;
    workers: string;
  };
  env: {
    avgDepthM: string;
    waterTempC: string;
    current: CurrentStrength;
    visibility: Rating3;
  };
  transplant: {
    transplantType: TransplantType;
    transplantPlace: TransplantPlace;
    transplantSystem: TransplantSystem;
    transplantScale: TransplantScale;
    healthGrade: HealthGrade;
  };
};
