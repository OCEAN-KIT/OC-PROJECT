"use client";

import type { FilterState } from "./types";
import type { Dispatch, SetStateAction } from "react";

type Props = {
  value: FilterState;
  onChange: Dispatch<SetStateAction<FilterState>>;
  className?: string;
};

export default function FilterBar({ value, onChange, className }: Props) {
  const set = (patch: Partial<FilterState>) =>
    onChange((prev) => ({ ...prev, ...patch }));

  return (
    <div className={`flex flex-wrap items-center  gap-4 ${className ?? ""}`}>
      {/* 상태 */}
      <select
        value={value.status}
        onChange={(e) =>
          set({ status: e.target.value as FilterState["status"] })
        }
        className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm"
      >
        <option value="all">전체</option>
        <option value="pending">검수대기</option>
        <option value="approved">승인</option>
        <option value="rejected">반려</option>
      </select>

      {/* 등록 기간 */}
      <div className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm">
        <span className="text-gray-500">등록 기간</span>
        <input
          type="date"
          value={value.dateFrom ?? ""}
          max={value.dateTo ?? undefined}
          onChange={(e) => set({ dateFrom: e.target.value || null })}
          className="bg-transparent outline-none"
        />
        <span className="select-none text-gray-300">~</span>
        <input
          type="date"
          value={value.dateTo ?? ""}
          min={value.dateFrom ?? undefined}
          onChange={(e) => set({ dateTo: e.target.value || null })}
          className="bg-transparent outline-none"
        />
      </div>

      {/* 검색 */}
      <input
        placeholder="검색(현장명 또는 담당자로 검색)"
        value={value.q}
        onChange={(e) => set({ q: e.target.value })}
        className="h-10 w-[320px] rounded-xl border border-gray-200 bg-white px-4 text-sm"
      />
    </div>
  );
}
