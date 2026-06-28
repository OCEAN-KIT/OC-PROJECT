"use client";

import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import { Layers } from "lucide-react";
import { useController } from "react-hook-form";

import type { SubstrateTarget } from "@ocean-kit/submission-domain/types/form";
import type { SubmissionFormValues } from "../DiveFormProvider";

const SUBSTRATE_TARGETS: SubstrateTarget[] = ["암반", "어초", "구조물", "기타"];

export default function SubstrateTargetSelector() {
  const { field } = useController<
    SubmissionFormValues,
    "substrate.targetType"
  >({
    name: "substrate.targetType",
  });

  return (
    <SelectCard
      title="작업 대상"
      icon={<Layers className="h-4 w-4 text-sky-600" />}
    >
      <OptionGrid<SubstrateTarget>
        options={SUBSTRATE_TARGETS}
        value={field.value}
        columns={4}
        onChange={field.onChange}
      />
    </SelectCard>
  );
}
