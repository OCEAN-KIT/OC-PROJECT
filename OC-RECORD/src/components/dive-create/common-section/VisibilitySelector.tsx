"use client";

import { Eye } from "lucide-react";
import type { OcRecordForm, Rating3 } from "@/types/form";

type Props = {
  visibility: OcRecordForm["env"]["visibility"];
  setEnv: (patch: Partial<OcRecordForm["env"]>) => void;
};

const OPTIONS: Rating3[] = ["나쁨", "보통", "좋음"];

export default function VisibilitySelector({ visibility, setEnv }: Props) {
  return (
    <section className="mb-7">
      <div className="flex items-center gap-2 mb-2">
        <Eye className="h-4 w-4 text-sky-600" />
        <h2 className="text-[14px] font-semibold text-gray-800">시야</h2>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map((opt) => {
          const active = visibility === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => setEnv({ visibility: opt })}
              className={[
                "h-10 rounded-xl font-semibold text-[13px] transition",
                active
                  ? "bg-white border border-sky-200 text-sky-700 ring-2 ring-sky-100"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              ].join(" ")}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </section>
  );
}
