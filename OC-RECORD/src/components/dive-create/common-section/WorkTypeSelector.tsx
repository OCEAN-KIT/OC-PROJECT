"use client";

import { ClipboardList } from "lucide-react";
import type { OcRecordForm, WorkType } from "@/types/form";
import { cardCls } from "../styles";

const WORK_TYPES: WorkType[] = [
  "이식",
  "조식동물 작업",
  "부착기질 개선",
  "모니터링",
  "해양정화",
  "기타",
];

type Props = {
  workType: OcRecordForm["basic"]["workType"];
  setBasic: (patch: Partial<OcRecordForm["basic"]>) => void;
};

export default function WorkTypeSelector({ workType, setBasic }: Props) {
  return (
    <section className={cardCls}>
      <div className="flex items-center gap-2 mb-2">
        <ClipboardList className="h-4 w-4 text-sky-600" />
        <h2 className="text-[14px] font-semibold text-gray-800">작업 유형</h2>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {WORK_TYPES.map((opt) => {
          const active = workType === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => setBasic({ workType: opt })}
              className={[
                "h-10 rounded-xl text-[13px] font-semibold transition",
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
