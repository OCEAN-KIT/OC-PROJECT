"use client";

import { useMemo, useState } from "react";
import { ClipLoader } from "react-spinners";
import { AREA_DETAILS } from "@/constants/areaDetails";
import { AREA_DETAILS_AI } from "@/constants/areaDetails-ai";
import TransplantTab from "./tabs/transplant-tab";
import GrowthTab from "./tabs/growth-tab";
import BiodiversityTab from "./tabs/bio-diversity-tab";
import WaterTab from "./tabs/water-tab";

export default function DetailInfo({ areaId }) {
  const [aiOn, setAiOn] = useState(false);
  const [loading, setLoading] = useState(false);

  // aiOn 여부에 따라 데이터 소스 전환
  const data = useMemo(() => {
    const src = aiOn ? AREA_DETAILS_AI : AREA_DETAILS;
    return src[areaId] ?? null;
  }, [aiOn, areaId]);

  const headerInfo = useMemo(() => {
    const b = data?.basic;
    if (!b) return "데이터 없음";
    return `복원 시작일 ${b.startDate} · ${b.habitat} · ${b.depth}m · 면적 ${b.areaSize}`;
  }, [data]);

  // AI 토글 + 로딩(Mock 1초) — 나중에 실제 API로 교체
  const handleToggleAI = async () => {
    if (loading) return;
    setLoading(true);

    // ⚠️ 임시 지연. 실제 연결 시:
    // const res = await fetch(`/api/predict?areaId=${areaId}`);
    // const predicted = await res.json();
    // 상태에 반영한 뒤 setAiOn(true/false)
    await new Promise((r) => setTimeout(r, 1000));

    setAiOn((v) => !v);
    setLoading(false);
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-transparent text-white flex items-center justify-center">
        <div className="rounded-xl border border-white/15 bg-white/10 px-6 py-5 backdrop-blur-md">
          <div className="text-sm">데이터가 없습니다. (ID: {areaId})</div>
          <a
            href="/"
            className="mt-4 inline-flex items-center rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
          >
            지도 보기로 돌아가기
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white">
      {/* 헤더 */}
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
                onClick={handleToggleAI}
                disabled={loading}
                aria-busy={loading}
                className={[
                  "h-8 px-3 rounded-full text-xs border transition inline-flex items-center justify-center min-w-24",
                  aiOn
                    ? "border-cyan-400/60 bg-cyan-400/20"
                    : "border-white/10 bg-white/10 hover:bg-white/15",
                  loading ? "opacity-70 cursor-not-allowed" : "",
                ].join(" ")}
                title="AI 기반 예측값 보기"
              >
                {loading ? (
                  <ClipLoader size={16} color="#FFFFFF" />
                ) : aiOn ? (
                  "AI 예측 ON"
                ) : (
                  "AI 예측 OFF"
                )}
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

      {/* 본문 */}
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
