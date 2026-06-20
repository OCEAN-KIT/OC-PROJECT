"use client";

import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { AreaDetail } from "@ocean-kit/dashboard-domain/types/areaDetail";
import { getStageColor } from "@/constants/stageMeta";
import RefreshButton from "./refresh-button";

type Props = {
  overview: AreaDetail["overview"];
  onClose?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
};

export default function Header({
  overview,
  onClose,
  onRefresh,
  isRefreshing = false,
}: Props) {
  const router = useRouter();
  const startLine = `${overview.startDate[0]}.${overview.startDate[1]}.${overview.startDate[2]}`;
  const stageColor = getStageColor(overview.currentStatus.name);
  const stageDotStyle = { "--stage-color": stageColor } as CSSProperties;

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    router.back();
  };

  return (
    <div className="flex items-center justify-between p-5 pb-3 max-md:pt-4 max-md:pb-4">
      <div className="flex min-w-0 items-center gap-3 max-md:items-start max-md:gap-2">
        <button
          type="button"
          onClick={handleClose}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 hover:bg-indigo-500/22"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="h-[18px] w-[18px]" />
        </button>

        <div className="flex min-w-0 items-center gap-3 max-md:items-start">
          <div
            style={stageDotStyle}
            className="h-7 w-7 rounded-full ring-2 max-md:hidden
                       [background-color:color-mix(in_srgb,var(--stage-color)_38%,transparent)]
                       [--tw-ring-color:color-mix(in_srgb,var(--stage-color)_72%,white_28%)]"
          />
          <div className="min-w-0">
            <div className="truncate text-lg font-semibold">{overview.name}</div>
            <div className="text-xs text-indigo-100/78 md:hidden">
              {startLine} · {overview.habitatType} · {overview.avgDepth}m · 면적{" "}
              {overview.areaSize} m<sup>2</sup>
            </div>
            <div className="text-xs text-indigo-100/78 hidden md:block">
              복원 시작일 {startLine} · {overview.habitatType} ·{" "}
              {overview.avgDepth}m · 면적 {overview.areaSize} m<sup>2</sup>
            </div>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {onRefresh ? (
          <RefreshButton isRefreshing={isRefreshing} onRefresh={onRefresh} />
        ) : null}
        <button
          type="button"
          onClick={handleClose}
          className="rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-sm hover:bg-indigo-500/22 max-md:hidden"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
