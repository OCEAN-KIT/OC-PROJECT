// src/mocks/reviews.ts
export type ReviewStatus = "pending" | "approved" | "rejected";

// ✅ 기본환경정보 타입
export type BasicEnv = {
  /** 다이빙 수행일자 (YYYY-MM-DD) */
  diveDate: string;
  /** 기록 생성 시작(현장 기준 HH:mm) */
  startTime: string;
  /** 다이빙 위치 */
  gps: { lat: number; lng: number };
  /** 관찰/작업 수심 (m) */
  depthM: number;
  /** 수온(℃) */
  waterTempC: number;
  /** 조류 상태 */
  current: "잔잔" | "중간" | "강함";
  /** 수중 가시거리 (m) */
  visibilityM: number;
};

export type ReviewItem = {
  id: string;
  site: string;
  datetime: string; // ISO
  task: "성게제거" | "모니터링" | "바다숲조성" | "부표점검";
  author: string;
  fileCount: number;
  status: ReviewStatus;
  /** ✅ 기본환경정보 (있을 수도/없을 수도) */
  env?: BasicEnv;
};

export const REVIEW_ITEMS: ReviewItem[] = [
  {
    id: "001",
    site: "경북 울진",
    datetime: "2025-10-28T09:12:00+09:00",
    task: "성게제거",
    author: "김바다",
    fileCount: 3,
    status: "pending",
    env: {
      diveDate: "2025-10-28",
      startTime: "09:05",
      gps: { lat: 37.0, lng: 129.4 },
      depthM: 10,
      waterTempC: 18.2,
      current: "중간",
      visibilityM: 7,
    },
  },
  {
    id: "002",
    site: "포항 영일만 A",
    datetime: "2025-10-29T14:35:00+09:00",
    task: "모니터링",
    author: "이해양",
    fileCount: 5,
    status: "approved",
    env: {
      diveDate: "2025-10-29",
      startTime: "14:20",
      gps: { lat: 36.05, lng: 129.37 },
      depthM: 8,
      waterTempC: 18.5,
      current: "잔잔",
      visibilityM: 10,
    },
  },
  // ✅ 반려 예시 1
  {
    id: "003",
    site: "경남 거제 남부",
    datetime: "2025-10-30T08:20:00+09:00",
    task: "바다숲조성",
    author: "박해조",
    fileCount: 2,
    status: "rejected",
  },
  // ✅ 반려 예시 2
  {
    id: "004",
    site: "강릉 주문진",
    datetime: "2025-10-31T10:10:00+09:00",
    task: "부표점검",
    author: "최아라",
    fileCount: 1,
    status: "rejected",
  },
  {
    id: "005",
    site: "여수 돌산",
    datetime: "2025-10-25T15:42:00+09:00",
    task: "모니터링",
    author: "정파도",
    fileCount: 4,
    status: "approved",
  },
  {
    id: "006",
    site: "속초 청초호",
    datetime: "2025-10-26T11:05:00+09:00",
    task: "성게제거",
    author: "문수심",
    fileCount: 6,
    status: "pending",
  },
  {
    id: "007",
    site: "통영 한산도",
    datetime: "2025-10-27T13:55:00+09:00",
    task: "바다숲조성",
    author: "서유림",
    fileCount: 3,
    status: "approved",
  },
  {
    id: "008",
    site: "부산 오륙도",
    datetime: "2025-10-24T09:00:00+09:00",
    task: "부표점검",
    author: "장해파",
    fileCount: 2,
    status: "pending",
  },
  {
    id: "009",
    site: "제주 김녕",
    datetime: "2025-10-22T16:18:00+09:00",
    task: "모니터링",
    author: "한청해",
    fileCount: 7,
    status: "approved",
  },
  {
    id: "010",
    site: "울산 정자",
    datetime: "2025-10-21T07:45:00+09:00",
    task: "성게제거",
    author: "오해심",
    fileCount: 5,
    status: "pending",
  },
];
