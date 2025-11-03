"use client";
import EChart from "./EChart";

export default function DonutBasic({ labels, values, height = 220 }) {
  const option = {
    tooltip: { trigger: "item" },
    legend: {
      bottom: 0,
      icon: "circle",
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: "#6b6e77", fontSize: 12 },
    },

    series: [
      {
        type: "pie",
        // 도넛을 위로 올리고, 아래 공간을 남겨 범례가 더 아래에 있는 것처럼 보이게
        top: 8, // 필요하면 -4 ~ 8 범위로 미세조정
        bottom: 20, // ← 아래 여백 확보 (범례 자리)
        center: ["50%", "53%"], // ← 도넛 중심을 위로
        radius: ["45%", "80%"],
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        data: labels.map((name, i) => ({ name, value: values[i] })),
      },
    ],
  };
  return <EChart option={option} height={height} />;
}
