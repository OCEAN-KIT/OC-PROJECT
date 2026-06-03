"use client";

import { ChevronsUpDown, RotateCcw } from "lucide-react";

export default function ControlsHeader({ open, setOpen, resetView }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <div className="text-sm font-semibold tracking-tight">
          작업영역 조회
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={resetView}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/20
                     bg-white/10 text-slate-100
                     hover:border-indigo-300/60 hover:bg-indigo-500/20"
          aria-label="초기 화면으로 이동"
          title="초기 화면"
        >
          <RotateCcw size={14} />
        </button>
        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/20
                     bg-white/10 text-slate-100
                     hover:border-indigo-300/60 hover:bg-indigo-500/20"
          aria-label={open ? "작업영역 패널 접기" : "작업영역 패널 펼치기"}
          title={open ? "접기" : "펼치기"}
        >
          <ChevronsUpDown size={14} />
        </button>
      </div>
    </div>
  );
}
