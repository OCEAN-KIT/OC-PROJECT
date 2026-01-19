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
    healthGrade: HealthGrade;
  };
};
