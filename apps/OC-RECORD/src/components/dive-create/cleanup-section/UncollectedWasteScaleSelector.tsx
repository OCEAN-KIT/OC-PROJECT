"use client";

import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import { AlertTriangle } from "lucide-react";
import { useController } from "react-hook-form";

import type { UncollectedWasteScale } from "@ocean-kit/submission-domain/types/form";
import type { SubmissionFormValues } from "../DiveFormProvider";

const UNCOLLECTED_WASTE_SCALES: UncollectedWasteScale[] = ["소", "중", "대"];

export default function UncollectedWasteScaleSelector() {
  const { field } = useController<
    SubmissionFormValues,
    "cleanup.uncollectedScale"
  >({
    name: "cleanup.uncollectedScale",
  });

  return (
    <SelectCard
      title="미수거 폐기물 규모"
      icon={<AlertTriangle className="h-4 w-4 text-sky-600" />}
    >
      <OptionGrid<UncollectedWasteScale>
        options={UNCOLLECTED_WASTE_SCALES}
        value={field.value}
        columns={3}
        onChange={field.onChange}
      />
    </SelectCard>
  );
}
