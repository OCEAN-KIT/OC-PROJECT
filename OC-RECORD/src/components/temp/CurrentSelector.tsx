"use client";

import { Waves } from "lucide-react";
import type { CurrentStrength, OcRecordForm } from "@/types/form";
import { cardCls } from "../dive-create/styles";

type Props = {
  current: OcRecordForm["env"]["current"];
  setEnv: (patch: Partial<OcRecordForm["env"]>) => void;
};

const OPTIONS: CurrentStrength[] = ["잔잔", "중간", "강함"];

export default function CurrentSelector({ current, setEnv }: Props) {
  return (
    <section className={cardCls}>
      <div className="flex items-center gap-2 mb-2">
        <Waves className="h-4 w-4 text-sky-600" />
        <h2 className="text-[14px] font-semibold text-gray-800">조류</h2>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map((opt) => {
          const active = current === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => setEnv({ current: opt })}
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
