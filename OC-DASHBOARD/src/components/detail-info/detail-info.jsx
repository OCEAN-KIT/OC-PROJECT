"use client";

import { useState, useMemo } from "react";
import { AREA_DETAILS, DEFAULT_DETAIL } from "@/constants/areaDetails";
import TransplantTab from "./tabs/transplant-tab";
import GrowthTab from "./tabs/growth-tab";
import BiodiversityTab from "./tabs/bio-diversity-tab";
import WaterTab from "./tabs/water-tab";

export default function DetailInfo({ areaId }) {
  const data = AREA_DETAILS[areaId] ?? DEFAULT_DETAIL;
  const [aiOn, setAiOn] = useState(false);

  const headerInfo = useMemo(() => {
    const b = data.basic;
    return `복원 시작일 ${b.startDate} · ${b.habitat} · ${b.depth}m · 면적 ${b.areaSize}`;
  }, [data]);

  return (
    <div className="min-h-screen bg-transparent text-white">
      <div className="sticky top-0 z-20 backdrop-blur-lg bg-black/25 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xl font-semibold">
                작업 영역 상세 (ID: {areaId})
              </div>
              <div className="text-xs text-white/70">{headerInfo}</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAiOn((s) => !s)}
                className={[
                  "h-8 px-3 rounded-full text-xs border transition",
                  aiOn
                    ? "border-cyan-400/60 bg-cyan-400/20"
                    : "border-white/10 bg-white/10 hover:bg-white/15",
                ].join(" ")}
                title="AI 기반 예측값 보기"
              >
                {aiOn ? "AI 예측 ON" : "AI 예측 OFF"}
              </button>
              <a
                href="/"
                className="h-8 px-3 rounded-md text-sm border border-white/10 bg-white/10 hover:bg-white/15 flex items-center"
              >
                지도 보기로 돌아가기
              </a>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-5 py-6 space-y-8">
        <section>
          <h2 className="mb-3 text-lg font-semibold">이식 해조류</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <TransplantTab data={data} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">성장</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <GrowthTab data={data} aiOn={aiOn} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">생물다양성</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <BiodiversityTab data={data} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">수질</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <WaterTab data={data} aiOn={aiOn} />
          </div>
        </section>

        <div className="h-8" />
      </main>
    </div>
  );
}
