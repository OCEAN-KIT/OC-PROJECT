"use client";

import MultiOptionGrid from "@/components/ui/MultiOptionGrid";
import { Fish } from "lucide-react";

import type { OcRecordForm, GrazingTarget } from "@/types/form";

const GRAZING_TARGETS: GrazingTarget[] = [
  "성게",
  "소라",
  "전복",
  "불가사리",
  "기타",
];

type Props = {
  targets: OcRecordForm["grazing"]["targets"];
  setGrazing: (patch: Partial<OcRecordForm["grazing"]>) => void;
};

export default function GrazingTargetSelector({ targets, setGrazing }: Props) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <Fish className="h-4 w-4 text-sky-600" />
        <div className="flex items-center gap-2">
          <h2 className="text-[14px] font-semibold text-gray-800">대상 생물</h2>
          <span className="text-[11px] text-gray-400">복수 선택 가능</span>
        </div>
      </div>

      <MultiOptionGrid<GrazingTarget>
        options={GRAZING_TARGETS}
        value={targets}
        columns={3}
        onChange={(selected) => setGrazing({ targets: selected })}
      />
    </section>
  );
}
