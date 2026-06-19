"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import AreaItemCard from "./areaItemCard";

export default function AreaGroupsList({
  grouped,
  onSelectArea,
  activeRegion,
  areaLoading,
  areaLoadFailed,
  workingArea,
}) {
  const [expanded, setExpanded] = useState(() =>
    Object.fromEntries(grouped.map((g) => [g.stage, true])),
  );

  useEffect(() => {
    setExpanded(Object.fromEntries(grouped.map((g) => [g.stage, true])));
  }, [grouped, activeRegion]);

  const toggle = (stage) => setExpanded((s) => ({ ...s, [stage]: !s[stage] }));

  return (
    <div className="max-h-[56vh] overflow-auto px-2 py-2">
      {activeRegion ? (
        areaLoading ? (
          <div className="px-3 py-8 text-center text-sm text-indigo-100/70">
            작업영역 데이터를 불러오는 중입니다
          </div>
        ) : areaLoadFailed ? (
          <div className="px-3 py-8 text-center">
            <p className="text-sm font-semibold text-indigo-50">
              작업영역 데이터를 불러오지 못했습니다
            </p>
            <p className="mt-1 text-xs leading-relaxed text-indigo-100/64">
              잠시 후 다시 시도해주세요.
            </p>
          </div>
        ) : grouped.length ? (
          grouped.map((group) => {
            const isOpen = !!expanded[group.stage];
            return (
              <div key={group.stage} className="mb-2">
                <button
                  type="button"
                  onClick={() => toggle(group.stage)}
                  className="sticky top-0 z-10 -mx-2 flex w-[calc(100%+16px)] items-center justify-between
                             border-y border-white/15 bg-indigo-950/48 px-3 py-1.5 text-xs
                             tracking-wide text-indigo-50 hover:bg-indigo-900/55 transition"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: group.color }}
                    />
                    {group.stage} ({group.items.length})
                  </div>
                  <span className="text-indigo-100/60">
                    {isOpen ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-2 space-y-1">
                    {group.items.map((a) => (
                      <AreaItemCard
                        key={a.id}
                        area={a}
                        color={group.color}
                        onClick={() => onSelectArea(a)}
                        isActive={workingArea?.id === a.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="px-3 py-8 text-center text-sm text-indigo-100/70">
            조건에 맞는 작업영역이 없습니다
          </div>
        )
      ) : (
        <div className="px-3 py-8 text-center text-sm text-indigo-100/70">
          지역을 먼저 선택하세요
        </div>
      )}
    </div>
  );
}
