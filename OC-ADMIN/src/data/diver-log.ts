// src/data/diver-log.ts
export type ActivityKind =
  | "Transplantation" // 이식
  | "DebrisRemoval" // 폐기물 수거
  | "Research" // 연구
  | "Monitoring" // 모니터링
  | "Other"; // 기타

// 다이버 개인 환경정보(개인이 측정/기록한 값)
export type DiverEnv = {
  diveDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm (현장 기준)
  gps: { lat: number; lng: number };
  depthM: number;
  waterTempC: number;
  current: "잔잔" | "중간" | "강함";
  visibilityM: number;
};

export type DiverActivityLog = {
  diveId: string; // 어떤 다이브에서
  diverId: string; // 누가
  activity: ActivityKind; // 작업내용(영문 enum)
  details: string; // 세부내용(한국어)
  media: { photos: string[]; videos?: string[] }; // 더미는 사진만
  incidentOrAbnormal?: string | null; // 환경 이상/사고 보고
  env?: DiverEnv; // ✅ 다이버 개인이 기록한 환경정보
};

// 001, 002 예시 (이미지 경로는 public/images/sea.webp)
export const DIVER_ACTIVITY_LOGS: DiverActivityLog[] = [
  // --- 001 경북 울진 ---
  {
    diveId: "001",
    diverId: "dv-kim",
    activity: "Transplantation",
    details: "성게 제거 구역 주변을 정리하고 이식 대상지 상태를 점검함.",
    media: {
      photos: [
        "/images/sea.webp",
        "/images/sea.webp",
        "/images/sea.webp",
        "/images/sea.webp",
        "/images/sea.webp",
        "/images/sea.webp",
        "/images/sea.webp",
        "/images/sea.webp",
      ],
    },
    incidentOrAbnormal: null,
    env: {
      diveDate: "2025-10-28",
      startTime: "09:05",
      gps: { lat: 37.0003, lng: 129.4002 },
      depthM: 10,
      waterTempC: 18.1,
      current: "중간",
      visibilityM: 7,
    },
  },
  {
    diveId: "001",
    diverId: "dv-moon",
    activity: "Research",
    details: "수온/염분 로깅과 저서생물 밀도 샘플링 3회 수행.",
    media: { photos: ["/images/sea.webp"] },
    incidentOrAbnormal: "수심 10m에서 약 3분간 탁도 증가 관측.",
    env: {
      diveDate: "2025-10-28",
      startTime: "09:12",
      gps: { lat: 37.0008, lng: 129.4011 },
      depthM: 11,
      waterTempC: 18.3,
      current: "중간",
      visibilityM: 6,
    },
  },
  {
    diveId: "001",
    diverId: "dv-jang",
    activity: "Monitoring",
    details: "구역 경계 확인, 안전 신호 관리, 보트 위치 유지.",
    media: { photos: ["/images/sea.webp"] },
    incidentOrAbnormal: null,
    env: {
      diveDate: "2025-10-28",
      startTime: "09:18",
      gps: { lat: 37.0011, lng: 129.3997 },
      depthM: 9,
      waterTempC: 18.0,
      current: "잔잔",
      visibilityM: 8,
    },
  },

  // --- 002 포항 영일만 A ---
  {
    diveId: "002",
    diverId: "dv-lee",
    activity: "Monitoring",
    details: "자연광 조건 양호, RGB 사진 20장 촬영. 군집 변화 양호.",
    media: { photos: ["/images/sea.webp"] },
    incidentOrAbnormal: null,
    env: {
      diveDate: "2025-10-29",
      startTime: "14:20",
      gps: { lat: 36.0502, lng: 129.3701 },
      depthM: 8,
      waterTempC: 18.6,
      current: "잔잔",
      visibilityM: 10,
    },
  },
  {
    diveId: "002",
    diverId: "dv-jung",
    activity: "DebrisRemoval",
    details: "폐어구(소형 로프 2개, 비닐 조각) 수거 후 분리 배출.",
    media: { photos: ["/images/sea.webp"] },
    incidentOrAbnormal: null,
    env: {
      diveDate: "2025-10-29",
      startTime: "14:28",
      gps: { lat: 36.0506, lng: 129.371 },
      depthM: 7,
      waterTempC: 18.4,
      current: "잔잔",
      visibilityM: 9,
    },
  },
  {
    diveId: "002",
    diverId: "dv-han",
    activity: "Research",
    details: "트랜섹트 30m 라인 설치 및 가시거리 기록.",
    media: { photos: ["/images/sea.webp"] },
    incidentOrAbnormal: "얕은 수역 너울로 약 5분 지연.",
    env: {
      diveDate: "2025-10-29",
      startTime: "14:33",
      gps: { lat: 36.0499, lng: 129.3698 },
      depthM: 9,
      waterTempC: 18.5,
      current: "잔잔",
      visibilityM: 10,
    },
  },
];
