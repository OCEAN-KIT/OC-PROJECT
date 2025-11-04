// src/constants/area-details.js

// 모든 이미지 임시로 동일 경로 사용
const IMG = "/images/underSea.jpg";

// 공통 기본값 (없는 id용 fallback)
export const DEFAULT_DETAIL = {
  basic: {
    startDate: "2025-07-15",
    habitat: "암반",
    depth: 10,
    areaSize: "2,300㎡",
    center: [129.501, 36.071],
    stage: "안정화 구역",
  },
  transplant: [
    //*이식 해조류 - 종류별이식개채수: 막대차트, 이식면적분포: 도넛차트
    { name: "감태", count: 2300, area: "1,200㎡" },
    { name: "다시마", count: 800, area: "700㎡" },
    { name: "곰피", count: 450, area: "400㎡" },
  ],
  growth: {
    //*성장 - 착생률, 생존률, 성장률: 시계열 그래프
    attachment: [62, 66, 72, 78, 80, 82],
    survival: [90, 89, 88, 86, 85, 84],
    growthMM: [1.1, 1.3, 1.6, 1.9, 2.2, 2.4],
    months: ["‘25.01", "02", "03", "04", "05", "06"],
  },
  biodiversity: {
    //*생물다양성 - 전후종수비교: 막대그래프, 샤논지수: 지수비교차트
    before: { fish: 6, inverts: 11 },
    after: { fish: 12, inverts: 19 },
    shannon: { before: 1.21, after: 1.84 },
  },
  water: [
    //*수질 - 수온: 라인차트, 용존산소: 라인차트, 영얌염류: 라인차트
    { month: "‘25.01", temp: 9.8, do: 8.5, nutrient: 0.28 },
    { month: "02", temp: 10.1, do: 8.3, nutrient: 0.25 },
    { month: "03", temp: 11.5, do: 8.1, nutrient: 0.23 },
    { month: "04", temp: 13.9, do: 7.9, nutrient: 0.22 },
    { month: "05", temp: 16.4, do: 7.7, nutrient: 0.21 },
  ],
  media: [
    { label: "2025.07", url: "/images/sea1.jpeg" },
    { label: "2025.08", url: "/images/sea2.jpeg" },
    { label: "2025.09", url: "/images/sea3.jpeg" },
    { label: "2025.10", url: "/images/sea4.jpeg" },
  ],
};

// 개별 ID별로 필요한 값만 덮어쓰기
export const AREA_DETAILS = {
  "pohang-3": {
    ...DEFAULT_DETAIL,
    basic: {
      ...DEFAULT_DETAIL.basic,
      startDate: "2025-06-20",
      depth: 18,
      habitat: "모래",
      stage: "모니터링 중",
    },
  },
  "pohang-4": {
    ...DEFAULT_DETAIL,
    basic: {
      ...DEFAULT_DETAIL.basic,
      startDate: "2024-11-10",
      depth: 10,
      habitat: "암반",
      stage: "안정화 구역",
    },
  },
  "uljin-1": {
    ...DEFAULT_DETAIL,
    basic: {
      ...DEFAULT_DETAIL.basic,
      startDate: "2025-07-30",
      depth: 7,
      habitat: "암반",
      stage: "성장 중",
    },
  },
  // 필요 시 계속 추가…
};
