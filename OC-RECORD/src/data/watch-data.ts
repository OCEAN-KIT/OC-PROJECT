// constants/watch-data.ts

export type WatchWorkLog = {
  time: number; // ms 단위 타임스탬프 (더미)
  count: number; // 해당 시점 작업 개수
  note?: string; // 선택 메모
};

export type WatchActivity = {
  activityType: "TRANSPLANT" | "URCHIN_REMOVAL" | "TRASH_COLLECTION" | "OTHER";
  gridId: string;
  totalCount: number;
  work_logs: WatchWorkLog[];
};

export type WatchDive = {
  id: string;
  startTime: number; // ms
  endTime: number; // ms
  startLat: number;
  startLon: number;
  endLat: number;
  endLon: number;
  userId: string;
  activities: WatchActivity[];
};

/** 워치에서 받아온 다이빙 기록 더미 데이터 */
export const WATCH_DATA: WatchDive[] = [
  {
    id: "dive-001",
    startTime: Date.parse("2025-11-30T09:10:00+09:00"),
    endTime: Date.parse("2025-11-30T10:05:00+09:00"),
    startLat: 36.0321,
    startLon: 129.3842,
    endLat: 36.0345,
    endLon: 129.3899,
    userId: "diver_001",
    activities: [
      {
        activityType: "TRANSPLANT",
        gridId: "A-12",
        totalCount: 42,
        work_logs: [
          { time: Date.parse("2025-11-30T09:20:00+09:00"), count: 12 },
          { time: Date.parse("2025-11-30T09:40:00+09:00"), count: 30 },
        ],
      },
      {
        activityType: "URCHIN_REMOVAL",
        gridId: "B-07",
        totalCount: 15,
        work_logs: [
          { time: Date.parse("2025-11-30T09:50:00+09:00"), count: 15 },
        ],
      },
    ],
  },
  {
    id: "dive-002",
    startTime: Date.parse("2025-11-29T14:05:00+09:00"),
    endTime: Date.parse("2025-11-29T14:55:00+09:00"),
    startLat: 35.9988,
    startLon: 129.4023,
    endLat: 35.9995,
    endLon: 129.4071,
    userId: "diver_001",
    activities: [
      {
        activityType: "TRASH_COLLECTION",
        gridId: "C-03",
        totalCount: 28,
        work_logs: [
          { time: Date.parse("2025-11-29T14:15:00+09:00"), count: 10 },
          { time: Date.parse("2025-11-29T14:35:00+09:00"), count: 18 },
        ],
      },
    ],
  },
  {
    id: "dive-003",
    startTime: Date.parse("2025-11-25T11:30:00+09:00"),
    endTime: Date.parse("2025-11-25T12:10:00+09:00"),
    startLat: 36.0412,
    startLon: 129.3755,
    endLat: 36.0431,
    endLon: 129.3799,
    userId: "diver_002",
    activities: [
      {
        activityType: "OTHER",
        gridId: "D-01",
        totalCount: 9,
        work_logs: [
          {
            time: Date.parse("2025-11-25T11:45:00+09:00"),
            count: 9,
            note: "일반 모니터링",
          },
        ],
      },
    ],
  },
  {
    id: "dive-004",
    startTime: Date.parse("2025-11-20T08:40:00+09:00"),
    endTime: Date.parse("2025-11-20T09:20:00+09:00"),
    startLat: 36.0201,
    startLon: 129.3901,
    endLat: 36.0215,
    endLon: 129.3922,
    userId: "diver_003",
    activities: [
      {
        activityType: "TRANSPLANT",
        gridId: "E-05",
        totalCount: 20,
        work_logs: [
          { time: Date.parse("2025-11-20T08:50:00+09:00"), count: 8 },
          { time: Date.parse("2025-11-20T09:05:00+09:00"), count: 12 },
        ],
      },
    ],
  },
  {
    id: "dive-005",
    startTime: Date.parse("2025-11-18T15:10:00+09:00"),
    endTime: Date.parse("2025-11-18T15:55:00+09:00"),
    startLat: 36.0123,
    startLon: 129.3701,
    endLat: 36.0138,
    endLon: 129.3734,
    userId: "diver_001",
    activities: [
      {
        activityType: "URCHIN_REMOVAL",
        gridId: "F-09",
        totalCount: 18,
        work_logs: [
          { time: Date.parse("2025-11-18T15:20:00+09:00"), count: 7 },
          { time: Date.parse("2025-11-18T15:40:00+09:00"), count: 11 },
        ],
      },
      {
        activityType: "TRASH_COLLECTION",
        gridId: "F-10",
        totalCount: 12,
        work_logs: [
          { time: Date.parse("2025-11-18T15:30:00+09:00"), count: 12 },
        ],
      },
    ],
  },
];
