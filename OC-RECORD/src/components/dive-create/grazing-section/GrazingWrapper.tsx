"use client";

import type { OcRecordForm } from "@/types/form";
import GrazingTargetSelector from "./GrazingTargetSelector";
import GrazingDensitySelector from "./GrazingDensitySelector";
import GrazingScopeSelector from "./GrazingScopeSelector";
import GrazingCollectedAmount from "./GrazingCollectedAmount";

type Props = {
  form: OcRecordForm;
  setTransplant: (patch: Partial<OcRecordForm["transplant"]>) => void;
  setGrazing: (patch: Partial<OcRecordForm["grazing"]>) => void;
};

export default function GrazingWrapper({ form, setGrazing }: Props) {
  return (
    <>
      <GrazingTargetSelector
        targets={form.grazing.targets}
        setGrazing={setGrazing}
      />
      <GrazingDensitySelector
        density={form.grazing.density}
        setGrazing={setGrazing}
      />
      <GrazingScopeSelector
        scope={form.grazing.scope}
        scopeNote={form.grazing.scopeNote}
        setGrazing={setGrazing}
      />
      <GrazingCollectedAmount
        collectedAmount={form.grazing.collectedAmount}
        setGrazing={setGrazing}
      />
    </>
  );
}
