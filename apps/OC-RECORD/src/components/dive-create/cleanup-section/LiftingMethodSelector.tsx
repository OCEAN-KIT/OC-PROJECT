"use client";

import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import { Truck } from "lucide-react";
import { useController } from "react-hook-form";

import type { LiftingMethod } from "@ocean-kit/submission-domain/types/form";
import type { SubmissionFormValues } from "../DiveFormProvider";

const LIFTING_METHODS: LiftingMethod[] = ["수작업", "인양백", "크레인"];

export default function LiftingMethodSelector() {
  const { field } = useController<SubmissionFormValues, "cleanup.method">({
    name: "cleanup.method",
  });

  return (
    <SelectCard
      title="인양 방식"
      icon={<Truck className="h-4 w-4 text-sky-600" />}
    >
      <OptionGrid<LiftingMethod>
        options={LIFTING_METHODS}
        value={field.value}
        columns={3}
        onChange={field.onChange}
      />
    </SelectCard>
  );
}
