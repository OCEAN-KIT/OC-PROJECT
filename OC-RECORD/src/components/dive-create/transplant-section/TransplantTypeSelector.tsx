"use client";

import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import { Sprout } from "lucide-react";
import { cardCls } from "../styles";

import type { OcRecordForm, TransplantType } from "@/types/form";

const TRANSPLANT_TYPES: TransplantType[] = [
  "감태",
  "다시마",
  "곰피",
  "모자반",
  "대황",
  "기타",
];

type Props = {
  transplantType: OcRecordForm["transplant"]["transplantType"];
  setTransplant: (patch: Partial<OcRecordForm["transplant"]>) => void;
};

export default function TransplantTypeSelector({
  transplantType,
  setTransplant,
}: Props) {
  return (
    <SelectCard
      className={cardCls}
      title="이식 대상 종류"
      icon={<Sprout className="h-4 w-4 text-sky-600" />}
    >
      <OptionGrid<TransplantType>
        options={TRANSPLANT_TYPES}
        value={transplantType}
        columns={3}
        onChange={(opt) => setTransplant({ transplantType: opt })}
      />
    </SelectCard>
  );
}
