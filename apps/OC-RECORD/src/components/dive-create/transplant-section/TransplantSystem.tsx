"use client";

import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import { Network } from "lucide-react";
import { useController } from "react-hook-form";

import type { TransplantSystem } from "@ocean-kit/submission-domain/types/form";
import type { SubmissionFormValues } from "../DiveFormProvider";

const TRANSPLANT_SYSTEMS: TransplantSystem[] = [
  "로프 연승",
  "종자 직접 이식",
  "이식용 모듈",
  "기타",
];

export default function TransplantSystemSelector() {
  const { field } = useController<
    SubmissionFormValues,
    "transplant.methodType"
  >({
    name: "transplant.methodType",
  });

  return (
    <SelectCard
      title="이식 방식"
      icon={<Network className="h-4 w-4 text-sky-600" />}
    >
      <OptionGrid<TransplantSystem>
        options={TRANSPLANT_SYSTEMS}
        value={field.value}
        columns={2}
        onChange={field.onChange}
      />
    </SelectCard>
  );
}
