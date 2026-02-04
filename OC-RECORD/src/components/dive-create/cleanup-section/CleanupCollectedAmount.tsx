"use client";

import { useMemo, useRef, useState } from "react";
import { Scale } from "lucide-react";

import SelectCard from "@/components/ui/SelectCard";
import type { OcRecordForm } from "@/types/form";
import CheonjiinKeyboard from "@/components/keyboard/CheonjiinKeyboard";

type Props = {
  collectionAmount: OcRecordForm["cleanup"]["collectionAmount"];
  setCleanup: (patch: Partial<OcRecordForm["cleanup"]>) => void;
  maxLen?: number;
};

export default function CleanupCollectedAmount({
  collectionAmount,
  setCleanup,
  maxLen = 50,
}: Props) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const value = useMemo(() => collectionAmount ?? "", [collectionAmount]);

  const setValue = (next: string) => {
    const clipped = next.slice(0, maxLen);
    setCleanup({ collectionAmount: clipped });
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
