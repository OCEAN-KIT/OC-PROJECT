"use client";

import type { OcRecordForm } from "@ocean-kit/submission-domain/types/form";
import GrazingTargetSelector from "./GrazingTargetSelector";
import GrazingDensitySelector from "./GrazingDensitySelector";
import GrazingScopeSelector from "./GrazingScopeSelector";
import GrazingCollectedAmount from "./GrazingCollectedAmount";

type Props = {
  form: OcRecordForm;
  setGrazing: (patch: Partial<OcRecordForm["grazing"]>) => void;
};

export default function GrazingWrapper({ form, setGrazing }: Props) {
  return (
    <>
      <GrazingTargetSelector
        targetSpecies={form.grazing.targetSpecies}
        setGrazing={setGrazing}
      />
      <GrazingDensitySelector
        densityBeforeWork={form.grazing.densityBeforeWork}
        setGrazing={setGrazing}
      />
      <GrazingScopeSelector
        workScope={form.grazing.workScope}
        note={form.grazing.note}
        setGrazing={setGrazing}
      />
      <GrazingCollectedAmount
        collectionAmount={form.grazing.collectionAmount}
        setGrazing={setGrazing}
      />
    </>
  );
}
