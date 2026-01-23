"use client";

import { useState } from "react";
import { Eye, ChevronDown } from "lucide-react";
import type { OcRecordForm, Rating3 } from "@/types/form";

type Props = {
  visibility: OcRecordForm["env"]["visibility"];
  setEnv: (patch: Partial<OcRecordForm["env"]>) => void;
};

const OPTIONS: Rating3[] = ["나쁨", "보통", "좋음"];

export default function VisibilitySelector({ visibility, setEnv }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {open && (
        <div
          className="fixed inset-0 z-40"
          onMouseDown={() => setOpen(false)}
          onTouchStart={() => setOpen(false)}
        />
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "relative z-50 w-full rounded-2xl border bg-white px-2 py-2 text-left",
          "transition active:translate-y-px",
          open
            ? "border-sky-200 ring-2 ring-sky-100"
            : "border-gray-200 hover:bg-gray-50",
        ].join(" ")}
      >
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-800">
          <Eye className="h-4 w-4 text-sky-600" />
          <span className="truncate">시야</span>
        </div>

        <div className="mt-1 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-sky-700 truncate">
            {visibility}
          </span>
          <ChevronDown
            className={[
              "h-4 w-4 text-gray-400 transition",
              open ? "rotate-180" : "",
            ].join(" ")}
          />
        </div>
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 mt-2 z-50 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-1 gap-2">
            {OPTIONS.map((opt) => {
              const active = visibility === opt;

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setEnv({ visibility: opt });
                    setOpen(false);
                  }}
                  className={[
                    "h-14 w-full rounded-2xl px-4",
                    "text-[15px] font-semibold transition",
                    "active:translate-y-px",
                    active
                      ? "bg-white border border-sky-200 text-sky-700 ring-2 ring-sky-100"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                  ].join(" ")}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
