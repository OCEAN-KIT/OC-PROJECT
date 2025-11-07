"use client";

import type { ActivityKind } from "@/types/activity";

export default function ActivityLabel({
  activity,
}: {
  activity: ActivityKind;
}) {
  return (
    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
      {labelActivity(activity)}
    </span>
  );
}

function labelActivity(a: ActivityKind) {
  switch (a) {
    case "Transplantation":
      return "이식";
    case "DebrisRemoval":
      return "폐기물 수거";
    case "Research":
      return "연구";
    case "Monitoring":
      return "모니터링";
    default:
      return "기타";
  }
}
