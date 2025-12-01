// components/watch/WatchDataList.tsx
"use client";

import WatchDataCard from "./WatchDataCard";
import { WATCH_DATA } from "@/data/watch-data";
import { Watch as WatchIcon } from "lucide-react";

export default function WatchDataList() {
  const dives = [...WATCH_DATA].sort((a, b) => b.startTime - a.startTime);

  return (
    <div className="space-y-3 px-2 pt-2">
      {/* 상단 라벨 영역 */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-start gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
            <WatchIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-semibold text-gray-900">
              다이빙 내역
            </span>
            <span className="text-[11px] text-gray-500">
              가민 워치에서 자동으로 동기화된 최근 다이빙 기록입니다.
            </span>
          </div>
        </div>
        <span className="text-[11px] text-gray-500">총 {dives.length}회</span>
      </div>

      {/* 개별 카드 리스트 */}
      <section className="space-y-2">
        {dives.map((dive) => (
          <WatchDataCard key={dive.id} dive={dive} />
        ))}
      </section>
    </div>
  );
}
