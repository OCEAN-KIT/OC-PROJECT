"use client";

import { Gauge } from "lucide-react";
import { useController } from "react-hook-form";
import type { SubmissionFormValues } from "../DiveFormProvider";
import { inputCls } from "../styles";

export default function DepthTempInput() {
  const { field: avgDepthField } = useController<
    SubmissionFormValues,
    "env.avgDepthM"
  >({
    name: "env.avgDepthM",
  });
  const { field: maxDepthField } = useController<
    SubmissionFormValues,
    "env.maxDepthM"
  >({
    name: "env.maxDepthM",
  });
  const { field: waterTempField } = useController<
    SubmissionFormValues,
    "env.waterTempC"
  >({
    name: "env.waterTempC",
  });

  return (
    <section className="mb-7">
      <div className="flex items-center gap-2 mb-3">
        <Gauge className="h-4 w-4 text-sky-600" />
        <h2 className="text-[14px] font-semibold text-gray-800">수심 / 수온</h2>
        <span className="text-[11px] text-red-400 ml-auto">필수 입력</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* 평균수심 */}
        <label className="relative block">
          <input
            ref={avgDepthField.ref}
            className={inputCls + " pr-12"}
            placeholder="평균 수심"
            value={avgDepthField.value}
            onBlur={avgDepthField.onBlur}
            onChange={avgDepthField.onChange}
            inputMode="decimal"
          />
          <span className="pointer-events-none absolute right-3 top-[13px] text-gray-500 select-none">
            m
          </span>
        </label>

        {/* 수온 (2행 차지) */}
        <label className="relative block row-span-2">
          <input
            ref={waterTempField.ref}
            className={
              inputCls +
              " peer pr-12 h-full w-full text-7xl text-center leading-none py-0 " +
              "placeholder:text-transparent"
            }
            placeholder="수온"
            value={waterTempField.value}
            onBlur={waterTempField.onBlur}
            onChange={waterTempField.onChange}
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
            ref={maxDepthField.ref}
            className={inputCls + " pr-12"}
            placeholder="최대 수심"
            value={maxDepthField.value}
            onBlur={maxDepthField.onBlur}
            onChange={maxDepthField.onChange}
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
