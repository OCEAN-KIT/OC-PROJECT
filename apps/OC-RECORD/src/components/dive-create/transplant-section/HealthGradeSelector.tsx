"use client";

import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import { Activity } from "lucide-react";

import type { HealthGrade, OcRecordForm } from "@ocean-kit/submission-domain/types/form";

type Props = {
  healthStatus: OcRecordForm["transplant"]["healthStatus"];
  setTransplant: (patch: Partial<OcRecordForm["transplant"]>) => void;
};

const GRADES: HealthGrade[] = ["A", "B", "C", "D"];

export default function HealthGradeSelector({
  healthStatus,
  setTransplant,
}: Props) {
  return (
    <SelectCard
      title="건강 상태"
      icon={<Activity className="h-4 w-4 text-sky-600" />}
    >
      <OptionGrid<HealthGrade>
        options={GRADES}
        value={healthStatus}
        columns={4}
        onChange={(opt) => setTransplant({ healthStatus: opt })}
      />
    </SelectCard>
  );
}
