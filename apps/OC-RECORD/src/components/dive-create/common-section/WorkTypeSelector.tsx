"use client";

import { ClipboardList } from "lucide-react";
import type { OcRecordForm, WorkType } from "@ocean-kit/submission-domain/types/form";
import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";

const WORK_TYPES: WorkType[] = [
  "이식",
  "조식동물 작업",
  "부착기질 개선",
  "모니터링",
  "해양정화",
  "기타",
];

type Props = {
  workType: OcRecordForm["basic"]["workType"];
  setBasic: (patch: Partial<OcRecordForm["basic"]>) => void;
};

export default function WorkTypeSelector({ workType, setBasic }: Props) {
  return (
    <SelectCard
      className="mb-7"
      title="작업 유형"
      icon={<ClipboardList className="h-4 w-4 text-sky-600" />}
    >
      <OptionGrid
        options={WORK_TYPES}
        value={workType}
        columns={3}
        onChange={(opt) => setBasic({ workType: opt })}
      />
    </SelectCard>
  );
}
