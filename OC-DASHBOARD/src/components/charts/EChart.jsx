"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

export default function EChart({ option, height = 240, onEvents, style }) {
  // 기본 옵션(툴팁/애니메이션 등) + 전달된 옵션 merge
  const base = useMemo(
    () => ({
      animation: true,
      tooltip: { trigger: "item" },
      ...option,
    }),
    [option]
  );

  return (
    <ReactECharts
      option={base}
      notMerge={true}
      lazyUpdate={true}
      onEvents={onEvents}
      style={{ height, width: "100%", ...(style || {}) }}
    />
  );
}
