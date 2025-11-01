// src/app/home/page.tsx
"use client";

import { useState } from "react";
import type { FilterState } from "@/components/filter-bar/types";
import FilterBar from "@/components/filter-bar/filter-bar";
import { Search } from "lucide-react";
import LoadintSpinner from "@/components/ui/loading-spinner";
// import axiosInstance from "@/utils/axiosInstance"; // 나중에 실제 POST에 사용

export default function HomePage() {
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    dateFrom: null,
    dateTo: null,
    q: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // TODO: API 붙일 때 여기서 POST
      // const res = await axiosInstance.post("/api/search", filters);
      // console.log(res.data);
      console.log("검색 요청(실제 POST 예정):", filters);
    } catch (e) {
      console.error("검색 에러:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex items-center justify-start gap-2">
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
        </div>
      </div>
    </div>
  );
}
