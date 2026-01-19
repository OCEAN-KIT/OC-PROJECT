"use client";

import { Gauge } from "lucide-react";
import type { OcRecordForm } from "@/types/form";
import { cardCls, inputCls, labelCls } from "../dive-create/styles";

type Props = {
  avgDepthM: OcRecordForm["env"]["avgDepthM"];
  waterTempC: OcRecordForm["env"]["waterTempC"];
  setEnv: (patch: Partial<OcRecordForm["env"]>) => void;
};

export default function DepthTempInput({
  avgDepthM,
  waterTempC,
  setEnv,
}: Props) {
  return (
    <section className={cardCls}>
      <div className="flex items-center gap-2 mb-3">
        <Gauge className="h-4 w-4 text-sky-600" />
        <h2 className="text-[14px] font-semibold text-gray-800">수심 / 수온</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="relative block">
          <span className={labelCls}>평균 수심</span>
          <input
            className={inputCls + " pr-12"}
            placeholder="예: 8.5"
            value={avgDepthM}
            onChange={(e) => setEnv({ avgDepthM: e.target.value })}
            inputMode="decimal"
          />
          <span className="pointer-events-none absolute right-3 top-[38px] text-gray-500 select-none">
            m
          </span>
        </label>

        <label className="relative block">
          <span className={labelCls}>수온</span>
          <input
            className={inputCls + " pr-12"}
            placeholder="예: 18.2"
            value={waterTempC}
            onChange={(e) => setEnv({ waterTempC: e.target.value })}
            inputMode="decimal"
          />
          <span className="pointer-events-none absolute right-3 top-[38px] text-gray-500 select-none">
            °C
          </span>
        </label>
      </div>
    </section>
  );
}
