// src/constants/areaDetails-ai.js
// 모든 이미지 임시 동일 경로
const IMG = "/images/underSea.jpg";

/**
 * 각 areaId 별 "AI 예측" 더미 데이터
 * 구조는 areaDetails.js와 동일: basic / transplant / growth / biodiversity / water / media
 * - transplant: count +5% (반올림), area +3% (반올림)
 * - growth: attachment +6% (최대 98), survival -2% (최소 75), growthMM +8%
 * - biodiversity: after 종수 +8%, shannon.after +0.12
 * - water: temp +0.4, do -0.1, nutrient -0.02 (하한 0)
 */
export const AREA_DETAILS_AI = {
  // ───────────── 포항 ─────────────
  "pohang-1": {
    basic: {
      startDate: "2025-07-15",
      habitat: "암반",
      depth: 8,
      areaSize: "2,100㎡",
      center: [129.44326182424885, 36.076249497155146],
      stage: "이식 완료",
    },
    transplant: [
      { name: "감태", count: 2205, area: "1,133㎡" },
      { name: "다시마", count: 735, area: "670㎡" },
      { name: "곰피", count: 399, area: "361㎡" },
    ],
    growth: {
      attachment: [64, 69, 75, 82, 85, 87],
      survival: [90, 88, 87, 86, 84, 83],
      growthMM: [1.08, 1.3, 1.62, 1.94, 2.16, 2.48],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 5, inverts: 10 },
      after: { fish: 12, inverts: 19 },
      shannon: { before: 1.12, after: 1.9 },
    },
    water: [
      { month: "‘25.01", temp: 10.0, do: 8.5, nutrient: 0.27 },
      { month: "02", temp: 10.4, do: 8.3, nutrient: 0.24 },
      { month: "03", temp: 11.7, do: 8.1, nutrient: 0.22 },
      { month: "04", temp: 14.1, do: 7.9, nutrient: 0.2 },
      { month: "05", temp: 16.5, do: 7.7, nutrient: 0.19 },
    ],
    media: [
      { label: "2025.07", url: IMG },
      { label: "2025.08", url: IMG },
      { label: "2025.09", url: IMG },
      { label: "2025.10", url: IMG },
    ],
  },

  "pohang-2": {
    basic: {
      startDate: "2025-08-02",
      habitat: "혼합",
      depth: 12,
      areaSize: "2,400㎡",
      center: [129.5094049361261, 36.082747077980684],
      stage: "성장 중",
    },
    transplant: [
      { name: "감태", count: 2520, area: "1,236㎡" },
      { name: "다시마", count: 945, area: "803㎡" },
      { name: "곰피", count: 441, area: "391㎡" },
    ],
    growth: {
      attachment: [61, 67, 73, 78, 84, 88],
      survival: [88, 87, 86, 85, 84, 83],
      growthMM: [1.19, 1.4, 1.73, 2.05, 2.38, 2.7],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 6, inverts: 9 },
      after: { fish: 13, inverts: 18 },
      shannon: { before: 1.1, after: 1.84 },
    },
    water: [
      { month: "‘25.01", temp: 10.3, do: 8.3, nutrient: 0.26 },
      { month: "02", temp: 10.7, do: 8.1, nutrient: 0.23 },
      { month: "03", temp: 12.0, do: 7.9, nutrient: 0.21 },
      { month: "04", temp: 14.5, do: 7.7, nutrient: 0.2 },
      { month: "05", temp: 17.0, do: 7.5, nutrient: 0.19 },
    ],
    media: [
      { label: "2025.07", url: IMG },
      { label: "2025.08", url: IMG },
      { label: "2025.09", url: IMG },
      { label: "2025.10", url: IMG },
    ],
  },

  "pohang-3": {
    basic: {
      startDate: "2025-06-20",
      habitat: "모래",
      depth: 18,
      areaSize: "1,950㎡",
      center: [129.5815005278194, 35.949910138964285],
      stage: "모니터링 중",
    },
    transplant: [
      { name: "감태", count: 1995, area: "1,030㎡" },
      { name: "다시마", count: 630, area: "670㎡" },
      { name: "곰피", count: 336, area: "309㎡" },
    ],
    growth: {
      attachment: [58, 65, 71, 76, 81, 84],
      survival: [87, 86, 85, 84, 83, 82],
      growthMM: [0.97, 1.3, 1.51, 1.84, 2.16, 2.38],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 4, inverts: 8 },
      after: { fish: 11, inverts: 16 },
      shannon: { before: 1.02, after: 1.72 },
    },
    water: [
      { month: "‘25.01", temp: 9.8, do: 8.2, nutrient: 0.28 },
      { month: "02", temp: 10.2, do: 8.0, nutrient: 0.25 },
      { month: "03", temp: 11.4, do: 7.8, nutrient: 0.23 },
      { month: "04", temp: 13.9, do: 7.6, nutrient: 0.21 },
      { month: "05", temp: 16.4, do: 7.5, nutrient: 0.2 },
    ],
    media: [
      { label: "2025.07", url: IMG },
      { label: "2025.08", url: IMG },
      { label: "2025.09", url: IMG },
      { label: "2025.10", url: IMG },
    ],
  },

  "pohang-4": {
    basic: {
      startDate: "2024-11-10",
      habitat: "암반",
      depth: 10,
      areaSize: "2,250㎡",
      center: [129.40140806078313, 36.224121065386555],
      stage: "안정화 구역",
    },
    transplant: [
      { name: "감태", count: 2310, area: "1,185㎡" },
      { name: "다시마", count: 788, area: "721㎡" },
      { name: "곰피", count: 378, area: "350㎡" },
    ],
    growth: {
      attachment: [68, 72, 77, 84, 87, 89],
      survival: [91, 90, 89, 88, 87, 86],
      growthMM: [1.3, 1.51, 1.84, 2.16, 2.48, 2.7],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 7, inverts: 12 },
      after: { fish: 14, inverts: 22 },
      shannon: { before: 1.25, after: 2.0 },
    },
    water: [
      { month: "‘25.01", temp: 10.1, do: 8.5, nutrient: 0.26 },
      { month: "02", temp: 10.6, do: 8.3, nutrient: 0.24 },
      { month: "03", temp: 12.1, do: 8.1, nutrient: 0.22 },
      { month: "04", temp: 14.7, do: 7.9, nutrient: 0.2 },
      { month: "05", temp: 17.1, do: 7.8, nutrient: 0.19 },
    ],
    media: [
      { label: "2024.12", url: IMG },
      { label: "2025.01", url: IMG },
      { label: "2025.02", url: IMG },
      { label: "2025.03", url: IMG },
    ],
  },

  "pohang-5": {
    basic: {
      startDate: "2025-07-28",
      habitat: "혼합",
      depth: 9,
      areaSize: "1,880㎡",
      center: [129.47, 36.05],
      stage: "성장 중",
    },
    transplant: [
      { name: "감태", count: 1943, area: "1,009㎡" },
      { name: "다시마", count: 672, area: "618㎡" },
      { name: "곰피", count: 315, area: "309㎡" },
    ],
    growth: {
      attachment: [60, 66, 71, 77, 83, 87],
      survival: [89, 88, 86, 85, 84, 83],
      growthMM: [1.08, 1.3, 1.73, 2.05, 2.27, 2.59],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 5, inverts: 9 },
      after: { fish: 12, inverts: 17 },
      shannon: { before: 1.08, after: 1.78 },
    },
    water: [
      { month: "‘25.01", temp: 9.9, do: 8.2, nutrient: 0.27 },
      { month: "02", temp: 10.3, do: 8.1, nutrient: 0.24 },
      { month: "03", temp: 11.6, do: 7.9, nutrient: 0.22 },
      { month: "04", temp: 14.2, do: 7.7, nutrient: 0.21 },
      { month: "05", temp: 16.6, do: 7.6, nutrient: 0.19 },
    ],
    media: [
      { label: "2025.07", url: IMG },
      { label: "2025.08", url: IMG },
      { label: "2025.09", url: IMG },
      { label: "2025.10", url: IMG },
    ],
  },

  "pohang-6": {
    basic: {
      startDate: "2025-05-30",
      habitat: "모래",
      depth: 14,
      areaSize: "2,020㎡",
      center: [129.52, 36.02],
      stage: "모니터링 중",
    },
    transplant: [
      { name: "감태", count: 2100, area: "1,082㎡" },
      { name: "다시마", count: 714, area: "659㎡" },
      { name: "곰피", count: 326, area: "309㎡" },
    ],
    growth: {
      attachment: [57, 64, 70, 75, 80, 83],
      survival: [88, 87, 86, 85, 84, 82],
      growthMM: [0.97, 1.19, 1.51, 1.84, 2.16, 2.38],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 4, inverts: 8 },
      after: { fish: 10, inverts: 16 },
      shannon: { before: 1.0, after: 1.7 },
    },
    water: [
      { month: "‘25.01", temp: 9.6, do: 8.1, nutrient: 0.28 },
      { month: "02", temp: 10.1, do: 7.9, nutrient: 0.25 },
      { month: "03", temp: 11.3, do: 7.8, nutrient: 0.23 },
      { month: "04", temp: 13.7, do: 7.6, nutrient: 0.21 },
      { month: "05", temp: 16.2, do: 7.5, nutrient: 0.2 },
    ],
    media: [
      { label: "2025.05", url: IMG },
      { label: "2025.06", url: IMG },
      { label: "2025.07", url: IMG },
      { label: "2025.08", url: IMG },
    ],
  },

  "pohang-7": {
    basic: {
      startDate: "2025-08-12",
      habitat: "암반",
      depth: 7,
      areaSize: "1,740㎡",
      center: [129.55, 36.1],
      stage: "이식 완료",
    },
    transplant: [
      { name: "감태", count: 1785, area: "948㎡" },
      { name: "다시마", count: 630, area: "577㎡" },
      { name: "곰피", count: 313, area: "268㎡" },
    ],
    growth: {
      attachment: [66, 71, 76, 83, 88, 91],
      survival: [91, 90, 89, 88, 87, 86],
      growthMM: [1.3, 1.62, 1.94, 2.27, 2.59, 2.81],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 7, inverts: 11 },
      after: { fish: 15, inverts: 22 },
      shannon: { before: 1.22, after: 2.02 },
    },
    water: [
      { month: "‘25.01", temp: 10.2, do: 8.4, nutrient: 0.25 },
      { month: "02", temp: 10.8, do: 8.2, nutrient: 0.23 },
      { month: "03", temp: 12.3, do: 8.0, nutrient: 0.21 },
      { month: "04", temp: 14.8, do: 7.8, nutrient: 0.2 },
      { month: "05", temp: 17.3, do: 7.6, nutrient: 0.19 },
    ],
    media: [
      { label: "2025.08", url: IMG },
      { label: "2025.09", url: IMG },
      { label: "2025.10", url: IMG },
      { label: "2025.11", url: IMG },
    ],
  },

  "pohang-8": {
    basic: {
      startDate: "2024-12-22",
      habitat: "혼합",
      depth: 11,
      areaSize: "2,060㎡",
      center: [129.39, 36.14],
      stage: "안정화 구역",
    },
    transplant: [
      { name: "감태", count: 2153, area: "1,092㎡" },
      { name: "다시마", count: 756, area: "680㎡" },
      { name: "곰피", count: 356, area: "319㎡" },
    ],
    growth: {
      attachment: [69, 74, 80, 85, 89, 91],
      survival: [92, 91, 90, 89, 88, 87],
      growthMM: [1.4, 1.73, 2.05, 2.38, 2.7, 2.92],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 8, inverts: 12 },
      after: { fish: 16, inverts: 23 },
      shannon: { before: 1.3, after: 2.08 },
    },
    water: [
      { month: "‘25.01", temp: 10.3, do: 8.5, nutrient: 0.25 },
      { month: "02", temp: 10.9, do: 8.3, nutrient: 0.23 },
      { month: "03", temp: 12.4, do: 8.1, nutrient: 0.21 },
      { month: "04", temp: 15.0, do: 7.9, nutrient: 0.2 },
      { month: "05", temp: 17.4, do: 7.6, nutrient: 0.18 },
    ],
    media: [
      { label: "2024.12", url: IMG },
      { label: "2025.01", url: IMG },
      { label: "2025.02", url: IMG },
      { label: "2025.03", url: IMG },
    ],
  },

  // ───────────── 울진 ─────────────
  "uljin-1": {
    basic: {
      startDate: "2025-07-30",
      habitat: "암반",
      depth: 7,
      areaSize: "1,680㎡",
      center: [129.43187534029522, 37.036791123643326],
      stage: "성장 중",
    },
    transplant: [
      { name: "감태", count: 1764, area: "927㎡" },
      { name: "다시마", count: 630, area: "567㎡" },
      { name: "곰피", count: 302, area: "237㎡" },
    ],
    growth: {
      attachment: [63, 68, 74, 80, 85, 89],
      survival: [90, 89, 88, 86, 85, 84],
      growthMM: [1.19, 1.4, 1.73, 2.05, 2.38, 2.7],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 6, inverts: 10 },
      after: { fish: 13, inverts: 19 },
      shannon: { before: 1.18, after: 1.94 },
    },
    water: [
      { month: "‘25.01", temp: 9.7, do: 8.4, nutrient: 0.26 },
      { month: "02", temp: 10.2, do: 8.2, nutrient: 0.24 },
      { month: "03", temp: 11.6, do: 8.0, nutrient: 0.22 },
      { month: "04", temp: 14.0, do: 7.8, nutrient: 0.2 },
      { month: "05", temp: 16.4, do: 7.6, nutrient: 0.19 },
    ],
    media: [
      { label: "2025.07", url: IMG },
      { label: "2025.08", url: IMG },
      { label: "2025.09", url: IMG },
      { label: "2025.10", url: IMG },
    ],
  },

  "uljin-2": {
    basic: {
      startDate: "2024-09-18",
      habitat: "혼합",
      depth: 9,
      areaSize: "1,920㎡",
      center: [129.42255431160834, 36.96206604857409],
      stage: "안정화 구역",
    },
    transplant: [
      { name: "감태", count: 1995, area: "1,051㎡" },
      { name: "다시마", count: 714, area: "618㎡" },
      { name: "곰피", count: 324, area: "309㎡" },
    ],
    growth: {
      attachment: [70, 75, 81, 86, 90, 92],
      survival: [93, 92, 91, 90, 89, 88],
      growthMM: [1.51, 1.84, 2.16, 2.48, 2.76, 3.02],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 8, inverts: 12 },
      after: { fish: 16, inverts: 23 },
      shannon: { before: 1.34, after: 2.1 },
    },
    water: [
      { month: "‘25.01", temp: 10.1, do: 8.5, nutrient: 0.24 },
      { month: "02", temp: 10.5, do: 8.3, nutrient: 0.22 },
      { month: "03", temp: 12.0, do: 8.1, nutrient: 0.2 },
      { month: "04", temp: 14.4, do: 7.9, nutrient: 0.19 },
      { month: "05", temp: 16.7, do: 7.7, nutrient: 0.18 },
    ],
    media: [
      { label: "2024.09", url: IMG },
      { label: "2024.10", url: IMG },
      { label: "2024.11", url: IMG },
      { label: "2024.12", url: IMG },
    ],
  },

  "uljin-3": {
    basic: {
      startDate: "2025-05-05",
      habitat: "암반",
      depth: 6,
      areaSize: "1,550㎡",
      center: [129.45126050382464, 37.036791123643326],
      stage: "이식 완료",
    },
    transplant: [
      { name: "감태", count: 1575, area: "845㎡" },
      { name: "다시마", count: 578, area: "536㎡" },
      { name: "곰피", count: 281, area: "216㎡" },
    ],
    growth: {
      attachment: [65, 70, 75, 82, 89, 93],
      survival: [91, 90, 89, 88, 87, 86],
      growthMM: [1.3, 1.62, 1.94, 2.27, 2.59, 2.81],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 6, inverts: 10 },
      after: { fish: 14, inverts: 21 },
      shannon: { before: 1.2, after: 1.98 },
    },
    water: [
      { month: "‘25.01", temp: 9.8, do: 8.4, nutrient: 0.25 },
      { month: "02", temp: 10.2, do: 8.2, nutrient: 0.23 },
      { month: "03", temp: 11.5, do: 8.0, nutrient: 0.21 },
      { month: "04", temp: 14.1, do: 7.8, nutrient: 0.2 },
      { month: "05", temp: 16.5, do: 7.6, nutrient: 0.18 },
    ],
    media: [
      { label: "2025.05", url: IMG },
      { label: "2025.06", url: IMG },
      { label: "2025.07", url: IMG },
      { label: "2025.08", url: IMG },
    ],
  },

  "uljin-4": {
    basic: {
      startDate: "2025-08-08",
      habitat: "혼합",
      depth: 13,
      areaSize: "1,800㎡",
      center: [129.42, 37.01],
      stage: "모니터링 중",
    },
    transplant: [
      { name: "감태", count: 1838, area: "979㎡" },
      { name: "다시마", count: 651, area: "597㎡" },
      { name: "곰피", count: 302, area: "278㎡" },
    ],
    growth: {
      attachment: [59, 65, 70, 75, 80, 83],
      survival: [88, 87, 86, 85, 84, 83],
      growthMM: [1.08, 1.3, 1.62, 1.94, 2.16, 2.48],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 5, inverts: 9 },
      after: { fish: 12, inverts: 17 },
      shannon: { before: 1.06, after: 1.76 },
    },
    water: [
      { month: "‘25.01", temp: 9.5, do: 8.2, nutrient: 0.27 },
      { month: "02", temp: 10.0, do: 8.0, nutrient: 0.25 },
      { month: "03", temp: 11.3, do: 7.8, nutrient: 0.23 },
      { month: "04", temp: 13.8, do: 7.6, nutrient: 0.21 },
      { month: "05", temp: 16.3, do: 7.5, nutrient: 0.2 },
    ],
    media: [
      { label: "2025.08", url: IMG },
      { label: "2025.09", url: IMG },
      { label: "2025.10", url: IMG },
      { label: "2025.11", url: IMG },
    ],
  },

  "uljin-6": {
    basic: {
      startDate: "2025-07-10",
      habitat: "암반",
      depth: 6,
      areaSize: "1,520㎡",
      center: [129.46, 36.98],
      stage: "이식 완료",
    },
    transplant: [
      { name: "감태", count: 1575, area: "824㎡" },
      { name: "다시마", count: 567, area: "515㎡" },
      { name: "곰피", count: 252, area: "227㎡" },
    ],
    growth: {
      attachment: [64, 69, 74, 82, 88, 92],
      survival: [91, 90, 89, 88, 87, 86],
      growthMM: [1.19, 1.51, 1.84, 2.16, 2.48, 2.7],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 6, inverts: 10 },
      after: { fish: 14, inverts: 21 },
      shannon: { before: 1.19, after: 1.97 },
    },
    water: [
      { month: "‘25.01", temp: 9.9, do: 8.3, nutrient: 0.25 },
      { month: "02", temp: 10.4, do: 8.1, nutrient: 0.23 },
      { month: "03", temp: 11.8, do: 7.9, nutrient: 0.21 },
      { month: "04", temp: 14.3, do: 7.7, nutrient: 0.2 },
      { month: "05", temp: 16.7, do: 7.6, nutrient: 0.19 },
    ],
    media: [
      { label: "2025.07", url: IMG },
      { label: "2025.08", url: IMG },
      { label: "2025.09", url: IMG },
      { label: "2025.10", url: IMG },
    ],
  },

  "uljin-7": {
    basic: {
      startDate: "2024-11-28",
      habitat: "암반",
      depth: 12,
      areaSize: "1,980㎡",
      center: [129.42, 37.05],
      stage: "안정화 구역",
    },
    transplant: [
      { name: "감태", count: 2106, area: "1,051㎡" },
      { name: "다시마", count: 735, area: "670㎡" },
      { name: "곰피", count: 346, area: "319㎡" },
    ],
    growth: {
      attachment: [71, 76, 81, 86, 90, 93],
      survival: [93, 92, 91, 90, 89, 88],
      growthMM: [1.51, 1.84, 2.16, 2.48, 2.76, 3.02],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 8, inverts: 12 },
      after: { fish: 16, inverts: 23 },
      shannon: { before: 1.33, after: 2.1 },
    },
    water: [
      { month: "‘25.01", temp: 10.2, do: 8.5, nutrient: 0.24 },
      { month: "02", temp: 10.6, do: 8.3, nutrient: 0.22 },
      { month: "03", temp: 12.1, do: 8.1, nutrient: 0.2 },
      { month: "04", temp: 14.6, do: 7.9, nutrient: 0.19 },
      { month: "05", temp: 16.9, do: 7.7, nutrient: 0.18 },
    ],
    media: [
      { label: "2024.11", url: IMG },
      { label: "2024.12", url: IMG },
      { label: "2025.01", url: IMG },
      { label: "2025.02", url: IMG },
    ],
  },
};
