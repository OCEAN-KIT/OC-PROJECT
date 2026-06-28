"use client";

import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import { Activity } from "lucide-react";
import { useController } from "react-hook-form";

import type { GrazingDensity } from "@ocean-kit/submission-domain/types/form";
import type { SubmissionFormValues } from "../DiveFormProvider";

const DENSITIES: GrazingDensity[] = ["적음", "보통", "많음"];

export default function GrazingDensitySelector() {
  const { field } = useController<
    SubmissionFormValues,
    "grazing.densityBeforeWork"
  >({
    name: "grazing.densityBeforeWork",
  });

  return (
    <SelectCard
      title="작업 전 체감 밀도"
      icon={<Activity className="h-4 w-4 text-sky-600" />}
    >
      <OptionGrid<GrazingDensity>
        options={DENSITIES}
        value={field.value}
        columns={3}
        onChange={field.onChange}
      />
    </SelectCard>
  );
}
