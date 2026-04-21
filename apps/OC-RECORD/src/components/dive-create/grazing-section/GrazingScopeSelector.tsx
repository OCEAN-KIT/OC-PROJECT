"use client";

import { useMemo, useRef, useState } from "react";
import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import { MapPin } from "lucide-react";

import type { OcRecordForm, GrazingScope } from "@ocean-kit/submission-domain/types/form";
import CheonjiinKeyboard from "@/components/keyboard/CheonjiinKeyboard";

const SCOPES: GrazingScope[] = ["국소", "구역", "광범위"];

type Props = {
  workScope: OcRecordForm["grazing"]["workScope"];
  note: OcRecordForm["grazing"]["note"];
  setGrazing: (patch: Partial<OcRecordForm["grazing"]>) => void;
  maxLen?: number;
};

export default function GrazingScopeSelector({
  workScope,
  note,
  setGrazing,
  maxLen = 100,
}: Props) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const value = useMemo(() => note ?? "", [note]);

  const setValue = (next: string) => {
    const clipped = next.slice(0, maxLen);
    setGrazing({ note: clipped });
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
          value={workScope}
          columns={3}
          onChange={(opt) => setGrazing({ workScope: opt })}
        />
        <div className="mt-3">
          <input
            ref={inputRef}
            className="w-full h-11 rounded-xl border border-gray-200 px-3 text-[14px] outline-none"
            placeholder="보충 설명 (선택)"
            value={value}
            readOnly
            inputMode="none"
            onFocus={openKeyboard}
            onClick={openKeyboard}
          />
        </div>
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
