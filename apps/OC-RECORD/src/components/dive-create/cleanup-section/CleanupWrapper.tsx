"use client";

import type { OcRecordForm } from "@/types/form";
import CleanupTypeSelector from "./CleanupTypeSelector";
import LiftingMethodSelector from "./LiftingMethodSelector";
import CleanupCollectedAmount from "./CleanupCollectedAmount";
import UncollectedWasteScaleSelector from "./UncollectedWasteScaleSelector";

type Props = {
  form: OcRecordForm;
  setCleanup: (patch: Partial<OcRecordForm["cleanup"]>) => void;
};

export default function CleanupWrapper({ form, setCleanup }: Props) {
  return (
    <>
      <CleanupTypeSelector wasteTypes={form.cleanup.wasteTypes} setCleanup={setCleanup} />
      <LiftingMethodSelector
        method={form.cleanup.method}
        setCleanup={setCleanup}
      />
      <CleanupCollectedAmount
        collectionAmount={form.cleanup.collectionAmount}
        setCleanup={setCleanup}
      />
      <UncollectedWasteScaleSelector
        uncollectedScale={form.cleanup.uncollectedScale}
        setCleanup={setCleanup}
      />
    </>
  );
}
