"use client";

import MultiOptionGrid from "@/components/ui/MultiOptionGrid";
import { Trash2 } from "lucide-react";

import type { OcRecordForm, CleanupType } from "@ocean-kit/submission-domain/types/form";

const CLEANUP_TYPES: CleanupType[] = [
  "그물",
  "통발",
  "기타 어구",
  "낚시도구",
  "플라스틱",
  "기타",
];

type Props = {
  wasteTypes: OcRecordForm["cleanup"]["wasteTypes"];
  setCleanup: (patch: Partial<OcRecordForm["cleanup"]>) => void;
};

export default function CleanupTypeSelector({ wasteTypes, setCleanup }: Props) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <Trash2 className="h-4 w-4 text-sky-600" />
        <div className="flex items-center gap-2">
          <h2 className="text-[14px] font-semibold text-gray-800">유형</h2>
          <span className="text-[11px] text-gray-400">복수 선택 가능</span>
        </div>
      </div>

      <MultiOptionGrid<CleanupType>
        options={CLEANUP_TYPES}
        value={wasteTypes}
        columns={3}
        onChange={(selected) => setCleanup({ wasteTypes: selected })}
      />
    </section>
  );
}
