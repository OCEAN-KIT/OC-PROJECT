"use client";

import { Gauge } from "lucide-react";
import type { OcRecordForm } from "@/types/form";
import { inputCls } from "../styles";

type Props = {
  avgDepthM: OcRecordForm["env"]["avgDepthM"];
  maxDepthM: OcRecordForm["env"]["maxDepthM"];
  waterTempC: OcRecordForm["env"]["waterTempC"];
  setEnv: (patch: Partial<OcRecordForm["env"]>) => void;
};

export default function DepthTempInput({
  avgDepthM,
  maxDepthM,
  waterTempC,
  setEnv,
}: Props) {
  return (
    <section className="mb-7">
      <div className="flex items-center gap-2 mb-3">
        <Gauge className="h-4 w-4 text-sky-600" />
        <h2 className="text-[14px] font-semibold text-gray-800">수심 / 수온</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* 평균수심 */}
        <label className="relative block">
          <input
            className={inputCls + " pr-12"}
            placeholder="평균 수심"
            value={avgDepthM}
            onChange={(e) => setEnv({ avgDepthM: e.target.value })}
            inputMode="decimal"
          />
          <span className="pointer-events-none absolute right-3 top-[13px] text-gray-500 select-none">
            m
          </span>
        </label>

        {/* 수온 (2행 차지) */}
        <label className="relative block row-span-2">
          <input
            className={
              inputCls +
              " peer pr-12 h-full w-full text-7xl text-center leading-none py-0 " +
              "placeholder:text-transparent"
            }
            placeholder="수온"
            value={waterTempC}
            onChange={(e) => setEnv({ waterTempC: e.target.value })}
            inputMode="decimal"
          />

          {/* 가짜 placeholder: 진짜 중앙 정렬 */}
          <span
            className="
      pointer-events-none absolute inset-0 pr-12
      grid place-items-center text-base text-gray-400
      opacity-0 transition-opacity
      peer-placeholder-shown:opacity-100
      peer-focus:opacity-0
    "
          >
            수온
          </span>

          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 select-none">
            °C
          </span>
        </label>

        {/* 최대수심 */}
        <label className="relative block">
          <input
            className={inputCls + " pr-12"}
            placeholder="최대 수심"
            value={maxDepthM}
            onChange={(e) => setEnv({ maxDepthM: e.target.value })}
            inputMode="decimal"
          />
          <span className="pointer-events-none absolute right-3 top-[13px] text-gray-500 select-none">
            m
          </span>
        </label>
      </div>
    </section>
  );
}
