"use client";

import { ClipboardList } from "lucide-react";
import { useController } from "react-hook-form";
import type { WorkType } from "@ocean-kit/submission-domain/types/form";
import type { SubmissionFormValues } from "../DiveFormProvider";
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

export default function WorkTypeSelector() {
  const { field } = useController<SubmissionFormValues, "basic.workType">({
    name: "basic.workType",
  });

  return (
    <SelectCard
      className="mb-7"
      title="작업 유형"
      icon={<ClipboardList className="h-4 w-4 text-sky-600" />}
    >
      <OptionGrid
        options={WORK_TYPES}
        value={field.value}
        columns={3}
        onChange={field.onChange}
      />
    </SelectCard>
  );
}
