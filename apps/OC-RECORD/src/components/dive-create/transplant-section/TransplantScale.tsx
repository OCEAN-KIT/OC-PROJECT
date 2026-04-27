"use client";

import { useMemo, useRef, useState } from "react";
import { Ruler } from "lucide-react";

import SelectCard from "@/components/ui/SelectCard";
import type { OcRecordForm } from "@ocean-kit/submission-domain/types/form";
import CheonjiinKeyboard from "@/components/keyboard/CheonjiinKeyboard";

type Props = {
  scale: OcRecordForm["transplant"]["scale"];
  setTransplant: (patch: Partial<OcRecordForm["transplant"]>) => void;
  placeholder?: string;
  maxLen?: number;
};

export default function TransplantScale({
  scale,
  setTransplant,
  maxLen = 40,
}: Props) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const value = useMemo(() => scale ?? "", [scale]);

  const setValue = (next: string) => {
    const clipped = next.slice(0, maxLen);
    setTransplant({ scale: clipped });
  };

  const openKeyboard = () => {
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.blur()); // 시스템 키보드 방지
  };

  const closeKeyboard = () => setOpen(false);

  return (
    <>
      <SelectCard
        title="이식 규모"
        icon={<Ruler className="h-4 w-4 text-sky-600" />}
        required
      >
        <input
          ref={inputRef}
          className="w-full h-11 rounded-xl border border-gray-200 px-3 text-[14px] outline-none"
          value={value}
          readOnly
          inputMode="none"
          onFocus={openKeyboard}
          onClick={openKeyboard}
        />
      </SelectCard>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onMouseDown={closeKeyboard}
            onTouchStart={closeKeyboard}
          />

          <div className="fixed left-0 right-0 bottom-0 z-50">
            <div
              className="mx-auto max-w-105  bg-white"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <CheonjiinKeyboard onChange={setValue} initialValue={value} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
