"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AREA_DETAILS, DEFAULT_DETAIL } from "@/constants/areaDetails";
import Header from "./header";
import TabsBar, { TABS } from "./tabs";
import OverviewTab from "./tabs/overview-tab";
import TransplantTab from "./tabs/transplant-tab";
import GrowthTab from "./tabs/growth-tab";
import BiodiversityTab from "./tabs/bio-diversity-tab";
import WaterTab from "./tabs/water-tab";
import MediaTab from "./tabs/media-tab";

export default function DetailInfoModal({ areaId }) {
  const router = useRouter();
  const [tab, setTab] = useState("overview");
  const [aiOn, setAiOn] = useState(true);
  const [frame, setFrame] = useState(0);

  const data = AREA_DETAILS[areaId] ?? DEFAULT_DETAIL;

  // Esc 닫기
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && router.back();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <div
      aria-modal
      role="dialog"
      className="fixed inset-0 z-[100] flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={() => router.back()}
      />

      <div className="relative z-10 w-[980px] max-w-[92vw] rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur-xl shadow-2xl animate-popIn">
        {/* 헤더 */}
        <Header
          areaId={areaId}
          basic={data.basic}
          aiOn={aiOn}
          setAiOn={setAiOn}
          onClose={() => router.back()}
        />

        <div className="h-px w-full bg-white/10" />

        {/* 탭 바 */}
        <TabsBar active={tab} onChange={setTab} />

        <div className="h-px w-full bg-white/10" />

        {/* 탭 컨텐츠 */}
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
