"use client";

import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import { Sprout } from "lucide-react";

import type { TransplantType } from "@ocean-kit/submission-domain/types/form";
import { useController } from "react-hook-form";
import type { SubmissionFormValues } from "../DiveFormProvider";

const TRANSPLANT_TYPES: TransplantType[] = [
  "감태",
  "다시마",
  "곰피",
  "모자반",
  "대황",
  "기타",
];

export default function TransplantTypeSelector() {
  const { field } = useController<
    SubmissionFormValues,
    "transplant.speciesType"
  >({
    name: "transplant.speciesType",
  });

  return (
    <SelectCard
      title="이식 대상 종류"
      icon={<Sprout className="h-4 w-4 text-sky-600" />}
    >
      <OptionGrid<TransplantType>
        options={TRANSPLANT_TYPES}
        value={field.value}
        columns={3}
        onChange={field.onChange}
      />
    </SelectCard>
  );
}
