"use client";

import { useMemo, useRef, useState } from "react";
import { Maximize2 } from "lucide-react";

import SelectCard from "@/components/ui/SelectCard";
import type { OcRecordForm } from "@ocean-kit/submission-domain/types/form";
import CheonjiinKeyboard from "@/components/keyboard/CheonjiinKeyboard";

type Props = {
  workScope: OcRecordForm["substrate"]["workScope"];
  setSubstrate: (patch: Partial<OcRecordForm["substrate"]>) => void;
  maxLen?: number;
};

export default function SubstrateRange({
  workScope,
  setSubstrate,
  maxLen = 100,
}: Props) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const value = useMemo(() => workScope ?? "", [workScope]);

  const setValue = (next: string) => {
    const clipped = next.slice(0, maxLen);
    setSubstrate({ workScope: clipped });
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
        icon={<Maximize2 className="h-4 w-4 text-sky-600" />}
        required
      >
        <input
          ref={inputRef}
          className="w-full h-11 rounded-xl border border-gray-200 px-3 text-[14px] outline-none"
          value={value}
          readOnly
          aria-label="작업 범위"
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
