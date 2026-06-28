"use client";

import MultiOptionGrid from "@/components/ui/MultiOptionGrid";
import { Trash2 } from "lucide-react";
import { useController } from "react-hook-form";

import type { CleanupType } from "@ocean-kit/submission-domain/types/form";
import type { SubmissionFormValues } from "../DiveFormProvider";

const CLEANUP_TYPES: CleanupType[] = [
  "그물",
  "통발",
  "기타 어구",
  "낚시도구",
  "플라스틱",
  "기타",
];

export default function CleanupTypeSelector() {
  const { field } = useController<
    SubmissionFormValues,
    "cleanup.wasteTypes"
  >({
    name: "cleanup.wasteTypes",
  });

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
        value={field.value}
        columns={3}
        onChange={field.onChange}
      />
    </section>
  );
}
