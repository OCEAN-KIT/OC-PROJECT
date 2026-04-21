"use client";

import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import { MapPin } from "lucide-react";

import type { OcRecordForm, TransplantPlace } from "@ocean-kit/submission-domain/types/form";

const TRANSPLANT_PLACES: TransplantPlace[] = ["어초", "암반", "기타"];

type Props = {
  locationType: OcRecordForm["transplant"]["locationType"];
  setTransplant: (patch: Partial<OcRecordForm["transplant"]>) => void;
};

export default function TransplantPlaceSelector({
  locationType,
  setTransplant,
}: Props) {
  return (
    <SelectCard
      title="이식 장소"
      icon={<MapPin className="h-4 w-4 text-sky-600" />}
    >
      <OptionGrid<TransplantPlace>
        options={TRANSPLANT_PLACES}
        value={locationType}
        columns={3}
        onChange={(opt) => setTransplant({ locationType: opt })}
      />
    </SelectCard>
  );
}
