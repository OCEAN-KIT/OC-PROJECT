// components/watch/WatchDataCard.tsx
"use client";

import type { WatchDive, WatchActivity } from "@/data/watch-data";
import {
  Clock3,
  Activity as ActivityIcon,
  Watch as WatchIcon,
} from "lucide-react";

type Props = {
  dive: WatchDive;
};

function formatDateTimeRange(startMs: number, endMs: number) {
  const start = new Date(startMs);
  const end = new Date(endMs);

  const date = `${start.getFullYear()}.${String(start.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(start.getDate()).padStart(2, "0")}`;

  const timeRange = `${String(start.getHours()).padStart(2, "0")}:${String(
    start.getMinutes()
  ).padStart(2, "0")} ~ ${String(end.getHours()).padStart(2, "0")}:${String(
    end.getMinutes()
  ).padStart(2, "0")}`;

  return { date, timeRange };
}

function getActivityLabel(type: WatchActivity["activityType"]) {
  switch (type) {
    case "TRANSPLANT":
      return "해조 이식";
    case "URCHIN_REMOVAL":
      return "성게 제거";
    case "TRASH_COLLECTION":
      return "쓰레기 수거";
    case "OTHER":
    default:
      return "기타 활동";
  }
}

export default function WatchDataCard({ dive }: Props) {
  const { date, timeRange } = formatDateTimeRange(dive.startTime, dive.endTime);

  const activityLabels = Array.from(
    new Set(dive.activities.map((a) => getActivityLabel(a.activityType)))
  );

  const maxLabelsToShow = 2;
  const badgeText =
    activityLabels.length <= maxLabelsToShow
      ? activityLabels.join(" · ")
      : `${activityLabels.slice(0, maxLabelsToShow).join(" · ")} 외 ${
          activityLabels.length - maxLabelsToShow
        }종`;

  return (
    <button
      type="button"
      className="
        w-full bg-white
        px-4 py-3.5
        rounded-2xl border border-gray-200
        flex items-center justify-between gap-3
        text-left
        active:translate-y-[1px]
        transition
      "
    >
      <div className="flex flex-col gap-2 flex-1">
        {/* 상단: 좌측(날짜/시간) · 우측(활동 뱃지) */}
        <div className="flex items-start justify-between gap-3">
          {/* 날짜/시간 – 메인 정보 */}
          <div className="flex flex-col gap-1">
            <p className="text-[15px] font-semibold text-gray-900">{date}</p>
            <p className="flex items-center gap-1.5 text-[12px] text-gray-700">
              <Clock3 className="h-3.5 w-3.5 text-gray-400" />
              <span>{timeRange}</span>
            </p>
          </div>

          {/* 활동 요약 뱃지 */}
          <div className="flex items-start">
            <span
              className="
                inline-flex items-center gap-1
                rounded-full bg-blue-50
                px-2.5 py-[4px]
                text-[11px] text-blue-700
                max-w-[140px]
                justify-end
              "
            >
              <ActivityIcon className="h-3 w-3" />
              <span className="truncate">{badgeText}</span>
            </span>
          </div>
        </div>

        {/* 하단: 연동 시계 정보 (하드코딩) */}
        <p className="flex items-center gap-1.5 text-[11px] text-gray-500">
          <WatchIcon className="h-3.5 w-3.5 text-gray-400" />
          <span>연동 시계 · Garmin Descent Mk2i</span>
        </p>
      </div>
    </button>
  );
}
