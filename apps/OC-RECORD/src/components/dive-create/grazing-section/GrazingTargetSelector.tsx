"use client";

import MultiOptionGrid from "@/components/ui/MultiOptionGrid";
import { Fish } from "lucide-react";
import { useController } from "react-hook-form";

import type { GrazingTarget } from "@ocean-kit/submission-domain/types/form";
import type { SubmissionFormValues } from "../DiveFormProvider";

const GRAZING_TARGETS: GrazingTarget[] = [
  "성게",
  "소라",
  "전복",
  "불가사리",
  "기타",
];

export default function GrazingTargetSelector() {
  const { field } = useController<
    SubmissionFormValues,
    "grazing.targetSpecies"
  >({
    name: "grazing.targetSpecies",
  });

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
        value={field.value}
        columns={3}
        onChange={field.onChange}
      />
    </section>
  );
}
