"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./header";
import TabsBar, { type TabKey } from "./tabs";
import OverviewTab from "./tabs/overview-tab";
import StatusTab from "./tabs/status-tab";
import EcologyTab from "./tabs/ecology-tab";
import EnvironmentTab from "./tabs/environment-tab";
import BeforeAfterCard from "./tabs/photos-tab/before-after-card";
import PhotoLightbox from "./tabs/photos-tab/photo-lightbox";
import TimelineView from "./tabs/photos-tab/timeline-view";
import type { PhotoPreview } from "./tabs/photos-tab/types";
import type { AreaDetail } from "@ocean-kit/dashboard-domain/types/areaDetail";
// import { revalidateFullRouteCache } from "@/server/revalidateFullRouteCache";

type Props = {
  areaId: number;
  area: AreaDetail;
};

export default function DetailInfoModal({ area }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("overview");
  const [preview, setPreview] = useState<PhotoPreview | null>(null);
  // const [isRefreshPending, startRefreshTransition] = useTransition();
  const closePreview = useCallback(() => setPreview(null), []);

  // const handleRefresh = useCallback(() => {
  //   startRefreshTransition(async () => {
  //     await revalidateFullRouteCache(`/detailInfo/${area.id}`);
  //     router.refresh();
  //   });
  // }, [area.id, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && router.back();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <div
      aria-modal
      role="dialog"
      className="fixed inset-0 z-100 flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-black/24 backdrop-blur-sm max-md:bg-black/30"
        onClick={() => router.back()}
      />

      <div className="relative z-10 w-[820px] max-w-[92vw] rounded-2xl text-white animate-popIn oc-detail-shell max-md:w-full max-md:h-full max-md:max-w-none max-md:rounded-none max-md:border-0 max-md:shadow-none">
        <div className="max-md:flex max-md:flex-col max-md:h-full">
          <Header
            overview={area.overview}
            // 데이터 정합성 확인 전까지 수동 revalidate 버튼 비활성화.
            // isRefreshing={isRefreshPending}
            // onRefresh={handleRefresh}
            onClose={() => router.back()}
          />

          <TabsBar active={tab} onChange={setTab} />

          <div className="p-5 space-y-2 max-md:px-4 max-md:pb-6 max-md:flex-1 max-md:overflow-y-auto">
            {tab === "overview" && <OverviewTab data={area} />}
            {tab === "status" && <StatusTab data={area} />}
            {tab === "ecology" && <EcologyTab data={area} />}
            {tab === "environment" && <EnvironmentTab data={area} />}
            {tab === "before-after" && (
              <BeforeAfterCard
                beforeUrl={area.photos.beforeUrl}
                afterUrl={area.photos.afterUrl}
                onOpenPhoto={setPreview}
              />
            )}
            {tab === "timeline" && (
              <TimelineView
                items={area.photos.timeline}
                onOpenPhoto={setPreview}
              />
            )}
          </div>
        </div>
      </div>

      <PhotoLightbox photo={preview} onClose={closePreview} />

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
