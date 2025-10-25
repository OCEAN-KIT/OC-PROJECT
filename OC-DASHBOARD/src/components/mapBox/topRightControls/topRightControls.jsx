"use client";

import { useMemo, useState } from "react";
import { REGIONS } from "@/constants/regions";
import changeCameraView from "@/utils/map/changeCameraView";
import ControlsHeader from "./controlsHeader";
import SearchAndStageFilter from "./searchAndStageFilter";
import AreaGroupsList from "./areaGroupList";
import { STAGE_META, STAGE_ORDER } from "@/constants/stageMeta";

function daysAgo(area) {
  const iso = area.updatedAt ?? area.startDate;
  if (!iso) return null;
  const d = new Date(iso);
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / 86400000));
}

export default function TopRightControls({
  currentLocation,
  setCurrentLocation,
  workingArea,
  setWorkingArea,
  mapRef,
  activeStage,
  setActiveStage,
}) {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");

  const activeRegion = useMemo(() => {
    if (!currentLocation) return null;
    return REGIONS.find((r) => r.id === currentLocation.id) ?? null;
  }, [currentLocation]);

  const resetView = () => {
    if (!mapRef?.current) return;
    changeCameraView(mapRef.current, {
      center: [129.38, 36.5],
      zoom: 6.5,
      id: "overview",
    });
  };

  const handleRegion = (id) => {
    if (currentLocation?.id === id) {
      setCurrentLocation(null);
      setWorkingArea(null);
      resetView();
      return;
    }
    const selected = REGIONS.find((r) => r.id === id) ?? null;
    setCurrentLocation(selected);
    setWorkingArea(null);
    if (mapRef?.current && selected) changeCameraView(mapRef.current, selected);
  };

  const handleArea = (area) => {
    setWorkingArea(area);
    setActiveStage(area.stage);
    if (mapRef?.current && area) changeCameraView(mapRef.current, area);
  };

  // 검색/필터 → 단계별 그룹
  const grouped = useMemo(() => {
    if (!activeRegion) return [];
    const q = query.trim().toLowerCase();

    const items = (activeRegion.areas ?? []).filter((a) => {
      const hitStage = activeStage ? a.stage === activeStage : true;
      const hitQuery = q
        ? (a.label ?? "").toLowerCase().includes(q) ||
          (a.habitat ?? "").toLowerCase().includes(q)
        : true;
      return hitStage && hitQuery;
    });

    return STAGE_ORDER.map((stage) => ({
      stage,
      color: STAGE_META[stage]?.color,
      items: items.filter((a) => a.stage === stage),
    })).filter((g) => g.items.length > 0);
  }, [activeRegion, activeStage, query]);

  return (
    <div
      className="pointer-events-auto fixed right-4 top-4 z-50 w-[430px] max-w-[86vw]
                 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl
                 shadow-[0_8px_30px_rgba(0,0,0,0.25)] text-white"
      aria-label="해역/작업영역 컨트롤"
    >
      <ControlsHeader open={open} setOpen={setOpen} resetView={resetView} />

      {open && (
        <>
          <div className="px-4 pb-3">
            <div className="flex gap-2 overflow-x-auto pr-1">
              {REGIONS.map((r) => {
                const active = currentLocation?.id === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleRegion(r.id)}
                    className={`h-9 px-4 rounded-xl border text-sm font-semibold whitespace-nowrap transition
                      ${
                        active
                          ? "border-cyan-400/60 bg-cyan-400/20 shadow-[inset_0_0_0_2px_rgba(34,211,238,0.25)]"
                          : "border-white/10 bg-white/10 hover:bg-white/15"
                      }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px w-full bg-white/10" />

          <SearchAndStageFilter
            query={query}
            setQuery={setQuery}
            activeStage={activeStage}
            setActiveStage={setActiveStage}
            stageMeta={STAGE_META}
            activeRegion={activeRegion}
          />

          <div className="h-px w-full bg-white/10" />

          <AreaGroupsList
            grouped={grouped}
            onSelectArea={handleArea}
            stageMeta={STAGE_META}
            daysAgo={daysAgo}
            activeRegion={!!activeRegion}
          />
        </>
      )}
    </div>
  );
}
