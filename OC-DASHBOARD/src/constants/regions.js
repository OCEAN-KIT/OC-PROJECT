// 지역/작업영역 더미(확장 가능)
// center는 [lng, lat]
export const REGIONS = [
  {
    id: "pohang",
    label: "포항",
    center: [129.343, 36.019],
    areas: [
      { id: "pohang-1", label: "작업 영역 1", center: [129.37, 36.05] },
      { id: "pohang-2", label: "작업 영역 2", center: [129.33, 36.01] },
      { id: "pohang-3", label: "작업 영역 3", center: [129.3, 36.02] },
      { id: "pohang-4", label: "작업 영역 4", center: [129.41, 36.0] },
    ],
  },
  {
    id: "uljin",
    label: "울진",
    center: [129.409, 36.993],
    areas: [
      { id: "uljin-1", label: "작업 영역 1", center: [129.41, 36.98] },
      { id: "uljin-2", label: "작업 영역 2", center: [129.44, 36.99] },
      { id: "uljin-3", label: "작업 영역 3", center: [129.39, 37.02] },
    ],
  },
  // 필요 시 지역 계속 추가…
];
