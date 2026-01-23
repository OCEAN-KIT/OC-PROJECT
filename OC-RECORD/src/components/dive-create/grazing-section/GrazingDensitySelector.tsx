"use client";

import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import { Activity } from "lucide-react";

import type { OcRecordForm, GrazingDensity } from "@/types/form";

const DENSITIES: GrazingDensity[] = ["적음", "보통", "많음"];

type Props = {
  density: OcRecordForm["grazing"]["density"];
  setGrazing: (patch: Partial<OcRecordForm["grazing"]>) => void;
};

export default function GrazingDensitySelector({ density, setGrazing }: Props) {
  return (
    <SelectCard
      title="작업 전 체감 밀도"
      icon={<Activity className="h-4 w-4 text-sky-600" />}
    >
      <OptionGrid<GrazingDensity>
        options={DENSITIES}
        value={density}
        columns={3}
        onChange={(opt) => setGrazing({ density: opt })}
      />
    </SelectCard>
  );
}
