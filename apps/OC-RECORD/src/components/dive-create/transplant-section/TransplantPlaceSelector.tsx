"use client";

import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import { MapPin } from "lucide-react";
import { useController } from "react-hook-form";

import type { TransplantPlace } from "@ocean-kit/submission-domain/types/form";
import type { SubmissionFormValues } from "../DiveFormProvider";

const TRANSPLANT_PLACES: TransplantPlace[] = ["어초", "암반", "기타"];

export default function TransplantPlaceSelector() {
  const { field } = useController<
    SubmissionFormValues,
    "transplant.locationType"
  >({
    name: "transplant.locationType",
  });

  return (
    <SelectCard
      title="이식 장소"
      icon={<MapPin className="h-4 w-4 text-sky-600" />}
    >
      <OptionGrid<TransplantPlace>
        options={TRANSPLANT_PLACES}
        value={field.value}
        columns={3}
        onChange={field.onChange}
      />
    </SelectCard>
  );
}
