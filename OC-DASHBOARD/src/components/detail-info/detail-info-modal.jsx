"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AREA_DETAILS } from "@/constants/areaDetails";
import { AREA_DETAILS_AI } from "@/constants/areaDetails-ai";
import Header from "./header";
import TabsBar from "./tabs";
import OverviewTab from "./tabs/overview-tab";
import TransplantTab from "./tabs/transplant-tab";
import GrowthTab from "./tabs/growth-tab";
import BiodiversityTab from "./tabs/bio-diversity-tab";
import WaterTab from "./tabs/water-tab";
import MediaTab from "./tabs/media-tab";

export default function DetailInfoModal({ areaId }) {
  const router = useRouter();
  const [tab, setTab] = useState("overview");
  const [aiOn, setAiOn] = useState(false);
  const [frame, setFrame] = useState(0);
  const [loading, setLoading] = useState(false); // ⬅️ 추가

  const data = useMemo(() => {
    const src = aiOn ? AREA_DETAILS_AI : AREA_DETAILS;
    return src[areaId] ?? null;
  }, [aiOn, areaId]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && router.back();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  // AI 토글 핸들러(부모에서 처리)
  const handleToggleAI = async () => {
    if (loading) return;
    setLoading(true);

    // ⚠️ 임시 지연(Mock). 실제 API 연결 시:
    // 1) await fetch('/api/predict?areaId=...')
    // 2) 받은 결과를 상태/스토어에 반영
    // 3) setAiOn(true/false)로 소스 전환
    // 4) setLoading(false)
    await new Promise((r) => setTimeout(r, 1000));

    setAiOn((v) => !v);
    setLoading(false);
  };

  if (!data) {
    return (
      <div
        aria-modal
        role="dialog"
        className="fixed inset-0 z-100 flex items-center justify-center"
      >
        <div
          className="absolute inset-0 bg-black/55 backdrop-blur-sm"
          onClick={() => router.back()}
        />
        <div className="relative z-10 max-w-[92vw] rounded-2xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur-xl shadow-2xl">
          <div className="text-sm">데이터가 없습니다. (ID: {areaId})</div>
          <button
            className="mt-4 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm"
            onClick={() => router.back()}
          >
            닫기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-modal
      role="dialog"
      className="fixed inset-0 z-100 flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={() => router.back()}
      />

      <div className="relative z-10 w-[980px] max-w-[92vw] rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur-xl shadow-2xl animate-popIn">
        <Header
          areaId={areaId}
          basic={data.basic}
          aiOn={aiOn}
          loading={loading} // ⬅️ 추가
          onToggle={handleToggleAI} // ⬅️ 추가
          onClose={() => router.back()}
        />

        <div className="h-px w-full bg-white/10" />
        <TabsBar active={tab} onChange={setTab} />
        <div className="h-px w-full bg-white/10" />

        <div className="p-5 space-y-4">
          {tab === "overview" && <OverviewTab data={data} aiOn={aiOn} />}
          {tab === "transplant" && <TransplantTab data={data} />}
          {tab === "growth" && <GrowthTab data={data} aiOn={aiOn} />}
          {tab === "biodiversity" && <BiodiversityTab data={data} />}
          {tab === "water" && <WaterTab data={data} aiOn={aiOn} />}
          {tab === "media" && (
            <MediaTab media={data.media} frame={frame} setFrame={setFrame} />
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-popIn {
          animation: popIn 0.18s ease-out;
        }
      `}</style>
    </div>
  );
}
