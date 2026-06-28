"use client";

import { useRef, useState } from "react";
import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import { MapPin } from "lucide-react";
import { useController } from "react-hook-form";

import type { GrazingScope } from "@ocean-kit/submission-domain/types/form";
import type { SubmissionFormValues } from "../DiveFormProvider";
import CheonjiinKeyboardSheet from "../CheonjiinKeyboardSheet";

const SCOPES: GrazingScope[] = ["국소", "구역", "광범위"];

type Props = {
  maxLen?: number;
};

export default function GrazingScopeSelector({ maxLen = 100 }: Props) {
  const { field: scopeField } = useController<
    SubmissionFormValues,
    "grazing.workScope"
  >({
    name: "grazing.workScope",
  });
  const { field: noteField } = useController<
    SubmissionFormValues,
    "grazing.note"
  >({
    name: "grazing.note",
  });
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const value = noteField.value ?? "";

  const setValue = (next: string) => {
    const clipped = next.slice(0, maxLen);
    noteField.onChange(clipped);
  };

  const openKeyboard = () => {
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.blur()); // 시스템 키보드 방지
  };

  const closeKeyboard = () => setOpen(false);

  return (
    <>
      <SelectCard
        title="작업 범위"
        icon={<MapPin className="h-4 w-4 text-sky-600" />}
      >
        <OptionGrid<GrazingScope>
          options={SCOPES}
          value={scopeField.value}
          columns={3}
          onChange={scopeField.onChange}
        />
        <div className="mt-3">
          <input
            ref={(element) => {
              inputRef.current = element;
              noteField.ref(element);
            }}
            className="w-full h-11 rounded-xl border border-gray-200 px-3 text-[14px] outline-none"
            placeholder="보충 설명 (선택)"
            value={value}
            readOnly
            inputMode="none"
            onBlur={noteField.onBlur}
            onFocus={openKeyboard}
            onClick={openKeyboard}
          />
        </div>
      </SelectCard>

      {open && (
        <CheonjiinKeyboardSheet
          baseValue={value}
          onChange={setValue}
          onClose={closeKeyboard}
        />
      )}
    </>
  );
}
