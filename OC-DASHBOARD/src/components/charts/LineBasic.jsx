"use client";
import EChart from "./EChart";

export default function LineBasic({
  categories, // ["‘25.01", "02", ...]
  series, // [{ name:"성장률", data:[...]}] (1~N개)
  smooth = true,
  height = 260,
}) {
  const option = {
    tooltip: { trigger: "axis" },
    grid: { left: 16, right: 24, top: 24, bottom: 24, containLabel: true },
    xAxis: { type: "category", data: categories, boundaryGap: false },
    yAxis: { type: "value" },
    dataZoom: [{ type: "inside" }],
    series: series.map((s) => ({
      type: "line",
      name: s.name,
      data: s.data,
      smooth,
      symbol: "circle",
      symbolSize: 6,
      areaStyle: s.area ? {} : undefined, // 필요 시 영역 채우기
    })),
  };
  return <EChart option={option} height={height} />;
}
