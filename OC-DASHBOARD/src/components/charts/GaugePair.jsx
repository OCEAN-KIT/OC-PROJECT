// componenets/charts/GaugePair.jsx
"use client";
import EChart from "./EChart";

export default function GaugePair({
  left,
  right,
  height = 240,
  defaultMax = 3,
}) {
  // ✅ 방어적 머지: undefined여도 안전
  const L = {
    label: "전",
    value: 0,
    max: defaultMax,
    ...(left ?? {}),
  };
  const R = {
    label: "후",
    value: 0,
    max: defaultMax,
    ...(right ?? {}),
  };

  const option = {
    series: [
      {
        type: "gauge",
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: L.max ?? defaultMax,
        splitNumber: 3,
        center: ["25%", "55%"],
        radius: "70%",
        axisLine: { lineStyle: { width: 10 } },
        pointer: { show: true },
        title: { offsetCenter: [0, "70%"], color: "#ddd", fontSize: 12 },
        detail: { valueAnimation: true, formatter: "{value}", fontSize: 16 },
        data: [{ value: L.value, name: L.label }],
      },
      {
        type: "gauge",
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: R.max ?? defaultMax,
        splitNumber: 3,
        center: ["75%", "55%"],
        radius: "70%",
        axisLine: { lineStyle: { width: 10 } },
        pointer: { show: true },
        title: { offsetCenter: [0, "70%"], color: "#ddd", fontSize: 12 },
        detail: { valueAnimation: true, formatter: "{value}", fontSize: 16 },
        data: [{ value: R.value, name: R.label }],
      },
    ],
  };

  return <EChart option={option} height={height} />;
}
