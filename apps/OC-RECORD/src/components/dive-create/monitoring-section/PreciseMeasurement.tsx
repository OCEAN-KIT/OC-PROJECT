"use client";

import { useRef, useState } from "react";
import { Ruler } from "lucide-react";
import SelectCard from "@/components/ui/SelectCard";
import { useController } from "react-hook-form";
import CheonjiinKeyboardSheet from "../CheonjiinKeyboardSheet";

import type { SubmissionFormValues } from "../DiveFormProvider";

type TextFieldType = "leafLength" | "maxLeafWidth";

export default function PreciseMeasurement() {
  const { field: precisionField } = useController<
    SubmissionFormValues,
    "monitoring.precisionMeasurement"
  >({
    name: "monitoring.precisionMeasurement",
  });
  const { field: leafLengthField } = useController<
    SubmissionFormValues,
    "monitoring.leafLength"
  >({
    name: "monitoring.leafLength",
  });
  const { field: maxLeafWidthField } = useController<
    SubmissionFormValues,
    "monitoring.maxLeafWidth"
  >({
    name: "monitoring.maxLeafWidth",
  });
  const [activeField, setActiveField] = useState<TextFieldType | null>(null);
  const inputRefs = {
    leafLength: useRef<HTMLInputElement | null>(null),
    maxLeafWidth: useRef<HTMLInputElement | null>(null),
  };
  const textFields = {
    leafLength: leafLengthField,
    maxLeafWidth: maxLeafWidthField,
  };

  const openKeyboard = (field: TextFieldType) => {
    setActiveField(field);
    requestAnimationFrame(() => inputRefs[field].current?.blur());
  };

  const closeKeyboard = () => setActiveField(null);

  const setValue = (field: TextFieldType, value: string) => {
    textFields[field].onChange(value.slice(0, 50));
  };

  const togglePreciseMeasurement = () => {
    precisionField.onChange(!precisionField.value);
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
              checked={precisionField.value}
              onChange={togglePreciseMeasurement}
              onBlur={precisionField.onBlur}
              className="w-4 h-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
            />
            <span className="text-[14px] text-gray-700">
              정밀 측정 개체 있음
            </span>
          </label>

          {/* 조건부 입력 필드 */}
          {precisionField.value && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[12px] text-gray-600 mb-1.5">
                  엽장
                </label>
                <input
                  ref={(element) => {
                    inputRefs.leafLength.current = element;
                    leafLengthField.ref(element);
                  }}
                  className="w-full h-11 rounded-xl border border-gray-200 px-3 text-[14px] outline-none"
                  value={leafLengthField.value}
                  readOnly
                  inputMode="none"
                  onBlur={leafLengthField.onBlur}
                  onFocus={() => openKeyboard("leafLength")}
                  onClick={() => openKeyboard("leafLength")}
                />
              </div>
              <div>
                <label className="block text-[12px] text-gray-600 mb-1.5">
                  최대엽폭
                </label>
                <input
                  ref={(element) => {
                    inputRefs.maxLeafWidth.current = element;
                    maxLeafWidthField.ref(element);
                  }}
                  className="w-full h-11 rounded-xl border border-gray-200 px-3 text-[14px] outline-none"
                  value={maxLeafWidthField.value}
                  readOnly
                  inputMode="none"
                  onBlur={maxLeafWidthField.onBlur}
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
        <CheonjiinKeyboardSheet
          key={activeField}
          baseValue={textFields[activeField].value}
          onChange={(value) => setValue(activeField, value)}
          onClose={closeKeyboard}
        />
      )}
    </>
  );
}
