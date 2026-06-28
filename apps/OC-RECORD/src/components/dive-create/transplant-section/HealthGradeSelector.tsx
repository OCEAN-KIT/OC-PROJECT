"use client";

import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import { Activity } from "lucide-react";
import { useController } from "react-hook-form";

import type { HealthGrade } from "@ocean-kit/submission-domain/types/form";
import type { SubmissionFormValues } from "../DiveFormProvider";

const GRADES: HealthGrade[] = ["A", "B", "C", "D"];

export default function HealthGradeSelector() {
  const { field } = useController<
    SubmissionFormValues,
    "transplant.healthStatus"
  >({
    name: "transplant.healthStatus",
  });

  return (
    <SelectCard
      title="건강 상태"
      icon={<Activity className="h-4 w-4 text-sky-600" />}
    >
      <OptionGrid<HealthGrade>
        options={GRADES}
        value={field.value}
        columns={4}
        onChange={field.onChange}
      />
    </SelectCard>
  );
}
