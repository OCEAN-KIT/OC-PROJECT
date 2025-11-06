"use client";

import { useMemo, useState } from "react";
import type { FilterState } from "@/components/filter-bar/types";
import FilterBar from "@/components/filter-bar/filter-bar";
import { Search } from "lucide-react";
import LoadintSpinner from "@/components/ui/loading-spinner";
import ReviewList from "@/components/review-list/review-list";
import ReviewBulkActions from "@/components/review-list/review-bulk-actions";
import { REVIEW_ITEMS } from "@/data/reviews";
// import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function HomePage() {
  // useAuthGuard({ mode: "gotoLogin" });

  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    dateFrom: null,
    dateTo: null,
    q: "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ 선택 상태를 상위에서 관리
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const total = REVIEW_ITEMS.length;
  const selectedCount = selected.size;
  const allSelected = useMemo(
    () => selectedCount > 0 && selectedCount === total,
    [selectedCount, total]
  );

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === total
        ? new Set()
        : new Set(REVIEW_ITEMS.map((r) => String(r.id)))
    );

  const handleBulkApprove = () => {
    const ids = Array.from(selected);
    console.log("[bulk approve]", ids);
    alert(`일괄 승인: ${ids.join(", ") || "-"}`);
    setSelected(new Set());
  };

  const handleBulkReject = () => {
    const ids = Array.from(selected);
    console.log("[bulk reject]", ids);
    alert(`일괄 반려: ${ids.join(", ") || "-"}`);
    setSelected(new Set());
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      console.log("검색 요청(실제 POST 예정):", filters);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="mx-auto max-w-[1500px]">
        {/* 🔹 같은 라인: 좌측 FilterBar, 우측 BulkActions */}
        <div className="flex flex-wrap items-center gap-3">
          <FilterBar value={filters} onChange={setFilters} />
          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white
                       px-4 text-sm font-medium text-[#34609E] hover:bg-gray-50 active:translate-y-[1px]
                       focus:outline-none"
          >
            {loading ? (
              <LoadintSpinner />
            ) : (
              <Search className="h-4 w-4" aria-hidden />
            )}
            {loading ? "검색 중…" : "검색"}
          </button>

          {/* ✅ 우측 정렬 */}
          <ReviewBulkActions
            className="ml-auto"
            total={total}
            selectedCount={selectedCount}
            allSelected={allSelected}
            onToggleAll={toggleAll}
            onBulkApprove={handleBulkApprove}
            onBulkReject={handleBulkReject}
          />
        </div>

        {/* 리스트 */}
        <div className="mt-4">
          <ReviewList selected={selected} onToggleOne={toggleOne} />
        </div>
      </div>
    </div>
  );
}
