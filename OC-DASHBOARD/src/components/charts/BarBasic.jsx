"use client";
import EChart from "./EChart";

export default function BarBasic({
  categories,
  values,
  label = "값",
  height = 240,
}) {
  const option = {
    tooltip: { trigger: "axis" },
    grid: { left: 16, right: 16, top: 24, bottom: 24, containLabel: true },
    xAxis: { type: "category", data: categories },
    yAxis: { type: "value" },
    series: [
      {
        type: "bar",
        name: label,
        data: values,
        barMaxWidth: 36,
        itemStyle: { borderRadius: [6, 6, 0, 0] },
      },
    ],
  };
  return <EChart option={option} height={height} />;
}
