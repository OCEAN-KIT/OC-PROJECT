"use client";

import { useMemo, useState } from "react";
import { REGIONS } from "@/constants/regions";

export default function TopRightControls({
  currentLocation,
  setCurrentLocation,
  workingArea,
  setWorkingArea,
}) {
  const [open, setOpen] = useState(true);

  // 현재 선택된 지역 객체
  const activeRegion = useMemo(() => {
    if (!currentLocation) return null;
    return REGIONS.find((r) => r.id === currentLocation.id) ?? null;
  }, [currentLocation]);

  // 지역 선택
  const handleRegion = (id) => {
    const selectedRegion = REGIONS.find((r) => r.id === id) ?? null;
    setCurrentLocation(selectedRegion);
    // 새 지역을 고르면 작업영역은 초기화
    setWorkingArea(null);
  };

  // 작업영역 선택
  const handleArea = (id) => {
    if (!activeRegion) return;
    const selectedArea = activeRegion.areas?.find((a) => a.id === id) ?? null;
    setWorkingArea(selectedArea);
  };

  return (
    <div
      className="
        pointer-events-auto fixed right-4 top-4 z-50
        rounded-2xl border border-white/10 bg-white/5
        backdrop-blur-xl shadow-lg text-white
        w-[400px] max-w-[86vw]
      "
      aria-label="지역/작업영역 컨트롤"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-wide">해역 선택</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">
            UI
          </span>
        </div>
        <button
          onClick={() => setOpen((s) => !s)}
          className="rounded-lg bg-white/5 px-2 py-1 text-xs hover:bg-white/10"
        >
          {open ? "접기" : "펼치기"}
        </button>
      </div>

      {open && (
        <>
          {/* 지역 스위처 */}
          <div className="px-3 pb-3">
            <div className="flex gap-2 overflow-x-auto pr-1">
              {REGIONS.map((r) => {
                const active = currentLocation?.id === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleRegion(r.id)}
                    className={[
                      "h-9 px-4 rounded-xl border text-sm font-semibold whitespace-nowrap transition",
                      active
                        ? "border-cyan-400/60 bg-cyan-400/20 shadow-[0_0_0_2px_rgba(34,211,238,0.25)_inset]"
                        : "border-white/10 bg-white/5 hover:bg-white/10",
                    ].join(" ")}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px w-full bg-white/10" />

          {/* 작업영역 스위처 */}
          <div className="px-3 py-3">
            <div className="mb-2 text-xs text-white/70">
              {activeRegion
                ? `${activeRegion.label}의 작업 영역`
                : "지역을 먼저 선택하세요"}
            </div>

            {activeRegion ? (
              <div className="flex gap-2 overflow-x-auto pb-1 pr-1">
                {(activeRegion.areas ?? []).map((a) => {
                  const active = workingArea?.id === a.id;
                  return (
                    <button
                      key={a.id}
                      onClick={() => handleArea(a.id)}
                      className={[
                        "h-8 min-w-8 px-3 rounded-full border text-sm transition whitespace-nowrap",
                        active
                          ? "border-emerald-400/60 bg-emerald-400/20 text-emerald-100"
                          : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10",
                      ].join(" ")}
                    >
                      {a.label}
                    </button>
                  );
                })}
                {(activeRegion.areas?.length ?? 0) === 0 && (
                  <div className="text-xs text-white/60">
                    등록된 작업 영역이 없습니다
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-white/50">
                지역 선택 후 작업영역을 설정하세요
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
