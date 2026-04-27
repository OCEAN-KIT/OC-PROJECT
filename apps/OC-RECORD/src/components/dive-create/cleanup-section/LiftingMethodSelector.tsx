"use client";

import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import { Truck } from "lucide-react";

import type { OcRecordForm, LiftingMethod } from "@ocean-kit/submission-domain/types/form";

const LIFTING_METHODS: LiftingMethod[] = ["수작업", "인양백", "크레인"];

type Props = {
  method: OcRecordForm["cleanup"]["method"];
  setCleanup: (patch: Partial<OcRecordForm["cleanup"]>) => void;
};

export default function LiftingMethodSelector({
  method,
  setCleanup,
}: Props) {
  return (
    <SelectCard
      title="인양 방식"
      icon={<Truck className="h-4 w-4 text-sky-600" />}
    >
      <OptionGrid<LiftingMethod>
        options={LIFTING_METHODS}
        value={method}
        columns={3}
        onChange={(opt) => setCleanup({ method: opt })}
      />
    </SelectCard>
  );
}
