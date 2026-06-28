"use client";

import CleanupTypeSelector from "./CleanupTypeSelector";
import LiftingMethodSelector from "./LiftingMethodSelector";
import CleanupCollectedAmount from "./CleanupCollectedAmount";
import UncollectedWasteScaleSelector from "./UncollectedWasteScaleSelector";

export default function CleanupWrapper() {
  return (
    <>
      <CleanupTypeSelector />
      <LiftingMethodSelector />
      <CleanupCollectedAmount />
      <UncollectedWasteScaleSelector />
    </>
  );
}
