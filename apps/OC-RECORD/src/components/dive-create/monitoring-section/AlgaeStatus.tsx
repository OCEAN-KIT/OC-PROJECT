"use client";

import { useRef, useState } from "react";
import { Activity } from "lucide-react";
import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import CheonjiinKeyboard from "@/components/keyboard/CheonjiinKeyboard";

import type { OcRecordForm, AlgaeCondition } from "@/types/form";

const ALGAE_CONDITIONS: AlgaeCondition[] = ["양호", "쇠약", "탈락"];

type Props = {
  monitoring: OcRecordForm["monitoring"];
  setMonitoring: (patch: Partial<OcRecordForm["monitoring"]>) => void;
};

export default function AlgaeStatus({ monitoring, setMonitoring }: Props) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openKeyboard = () => {
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.blur());
  };

  const closeKeyboard = () => setOpen(false);

  const setValue = (value: string) => {
    setMonitoring({ seaweedIdNumber: value.slice(0, 50) });
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
                ref={inputRef}
                className="w-full h-11 rounded-xl border border-gray-200 px-3 text-[14px] outline-none"
                value={monitoring.seaweedIdNumber}
                readOnly
                inputMode="none"
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
            value={monitoring.seaweedHealthStatus}
            columns={3}
            onChange={(opt) => setMonitoring({ seaweedHealthStatus: opt })}
          />
        </SelectCard>
      </div>

      {/* 키보드 */}
      {open && (
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
                onChange={setValue}
                initialValue={monitoring.seaweedIdNumber}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
