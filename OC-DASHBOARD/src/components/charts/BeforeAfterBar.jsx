"use client";
import EChart from "./EChart";

/**
 * categories: ["어류", "무척추"]
 * before: [6, 11]
 * after:  [12, 19]
 */
export default function BeforeAfterBar({
  categories,
  before,
  after,
  height = 240,
}) {
  const option = {
    tooltip: { trigger: "axis" },
    legend: {
      top: 6,
      data: ["전", "후"],
      textStyle: { color: "#6b6e77" }, // ✅ legend 글자색
      inactiveColor: "#3a3d44", // (선택) 체크 해제 시 글자색
      // selected: { 전: true, 후: true }, // (선택) 기본 선택 상태
      icon: "roundRect",
      itemWidth: 20,
      itemHeight: 12,
      itemGap: 16,
    },
    grid: { left: 16, right: 16, top: 36, bottom: 24, containLabel: true },
    xAxis: { type: "category", data: categories },
    yAxis: { type: "value" },
    series: [
      { name: "전", type: "bar", data: before, barMaxWidth: 32 },
      { name: "후", type: "bar", data: after, barMaxWidth: 32 },
    ],
  };
  return <EChart option={option} height={height} />;
}
