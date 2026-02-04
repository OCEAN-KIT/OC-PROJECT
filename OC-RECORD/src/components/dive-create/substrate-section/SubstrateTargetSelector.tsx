"use client";

import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import { Layers } from "lucide-react";

import type { OcRecordForm, SubstrateTarget } from "@/types/form";

const SUBSTRATE_TARGETS: SubstrateTarget[] = ["암반", "어초", "구조물", "기타"];

type Props = {
  targetType: OcRecordForm["substrate"]["targetType"];
  setSubstrate: (patch: Partial<OcRecordForm["substrate"]>) => void;
};

export default function SubstrateTargetSelector({
  targetType,
  setSubstrate,
}: Props) {
  return (
    <SelectCard
      title="작업 대상"
      icon={<Layers className="h-4 w-4 text-sky-600" />}
    >
      <OptionGrid<SubstrateTarget>
        options={SUBSTRATE_TARGETS}
        value={targetType}
        columns={4}
        onChange={(opt) => setSubstrate({ targetType: opt })}
      />
    </SelectCard>
  );
}
