"use client";

import { useRef, useState } from "react";
import { Activity } from "lucide-react";
import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import { useController } from "react-hook-form";
import CheonjiinKeyboardSheet from "../CheonjiinKeyboardSheet";

import type { AlgaeCondition } from "@ocean-kit/submission-domain/types/form";
import type { SubmissionFormValues } from "../DiveFormProvider";

const ALGAE_CONDITIONS: AlgaeCondition[] = ["양호", "쇠약", "탈락"];

export default function AlgaeStatus() {
  const { field: seaweedIdField } = useController<
    SubmissionFormValues,
    "monitoring.seaweedIdNumber"
  >({
    name: "monitoring.seaweedIdNumber",
  });
  const { field: seaweedHealthField } = useController<
    SubmissionFormValues,
    "monitoring.seaweedHealthStatus"
  >({
    name: "monitoring.seaweedHealthStatus",
  });
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openKeyboard = () => {
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.blur());
  };

  const closeKeyboard = () => setOpen(false);

  const setValue = (value: string) => {
    seaweedIdField.onChange(value.slice(0, 50));
  };

  return (
    <>
      <div className="space-y-4">
        {/* 측정 식별번호 */}
        <SelectCard
          title="해조류 상태"
          icon={<Activity className="h-4 w-4 text-sky-600" />}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-[12px] text-gray-600 mb-1.5">
                측정 식별번호
              </label>
              <input
                ref={(element) => {
                  inputRef.current = element;
                  seaweedIdField.ref(element);
                }}
                className="w-full h-11 rounded-xl border border-gray-200 px-3 text-[14px] outline-none"
                value={seaweedIdField.value}
                readOnly
                inputMode="none"
                onBlur={seaweedIdField.onBlur}
                onFocus={openKeyboard}
                onClick={openKeyboard}
              />
            </div>
          </div>
        </SelectCard>

        {/* 생육 상태 */}
        <SelectCard title="생육 상태">
          <OptionGrid<AlgaeCondition>
            options={ALGAE_CONDITIONS}
            value={seaweedHealthField.value}
            columns={3}
            onChange={seaweedHealthField.onChange}
          />
        </SelectCard>
      </div>

      {/* 키보드 */}
      {open && (
        <CheonjiinKeyboardSheet
          baseValue={seaweedIdField.value}
          onChange={setValue}
          onClose={closeKeyboard}
        />
      )}
    </>
  );
}
