"use client";

import { useRef, useState } from "react";
import { Scale } from "lucide-react";
import { useController } from "react-hook-form";

import SelectCard from "@/components/ui/SelectCard";
import type { SubmissionFormValues } from "../DiveFormProvider";
import CheonjiinKeyboardSheet from "../CheonjiinKeyboardSheet";

type Props = {
  maxLen?: number;
};

export default function CleanupCollectedAmount({ maxLen = 50 }: Props) {
  const { field } = useController<
    SubmissionFormValues,
    "cleanup.collectionAmount"
  >({
    name: "cleanup.collectionAmount",
  });
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const value = field.value ?? "";

  const setValue = (next: string) => {
    const clipped = next.slice(0, maxLen);
    field.onChange(clipped);
  };

  const openKeyboard = () => {
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.blur()); // 시스템 키보드 방지
  };

  const closeKeyboard = () => setOpen(false);

  return (
    <>
      <SelectCard
        title="수거량"
        icon={<Scale className="h-4 w-4 text-sky-600" />}
        required
      >
        <input
          ref={(element) => {
            inputRef.current = element;
            field.ref(element);
          }}
          className="w-full h-11 rounded-xl border border-gray-200 px-3 text-[14px] outline-none"
          value={value}
          readOnly
          inputMode="none"
          onBlur={field.onBlur}
          onFocus={openKeyboard}
          onClick={openKeyboard}
        />
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
