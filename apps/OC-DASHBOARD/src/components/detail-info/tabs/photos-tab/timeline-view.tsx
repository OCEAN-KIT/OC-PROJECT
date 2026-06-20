"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { keyToPublicUrl } from "@/utils/s3";
import PhotoFrame from "./photo-frame";
import type { OpenPhoto } from "./types";

type TimelineItem = {
  url: string;
  label: string;
  caption: string;
};

type Props = {
  items: TimelineItem[];
  onOpenPhoto: OpenPhoto;
};

export default function TimelineView({ items, onOpenPhoto }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const hasData = items.length > 0;
  const active = hasData ? items[activeIdx] : null;

  const [y, m, d] = active?.label?.split(".") ?? ["", "", ""];
  const dateText = [
    y ? `${y}년` : "",
    m ? `${m}월` : "",
    d ? `${d}일` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="min-h-[300px]">
      {hasData ? (
        <div className="flex min-h-0 flex-col gap-3">
          {dateText && (
            <div className="flex justify-end text-[12px] font-semibold text-indigo-50/85">
              {dateText}
            </div>
          )}

          {/* 메인 이미지 */}
          <PhotoFrame
            url={active?.url}
            alt={active?.caption || "타임라인 사진"}
            label={active?.caption}
            sizes="(max-width: 768px) 90vw, 520px"
            className="mx-auto aspect-[4/3] w-full max-w-[480px]"
            onOpen={onOpenPhoto}
          />

          {/* 타임라인 슬라이더 */}
          <div className="flex items-center gap-2">
            {/* 이전 버튼 */}
            <button
              type="button"
              onClick={() => setActiveIdx((p) => Math.max(0, p - 1))}
              disabled={activeIdx === 0}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/55 transition hover:bg-white/8 hover:text-white/85 disabled:cursor-default disabled:opacity-25"
              aria-label="이전 사진"
            >
              <ChevronLeft size={17} strokeWidth={2} />
            </button>

            {/* 썸네일 목록 */}
            <div className="flex-1 min-w-0 overflow-x-auto flex gap-1.5 scrollbar-hide">
              {items.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className={[
                    "flex shrink-0 flex-col items-center gap-1 rounded-md px-1 py-0.5 transition",
                    i === activeIdx
                      ? "opacity-100"
                      : "opacity-55 hover:bg-white/6 hover:opacity-85",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "relative w-10 h-7 rounded overflow-hidden bg-white/5",
                      i === activeIdx ? "ring-1 ring-indigo-200/70" : "",
                    ].join(" ")}
                  >
                    {item.url ? (
                      <Image
                        src={keyToPublicUrl(item.url)}
                        alt={item.label}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                  <span
                    className={[
                      "text-[9px] whitespace-nowrap",
                      i === activeIdx ? "text-white/80" : "text-white/40",
                    ].join(" ")}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* 다음 버튼 */}
            <button
              type="button"
              onClick={() =>
                setActiveIdx((p) => Math.min(items.length - 1, p + 1))
              }
              disabled={activeIdx === items.length - 1}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/55 transition hover:bg-white/8 hover:text-white/85 disabled:cursor-default disabled:opacity-25"
              aria-label="다음 사진"
            >
              <ChevronRight size={17} strokeWidth={2} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex min-h-[260px] items-center justify-center text-sm text-white/40">
          타임라인 데이터가 없습니다.
        </div>
      )}
    </div>
  );
}
