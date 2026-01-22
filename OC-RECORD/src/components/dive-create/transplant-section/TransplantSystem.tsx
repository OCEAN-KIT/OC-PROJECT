"use client";

import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import { Network } from "lucide-react";

import type { OcRecordForm, TransplantSystem } from "@/types/form";

type Props = {
  transplantSystem: OcRecordForm["transplant"]["transplantSystem"];
  setTransplant: (patch: Partial<OcRecordForm["transplant"]>) => void;
};

const TRANSPLANT_SYSTEMS: TransplantSystem[] = [
  "로프 연승",
  "종자 직접 이식",
  "이식용 모듈",
  "기타",
];

export default function TransplantSystemSelector({
  transplantSystem,
  setTransplant,
}: Props) {
  return (
    <SelectCard
      title="이식 방식"
      icon={<Network className="h-4 w-4 text-sky-600" />}
    >
      <OptionGrid<TransplantSystem>
        options={TRANSPLANT_SYSTEMS}
        value={transplantSystem}
        columns={2}
        onChange={(opt) => setTransplant({ transplantSystem: opt })}
      />
    </SelectCard>
  );
}
