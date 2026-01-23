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
      <CleanupTypeSelector types={form.cleanup.types} setCleanup={setCleanup} />
      <LiftingMethodSelector
        liftingMethod={form.cleanup.liftingMethod}
        setCleanup={setCleanup}
      />
      <CleanupCollectedAmount
        collectedAmount={form.cleanup.collectedAmount}
        setCleanup={setCleanup}
      />
      <UncollectedWasteScaleSelector
        uncollectedWasteScale={form.cleanup.uncollectedWasteScale}
        setCleanup={setCleanup}
      />
    </>
  );
}
