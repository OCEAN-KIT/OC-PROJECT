"use client";

import { useCallback, useState } from "react";
import type { AreaDetail } from "@ocean-kit/dashboard-domain/types/areaDetail";
import BeforeAfterCard from "./before-after-card";
import PhotoLightbox from "./photo-lightbox";
import TimelineView from "./timeline-view";
import type { PhotoPreview } from "./types";

type Props = {
  data: AreaDetail;
};

const SUB_TABS = [
  { key: "before-after", label: "복원 전/후" },
  { key: "timeline", label: "타임라인" },
] as const;

type SubTabKey = (typeof SUB_TABS)[number]["key"];

export default function PhotosTab({ data }: Props) {
  const { photos } = data;
  const [subTab, setSubTab] = useState<SubTabKey>("before-after");
  const [preview, setPreview] = useState<PhotoPreview | null>(null);
  const closePreview = useCallback(() => setPreview(null), []);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        {SUB_TABS.map((tab, index) => {
          const active = subTab === tab.key;
          return (
            <div key={tab.key} className="flex items-center gap-3">
              {index > 0 && <span className="h-3 w-px bg-white/12" />}
              <button
                type="button"
                onClick={() => setSubTab(tab.key)}
                className={[
                  "relative pb-1 text-[12px] font-semibold transition",
                  active
                    ? "text-indigo-50"
                    : "text-indigo-100/45 hover:text-indigo-50/85",
                ].join(" ")}
              >
                {tab.label}
                {active && (
                  <span className="absolute inset-x-0 -bottom-px h-px bg-indigo-200/80" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {subTab === "before-after" && (
        <BeforeAfterCard
          beforeUrl={photos.beforeUrl}
          afterUrl={photos.afterUrl}
          onOpenPhoto={setPreview}
        />
      )}

      {subTab === "timeline" && (
        <TimelineView items={photos.timeline} onOpenPhoto={setPreview} />
      )}

      <PhotoLightbox photo={preview} onClose={closePreview} />
    </section>
  );
}
