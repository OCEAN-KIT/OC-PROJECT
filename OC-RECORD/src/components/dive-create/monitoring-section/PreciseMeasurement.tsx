"use client";

import { useRef, useState } from "react";
import { Ruler } from "lucide-react";
import SelectCard from "@/components/ui/SelectCard";
import CheonjiinKeyboard from "@/components/keyboard/CheonjiinKeyboard";

import type { OcRecordForm } from "@/types/form";

type Props = {
  monitoring: OcRecordForm["monitoring"];
  setMonitoring: (patch: Partial<OcRecordForm["monitoring"]>) => void;
};

type TextFieldType = "leafLength" | "maxLeafWidth";

export default function PreciseMeasurement({
  monitoring,
  setMonitoring,
}: Props) {
  const [activeField, setActiveField] = useState<TextFieldType | null>(null);
  const inputRefs = {
    leafLength: useRef<HTMLInputElement | null>(null),
    maxLeafWidth: useRef<HTMLInputElement | null>(null),
  };

  const openKeyboard = (field: TextFieldType) => {
    setActiveField(field);
    requestAnimationFrame(() => inputRefs[field].current?.blur());
  };

  const closeKeyboard = () => setActiveField(null);

  const setValue = (field: TextFieldType, value: string) => {
    setMonitoring({ [field]: value.slice(0, 50) });
  };

  const togglePreciseMeasurement = () => {
    setMonitoring({
      precisionMeasurement: !monitoring.precisionMeasurement,
    });
  };

  return (
    <>
      <SelectCard
        title="정밀 측정"
        icon={<Ruler className="h-4 w-4 text-sky-600" />}
      >
        <div className="space-y-3">
          {/* 체크박스 */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={monitoring.precisionMeasurement}
              onChange={togglePreciseMeasurement}
              className="w-4 h-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
            />
            <span className="text-[14px] text-gray-700">
              정밀 측정 개체 있음
            </span>
          </label>

          {/* 조건부 입력 필드 */}
          {monitoring.precisionMeasurement && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[12px] text-gray-600 mb-1.5">
                  엽장
                </label>
                <input
                  ref={inputRefs.leafLength}
                  className="w-full h-11 rounded-xl border border-gray-200 px-3 text-[14px] outline-none"
                  value={monitoring.leafLength}
                  readOnly
                  inputMode="none"
                  onFocus={() => openKeyboard("leafLength")}
                  onClick={() => openKeyboard("leafLength")}
                />
              </div>
              <div>
                <label className="block text-[12px] text-gray-600 mb-1.5">
                  최대엽폭
                </label>
                <input
                  ref={inputRefs.maxLeafWidth}
                  className="w-full h-11 rounded-xl border border-gray-200 px-3 text-[14px] outline-none"
                  value={monitoring.maxLeafWidth}
                  readOnly
                  inputMode="none"
                  onFocus={() => openKeyboard("maxLeafWidth")}
                  onClick={() => openKeyboard("maxLeafWidth")}
                />
              </div>
            </div>
          )}
        </div>
      </SelectCard>

      {/* 키보드 */}
      {activeField && (
        <>
          <div
            className="fixed inset-0 z-40"
            onMouseDown={closeKeyboard}
            onTouchStart={closeKeyboard}
          />

          <div className="fixed left-0 right-0 bottom-0 z-50">
            <div
              className="mx-auto max-w-105 bg-white"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <CheonjiinKeyboard
                onChange={(val: string) => setValue(activeField, val)}
                initialValue={monitoring[activeField]}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
