"use client";

import { useMemo, useRef, useState } from "react";
import ControlsHeader from "./controlsHeader";
import RegionSelector from "./regionSelector";
import AreaGroupsList from "./areaGroupList";
import { STAGE_META, STAGE_ORDER } from "@/constants/stageMeta";
import Image from "next/image";
import StageFilter from "./stageFilter";
import SearchBox from "./searchBox";
import BottomSheet, { SNAP_PEEK, SNAP_HALF } from "@/components/ui/BottomSheet";
import { Search } from "lucide-react";

export default function TopRightControls({
  currentLocation,
  areas,
  workingArea,
  activeStage,
  setActiveStage,
  areaLoading,
  areaLoadFailed,
  onSelectRegion,
  onSelectArea,
  resetView,
}) {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [mobileSnap, setMobileSnap] = useState(SNAP_PEEK);
  const searchRef = useRef(null);

  const handleRegion = (region) => {
    onSelectRegion(region);
  };

  const handleArea = (area) => {
    onSelectArea(area);
  };

  const grouped = useMemo(() => {
    if (!areas.length) return [];
    const q = query.trim().toLowerCase();

    const items = areas.filter((a) => {
      const hitStage = activeStage ? a.level === activeStage : true;
      const hitQuery = q
        ? (a.name ?? "").toLowerCase().includes(q) ||
          (a.habitat ?? "").toLowerCase().includes(q)
        : true;
      return hitStage && hitQuery;
    });

    return STAGE_ORDER.map((stage) => ({
      stage,
      color: STAGE_META[stage]?.color,
      items: items.filter((a) => a.level === stage),
    })).filter((g) => g.items.length > 0);
  }, [areas, activeStage, query]);

  return (
    <>
      {/* ═══════════ 데스크탑: 기존 우상단 패널 ═══════════ */}
      <div
        className="pointer-events-auto fixed right-4 top-4 z-50 hidden w-[460px]
                   max-w-[92vw] text-[var(--ds-text)] md:block"
        aria-label="해역/작업영역 컨트롤"
      >
        <div className="oc-panel overflow-hidden rounded-2xl">
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center gap-2">
              <Image
                src="/dashboard/oceanCampusLogo.png"
                alt="Ocean Campus"
                width={20}
                height={20}
                className="h-5 w-5 object-contain"
                priority
              />
              <p className="text-sm font-semibold tracking-tight text-slate-50">
                해역별 복원 현황
              </p>
            </div>
          </div>

          <div className="oc-soft-divider h-px w-full" />

          <ControlsHeader open={open} setOpen={setOpen} resetView={resetView} />

          {open && (
            <>
              <div className="px-4 pt-2">
                <div className="flex items-center gap-3">
                  <RegionSelector
                    activeId={currentLocation?.id}
                    onSelect={handleRegion}
                  />
                  <div className="min-w-[150px] flex-1">
                    <SearchBox value={query} onChange={setQuery} />
                  </div>
                </div>
              </div>

              <div className="px-4 py-3">
                <StageFilter
                  activeStage={activeStage}
                  setActiveStage={setActiveStage}
                  stageMeta={STAGE_META}
                />
              </div>

              <div className="oc-soft-divider h-px w-full" />

              <AreaGroupsList
                grouped={grouped}
                onSelectArea={handleArea}
                activeRegion={!!currentLocation}
                areaLoading={areaLoading}
                areaLoadFailed={areaLoadFailed}
                workingArea={workingArea}
              />
            </>
          )}
        </div>
      </div>

      {/* ═══════════ 모바일: 바텀시트 ═══════════ */}
      <div className="md:hidden">
        <BottomSheet snap={mobileSnap} onSnapChange={setMobileSnap}>
          {(snap) => (
            <>
              {/* 미니 헤더 (항상 표시) */}
              <div className="flex h-12 shrink-0 items-center justify-between px-4">
                <RegionSelector
                  activeId={currentLocation?.id}
                  onSelect={handleRegion}
                />
                <button
                  className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                             border border-white/20 bg-white/10 text-slate-100
                             hover:border-indigo-300/60 hover:bg-indigo-500/20 transition"
                  onClick={() => {
                    if (snap <= SNAP_PEEK) setMobileSnap(SNAP_HALF);
                    setTimeout(() => searchRef.current?.focus(), 350);
                  }}
                  aria-label="검색"
                >
                  <Search size={16} />
                </button>
              </div>

              {/* 확장 시 표시 */}
              {snap > SNAP_PEEK && (
                <>
                  <div className="px-4 pt-1 pb-2">
                    <SearchBox
                      ref={searchRef}
                      value={query}
                      onChange={setQuery}
                    />
                  </div>
                  <div className="px-4 pb-2">
                    <StageFilter
                      activeStage={activeStage}
                      setActiveStage={setActiveStage}
                      stageMeta={STAGE_META}
                    />
                  </div>
                  <div className="oc-soft-divider h-px w-full" />
                </>
              )}

              {/* 리스트 (Half 이상) */}
              {snap >= SNAP_HALF && (
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <AreaGroupsList
                    grouped={grouped}
                    onSelectArea={handleArea}
                    activeRegion={!!currentLocation}
                    areaLoading={areaLoading}
                    areaLoadFailed={areaLoadFailed}
                    workingArea={workingArea}
                  />
                </div>
              )}
            </>
          )}
        </BottomSheet>
      </div>
    </>
  );
}
