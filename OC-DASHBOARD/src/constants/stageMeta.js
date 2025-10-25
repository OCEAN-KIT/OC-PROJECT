// constants/stageMeta.js
export const STAGE_ORDER = [
  "모니터링 중",
  "안정화 구역",
  "성장 중",
  "이식 완료",
];

export const STAGE_META = {
  "모니터링 중": { color: "#10b981", slug: "monitoring" },
  "안정화 구역": { color: "#38bdf8", slug: "stable" },
  "성장 중": { color: "#f59e0b", slug: "growing" },
  "이식 완료": { color: "#a78bfa", slug: "transplanted" },
};

// stage → color 헬퍼
export const getStageColor = (stage) =>
  STAGE_META[stage]?.color ?? "rgba(255,255,255,.6)";
