"use client";

import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import { MapPin } from "lucide-react";

import type { OcRecordForm, TransplantPlace } from "@/types/form";

const TRANSPLANT_PLACES: TransplantPlace[] = ["어초", "암반", "기타"];

type Props = {
  transplantPlace: OcRecordForm["transplant"]["transplantPlace"];
  setTransplant: (patch: Partial<OcRecordForm["transplant"]>) => void;
};

export default function TransplantPlaceSelector({
  transplantPlace,
  setTransplant,
}: Props) {
  return (
    <SelectCard
      title="이식 장소"
      icon={<MapPin className="h-4 w-4 text-sky-600" />}
    >
      <OptionGrid<TransplantPlace>
        options={TRANSPLANT_PLACES}
        value={transplantPlace}
        columns={3}
        onChange={(opt) => setTransplant({ transplantPlace: opt })}
      />
    </SelectCard>
  );
}
