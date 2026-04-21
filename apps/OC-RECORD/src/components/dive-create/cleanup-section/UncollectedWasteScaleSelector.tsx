"use client";

import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import { AlertTriangle } from "lucide-react";

import type { OcRecordForm, UncollectedWasteScale } from "@ocean-kit/submission-domain/types/form";

const UNCOLLECTED_WASTE_SCALES: UncollectedWasteScale[] = ["소", "중", "대"];

type Props = {
  uncollectedScale: OcRecordForm["cleanup"]["uncollectedScale"];
  setCleanup: (patch: Partial<OcRecordForm["cleanup"]>) => void;
};

export default function UncollectedWasteScaleSelector({
  uncollectedScale,
  setCleanup,
}: Props) {
  return (
    <SelectCard
      title="미수거 폐기물 규모"
      icon={<AlertTriangle className="h-4 w-4 text-sky-600" />}
    >
      <OptionGrid<UncollectedWasteScale>
        options={UNCOLLECTED_WASTE_SCALES}
        value={uncollectedScale}
        columns={3}
        onChange={(opt) => setCleanup({ uncollectedScale: opt })}
      />
    </SelectCard>
  );
}
